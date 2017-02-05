'use strict'

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
    //custom middleware- how?
    console.log('It is:', Date.now());
    next();
});

app.get('/', (req, res, next) => {
    console.log('root route:', req.route.path);
    console.log('host/domain:', req.headers.host);
    console.log('origin?', req.headers.origin);
    console.log('session in request?', req.session);

    if(!req.session.sitename) {
        req.session.sitename = req.headers.host === 'localhost' ? 'info' : req.headers.host;
    }
    console.log('sitename:', req.session.sitename);
    connection.query(`select * from hoa_main where hoa_id_name = '${req.session.sitename}'`, (error, results) => {
        if(error) return next('Query error:', error);
        if(results.length !== 1) {
            res.redirect('db-down.ejs');
        }
        console.log('results len:', results.length);

        res.render('index.ejs', {
            short_name: results[0].short_name, 
            full_name: results[0].full_name
        });
    }); 
});

app.get('/logout', (req, res, next) => {
    console.log('on logout path');
    req.session.destroy(err => {
        if(err) console.log('session destroy error:', err);
        res.redirect('/');
    });
})

app.get('/:sitename', (req, res, next) => {
    //for demo sites and sites without domain names and info site- need to check to be sure host is 'home-owners-assoc' - then grab the path and get the sitename we're dealing with.  when going live, switch 'localhost' with 'home-owners-assoc.com'
    if(!req.session.sitename) {
        req.session.sitename = req.headers.host === 'localhost' ? req.params.sitename : req.headers.host;
        console.log('was no sitename, now it is:', req.session.sitename);
    }
    console.log('sitename already set:', req.session.sitename);
    res.send(req.session.sitename);
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