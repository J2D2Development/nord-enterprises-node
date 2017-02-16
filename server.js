'use strict';

const path = require('path');
const express = require('express');
//app.use(cookieParser('secretString'));
//app.use(session({cookie: { maxAge: 60000 }}));
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
    cookie: { maxAge: 60000 }
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.disable('x-powered-by');

app.use((req, res, next) => {
    let sitename = '';
    //console.log(req.originalUrl);

    if(req.originalUrl === '/') {
        if(req.headers.host === 'localhost') {
            sitename = 'info';
        } else {
            sitename = req.headers.host;
        }
        get_hoa_main();
    } else if(req.originalUrl.split('/').length > 1 && 
        req.originalUrl.split('/')[1] !== 'login-adminpost' &&
        req.originalUrl.split('/')[1] !== 'logout') {
        const urlArray = req.originalUrl.split('/');
        sitename = urlArray[1];
        get_hoa_main();
    } else {
        next();
    }

    function get_hoa_main() {
        connection.query(`select * from hoa_main where hoa_id_name = '${sitename}'`, (error, results) => {
            if(error || results.length === 0) {
                req.session.sitename = sitename;
                res.status(404).render('templates-error/site-not-found.ejs', {
                    submittedSitename: req.session.sitename
                });
            } else {
                req.session.sitename = results[0]['hoa_id_name'];
                req.session['hoa_main'] = results[0];
                get_hoa_main_aux(results[0]['hoa_id']);
            }
        });
    }

    function get_hoa_main_aux(hoa_id) {
        connection.query(`SELECT * FROM hoa_main_aux WHERE hoa_id = ${hoa_id}`, (error, results) => {
            if(error || results.length === 0) {
                res.status(404).render('templates-error/site-not-found.ejs', {
                    submittedSitename: req.session.sitename
                });
            } else {
                req.session['hoa_main_aux'] = results[0];
                get_hoa_lookfeel(hoa_id);
            }
        });
    }

    function get_hoa_lookfeel(hoa_id) {
        connection.query(`SELECT * FROM hoa_pub_lookfeel WHERE hoa_id = ${hoa_id}`, (error, results) => {
            if(error || results.length === 0) {
                res.status(404).send('Not found!');
                //might change this to 'no published look yet' error
            } else {
                req.session['hoa_lookfeel'] = results[0];
                next();
            }
        });
    }


});


passport.use(new LocalStrategy(
    { passReqToCallback: true },
    (req, username, password, done) => {
        const hoa_id = req.session['hoa_main']['hoa_id'];
        connection.query(`SELECT * FROM hoa_user WHERE hoa_id=${hoa_id} AND username='${username}'`, (error, results) => {
            if(error) {
                return done(error);
            } else if(!results[0] || results[0].length === 0) {
                return done(null, false, { message: 'No user found' });
            } else if(!mysql_old_password_decode(password, results[0].password)) {
                return done(null, false, { message: 'Invalid Password' });
            } else {
                return done(null, results[0], { message: `Welcome back, ${results[0]['first_name']}`});
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

app.get('/', (req, res, next) => {
    res.redirect(`${req.session['sitename']}/page`);
});

//for some reason this redirects too many times.
// app.get('/site-not-found', (req, res) => {
//     res.status(404).render('templates-error/site-not-found.ejs', {
//         submittedSitename: req.session.sitename
//     });
// });

app.get('/:sitename/logout', (req, res) => {
    const sitename = req.session['sitename'];
    req.logout();
    console.log('session after logout:', req.session);
    req.session.destroy(err => {
        if(err) console.log('session destroy error:', err);
        console.log('session after destroy:', req.session);
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

app.get('/admin', (req, res) => {
    res.redirect(`${req.session['sitename']}/admin`);
});

app.get('/:sitename/admin', (req, res) => {
    console.log('on admin:', req.session['flash']);
    if(req.user) {
        let message;
        if(req.session['flash'] && req.session['flash']['success']) {
            message = req.session['flash']['success'][0];
            req.session['flash'] = {};
        }

        res.render('cp/index-admin.ejs', {
            sitename: req.session['sitename'],
            hoa_lookfeel: req.session['hoa_lookfeel'],
            user: req.user,
            message: message
        });
    } else {
        let message;
        if(req.session['flash'] && req.session['flash']['error']) {
            message = req.session['flash']['error'][0];
            req.session['flash'] = {};
        }

        res.render('cp/login-admin.ejs', {
            sitename: req.session['sitename'],
            hoa_lookfeel: req.session['hoa_lookfeel'],
            message: message
        });
    }  
});

app.get('/unavailable', (req, res) => {
    req.session.destroy(err => {
        if(err) console.log('session destroy error:', err);
        res.render('db-down.ejs');
    });
});



app.get('/:sitename', (req, res, next) => {
    res.redirect(`${req.session['sitename']}/page`);
});

app.get('/:sitename/page', (req, res, next) => {
    const hoa_main = req.session['hoa_main'];
    const hoa_main_aux = req.session['hoa_main_aux'];
    const hoa_lookfeel = req.session['hoa_lookfeel'];
    const page_id = +req.query['page_id'] || 1;
    get_page_info(page_id);

    function get_page_info(pageid) {
        //using multiple statements in one query- need to be sure to sanitize/escape all input data- also explore 'q' library for switchng to promises:
            //escape data: https://github.com/mysqljs/mysql#escaping-query-values
                //-use connection.escape(var) ?
            //http://stackoverflow.com/questions/6622746/approach-to-multiple-mysql-queries-with-node-js
            //http://www.thegeekstuff.com/2014/01/mysql-nodejs-intro/?utm_source=tuicool
        connection.query(`SELECT * FROM hoa_pub_page WHERE hoa_id = ${hoa_main['hoa_id']} AND page_id = ${connection.escape(pageid)}; SELECT * FROM hoa_pub_page_area WHERE hoa_id = ${hoa_main['hoa_id']} AND page_id = ${connection.escape(pageid)}; SELECT * FROM hoa_pub_menuitem WHERE hoa_id = ${hoa_main['hoa_id']} AND page_id = ${connection.escape(pageid)};`, (error, results) => {
            if(error) {
                throw error;
            } else {
                if(results[0].length === 0) {
                    res.status(404).send('Not found!');
                } else {
                    const pageInfo = results[0][0];
                    const title = req.query['page_id'] && req.query['page_id'] !== 1 ? pageInfo['title'] : hoa_main['short_name'];
                    const template = templates[hoa_lookfeel['nav_orientation']];

                    res.render(template, {
                        hoa_main: hoa_main,
                        hoa_main_aux: hoa_main_aux,
                        hoa_lookfeel: hoa_lookfeel,
                        title: title,
                        pageAreas: results[1],
                        menuItems: results[2]
                    });
                }
            }
        })
    }
});


//testing templates: get lookfeel value and render different template (could extend this to have more template options if it works)
const templates = {
    "v": "index-vertical-basic.ejs",
    "h": "index-horizontal-basic.ejs"  
};

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