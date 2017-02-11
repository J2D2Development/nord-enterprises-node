'use strict';

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// const compression = require('compression');
// const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const connection = require('./db');
const session = require('express-session');
// const bcrypt = require('bcrypt');
//const config = require('./config');

const app = express();
app.set('view engine', 'ejs');

// app.use(compression());
app.use(helmet());
app.use('/static', express.static(path.join(__dirname, 'static')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    resave: true, 
    saveUninitialized: true, 
    secret: 'SOMERANDOMSECRETHERE', 
    cookie: { maxAge: 60000 }
}));

app.disable('x-powered-by');

app.use((req, res, next) => {
    let sitename = '';

    if(req.originalUrl === '/') {
        if(req.headers.host === 'localhost') {
            sitename = 'info';
        } else {
            sitename = req.headers.host;
        }
        get_hoa_main();
    } else if(req.originalUrl.split('/').length > 1 && req.originalUrl.split('/')[1] !== 'favicon.ico') {
        const urlArray = req.originalUrl.split('/');
        sitename = urlArray[1];
        get_hoa_main();
    }

    function get_hoa_main() {
        connection.query(`select * from hoa_main where hoa_id_name = '${sitename}'`, (error, results) => {
            if(error || results.length !== 1) {
                req.session.sitename = 'unavailable';
                req.session['short_name'] = 'Not Found';
                next();
            } else {
                req.session.sitename = results[0]['hoa_id_name'];
                req.session['hoa_main'] = results[0];
                get_hoa_lookfeel(results[0]['hoa_id']);
            }
        });
    }

    function get_hoa_lookfeel(hoa_id) {
        connection.query(`SELECT * FROM hoa_pub_lookfeel WHERE hoa_id = ${hoa_id}`, (error, results) => {
            if(error || results.length !== 1) {
                throw error;
            } else {
                req.session['hoa_lookfeel'] = results[0];
                next();
            }
        });
    }
});

app.get('/', (req, res, next) => {
    console.log('homepage redirect');
    res.redirect(`${req.session['sitename']}/page`);
});

app.get('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if(err) console.log('session destroy error:', err);
        res.redirect('/');
    });
});

app.get('/unavailable', (req, res, next) => {
    req.session.destroy(err => {
        if(err) console.log('session destroy error:', err);
        res.render('db-down.ejs');
    });
});

app.get('/:sitename', (req, res, next) => {
    console.log('/sitename redirect');
    res.redirect(`${req.session['sitename']}/page`);
});

app.get('/:sitename/page', (req, res, next) => {
    const hoa_main = req.session['hoa_main'];
    const hoa_lookfeel = req.session['hoa_lookfeel'];
    const page_id = +req.query['page_id'] || 1;
    get_page_info(page_id);

    function get_page_info(pageid) {
        //using multiple statements in one query- need to be sure to sanitize/escape all input data- also explore 'q' library for switchng to promises:
            //escape data: https://github.com/mysqljs/mysql#escaping-query-values
                //-use connection.escape(var) ?
            //http://stackoverflow.com/questions/6622746/approach-to-multiple-mysql-queries-with-node-js
            //http://www.thegeekstuff.com/2014/01/mysql-nodejs-intro/?utm_source=tuicool
        connection.query(`SELECT * FROM hoa_pub_page WHERE hoa_id = ${hoa_main['hoa_id']} AND page_id = ${pageid};SELECT * FROM hoa_pub_page_area WHERE hoa_id = ${hoa_main['hoa_id']} AND page_id = ${pageid}`, (error, results) => {
            if(error) {
                throw error;
            } else {
                //console.log('first:', typeof results[0], results[0][0]['title']);
                const pageInfo = results[0][0];
                res.render('index.ejs', {
                    short_name: hoa_main['short_name'], 
                    full_name: hoa_main['short_name'],
                    hoa_main: hoa_main,
                    hoa_lookfeel: hoa_lookfeel,
                    title: `${pageInfo['title']}`,
                    pageAreas: results[1]
                });
            }
        })
    }
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