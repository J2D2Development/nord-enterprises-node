'use strict';

const path = require('path');
const express = require('express');
const Promise = require('bluebird');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const favicon = require('serve-favicon');
// const compression = require('compression');
// const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const connection = require('./db');
const session = require('express-session');
const sprintfJs = require("sprintf-js").sprintf; //needed for old password hash conversion
// const bcrypt = require('bcrypt');

//utility functions
const basicUtils = require('./utilities/utilities-basic');

//import routes files
const adminRoutes = require('./routes/admin/admin.routes');

//import globals
const templates = require('./templates.js');


//passport module - auth system
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
passport.serializeUser(function(user, done) {
    done(null, user);
});
passport.deserializeUser(function(user, done) {
    connection.query(`SELECT * FROM hoa_user WHERE hoa_id=${user['hoa_id']} AND username='${user["username"]}'`, (error, results) => {
        if(error) { 
            done(error);
        } else {
            done(null, results[0]);
        }
    });
});

const app = express();
app.set('view engine', 'ejs');

// app.use(compression());
app.use(helmet());
app.use(favicon(__dirname + '/static/favicon.ico'));
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'SOMERANDOMSECRETHERE', 
    cookie: { maxAge: 60000 * 60 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.disable('x-powered-by');
app.use((req, res, next) => {
    // connection.connect(error => {
    //     if(error) {
    //         return res.status(404).render('templates-error/db-unavailable.ejs', {
    //                 submittedSitename: `${req.headers.host}${req.originalUrl}`,
    //                 error: error
    //             });
    //     }
    // });

    //all went well
    //console.log('session on first load:', req.session);
    let sitename = '';

    if(req.originalUrl === '/') {
        if(req.headers.host === 'localhost') { //this becomes 'home-owners-assoc.com' in production
            sitename = 'info';
        } else {
            sitename = req.headers.host;
        }

        if(sitename !== 'static') {
            //console.log('get basic info from no sitename in path:', sitename);
            get_basic_info(sitename);
        } else {
            next();
        }
        
    } else if(req.originalUrl.split('/').length > 1 && 
        req.originalUrl.split('/')[1] !== 'login-adminpost' &&
        req.originalUrl.split('/')[1] !== 'logout' && 
        req.originalUrl.split('/'[1] !== 'static')) {
        const urlArray = req.originalUrl.split('/');
        sitename = urlArray[1];
        if(sitename !== 'static') {
            //console.log('get basci info from siteanme in path:', sitename);
            get_basic_info(sitename);
        } else {
            next();
        }
    } else {
        //console.log('did not get basic info!');
        //console.log('but session is:', req.session);
        next();
    }

    function get_basic_info(sitename) {
        //console.log('fired get basic info with name:', sitename);
        basicUtils.get_hoa_main(sitename)
            .then(hoa_main => {
                req.session.sitename = hoa_main['hoa_id_name'];
                req.session['hoa_main'] = hoa_main;
                return hoa_main['hoa_id'];
            })
            .then(hoa_id => {
                return Promise.all([basicUtils.get_hoa_main_aux(hoa_id), basicUtils.get_hoa_lookfeel(hoa_id)]);
            })
            .then(results => {
                req.session['hoa_main_aux'] = results[0];
                req.session['hoa_lookfeel'] = results[1];
                next();
            })
            //if above doesn't work, try this: .then(() => next())
            .catch(error => {
                //console.log('in error block:', error);
                req.session.sitename = sitename;
                res.status(404).render('templates-error/site-not-found.ejs', {
                    submittedSitename: req.session.sitename,
                    error: error
                });
            });
    }
});




passport.use(new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
        const hoa_id = req.session['hoa_main']['hoa_id'];
        //console.log('hoa id on login:', hoa_id);
        connection.query(`SELECT * FROM hoa_user WHERE hoa_id=${hoa_id} AND username='${username}'`, (error, results) => {
            if(error) {
                return done(error);
            } else if(!results[0] || results[0].length === 0) {
                return done(null, false, { message: 'No user found' });
            } else if(!mysql_old_password_decode(password, results[0].password)) {
                return done(null, false, { message: 'Invalid Password' });
            } else {
                const user = {
                    username: results[0].username,
                    hoa_id: results[0].hoa_id,
                    first_name: results[0].first_name,
                    last_name: results[0].last_name,
                    site_admin: results[0].site_admin,
                    email: results[0].email
                };
                //console.log('user on setup:', user);
                return done(null, user, { message: `Welcome back, ${user.first_name}`});
            }
        });

        function mysql_old_password_decode(password, hash) {
            let nr = 1345345333, add = 7, nr2 = 0x12345671, tmp = null;
            const inlen = password.length;
            for (let i = 0; i < inlen; i += 1) {
                let byte = password.substring(i, i+1);
                if (byte === ' ' || byte === "\t") continue;
                tmp = byte.charCodeAt(0);
                nr ^= (((nr & 63) + add) * tmp) + ((nr << 8) & 0xFFFFFFFF);
                nr2 += ((nr2 << 8) & 0xFFFFFFFF) ^ nr;
                add += tmp;
            }
            const out_a = nr & ((1 << 31) - 1);
            const out_b = nr2 & ((1 << 31) - 1);
            const output = sprintfJs("%08x%08x", out_a, out_b);
            return output === hash;
        }
    }
));

app.get('/', (req, res) => {
    res.redirect(`${req.session['sitename']}/page`);
});



app.get('/:sitename/logout', (req, res) => {
    const sitename = req.session['sitename'];
    req.logout();
    req.session.destroy(err => {
        if(err) console.log('session destroy error:', err);
        res.redirect(`/${sitename}/page`);
    });
});


//admin login routes?
app.post('/login-adminpost', (req, res, next) => {
    passport.authenticate('local', 
    { 
        successRedirect: `/${req.session['sitename']}/admin`,
        failureRedirect: `/${req.session['sitename']}/admin`,
        failureFlash: true,
        successFlash: true
    })(req, res, next);
});

//redirects (so sitename is always first position in url array)
app.get('/:sitename', (req, res) => {
    res.redirect(`${req.session['sitename']}/page`);
});

app.get('/admin', (req, res) => {
    res.redirect(`${req.session['sitename']}/admin`);
});


//base site route - homepage
//split this to new file, and have /page and /page/page_id routes (instead of passing via query in url string)
app.get('/:sitename/page', (req, res) => {
    const hoa_main = req.session['hoa_main'];
    const hoa_main_aux = req.session['hoa_main_aux'];
    const hoa_lookfeel = req.session['hoa_lookfeel'];
    const page_id = +req.query['page_id'] || 1;
    
    Promise.all([
        basicUtils.getDBInfo(`SELECT * FROM hoa_pub_page WHERE hoa_id = ${hoa_main['hoa_id']} AND page_id = ${connection.escape(page_id)};`), 
        basicUtils.getDBInfo(`SELECT * FROM hoa_pub_page_area WHERE hoa_id = ${hoa_main['hoa_id']} AND page_id = ${connection.escape(page_id)};`), 
        basicUtils.getDBInfo(`SELECT * FROM hoa_pub_menuitem WHERE hoa_id = ${hoa_main['hoa_id']} AND page_id = ${connection.escape(page_id)};`)
    ])
    .then(results => {
        if(results[0].length === 0) {
            return res.status(404).send('Not found!');
        } else {
            const pageInfo = results[0];
            const pageAreas = results[1];
            const title = req.query['page_id'] && req.query['page_id'] !== 1 ? pageInfo['title'] : hoa_main['short_name'];
            const template = templates[hoa_lookfeel['nav_orientation']].template;
            const folder = templates[hoa_lookfeel['nav_orientation']].folder;

            //if menu item is graphical, get the background image
            //!!! need to add a new function to handle the menuItems array gen- call it in this block as well as below?
            if(hoa_lookfeel['menu_button_type'] === 'bg_image') {
                const button_id = hoa_lookfeel['menu_button_id'];
                basicUtils.getGraphicalMenuItemImage(button_id)
                    .then(button => {
                        //using graphic menu items- got item, now generate info
                        const menuItems = basicUtils.getMenuItems(results[2]);
                        const buttonBgInfo = {
                            buttonBgImg: `../static/images/${button[0].normal_file}`,
                            buttonHoverImg: `../static/images/${button[0].hover_file}`,
                            width: `${button[0].file_width}px`,
                            height: `${button[0].file_height}px`,
                            padding: `0 ${button[0].pad_right}px 0 ${button[0].pad_left}px`
                        };
                        return res.render('index-main.ejs', {
                            main_template_body: `${folder}/${template}`,
                            hoa_main,
                            hoa_main_aux,
                            hoa_lookfeel,
                            title,
                            pageAreas,
                            menuItems,
                            buttonBgInfo
                        });
                    })
                    .catch(error => {
                        //console.log('Error getting button bg image:', error);
                    });
            } else {
                //not using graphical menu items, don't need to fetch bg image
                let menuItems = basicUtils.getMenuItems(results[2]);
                return res.render(template, {
                    hoa_main,
                    hoa_main_aux,
                    hoa_lookfeel,
                    title,
                    pageAreas,
                    menuItems
                });
            }
        }
    })
    .catch(error => {
        //console.log(error);
    });
});

//admin panel routing
app.use('/:sitename/admin', adminRoutes);

app.get('/unavailable', (req, res) => {
    req.session.destroy(err => {
        if(err) console.log('session destroy error:', err);
        res.render('db-down.ejs');
    });
});

const server = app.listen(80, '127.0.0.1', function() {
	console.log('Server started!');
    connection.connect(error => {
        if(error) console.log('error in connection:', error);
    });
});

process.on('exit', () => {
    console.log('goodbye!');
    connection.end(error => {
        if(error) console.log('error in closing:', error);
    });
})

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}