'use strict'

const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// const compression = require('compression');
// const jwt = require('jsonwebtoken');
const helmet = require('helmet');
const connection = require('./db');
// const bcrypt = require('bcrypt');
//const config = require('./config');

const app = express();

//app.set('secretKey', config.secret);

// app.use(compression());
app.use(helmet());
app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.disable('x-powered-by');

// app.post('/check-prior-login', function(req, res) {
// 	let token = req.body.token || req.query.token || req.headers['x-access-token'];
// 	let username = req.body.user || req.query.user;

// 	if (token) {
// 		jwt.verify(token, app.get('secretKey'), function(err, decoded) {      
// 		if (err) {
// 			res.json({ success: false, message: 'Token found, but not legitimate' });    
// 		} else {
// 			// if everything is good, save to request for use in other routes
// 			req.decoded = decoded;
// 			User.findOne({username: username}, function(err, user) {
// 				if(err) { console.log('error getting user'); throw err; }
// 				if(user) {
// 					res.json({user: user.username, firstname: user.firstname, lastname: user.lastname, priorLogin: true, status: `Resume session for ${user.username}`});
// 				} else {
// 					res.json({priorLogin: true, status: 'Could not find user account'});
// 				}
// 			});
// 		}
// 	});
// } else {
// 	res.json({priorLogin: false, status: "no prior login"});
// }
// });

// app.post('/handle-login', function(req, res) {
// 	var username, password;

// 	//check if username provided
// 	if(req.body.username) {
// 		//simple sanitization
// 		username = htmlEntities(req.body.username);
// 	} else {
// 		username = 'No username provided';
// 	}

// 	if(req.body.password) {
// 		password = htmlEntities(req.body.password);
// 	} else {
// 		password = 'No password provided';
// 	}

// 	User.findOne({username: username}, function(err, user) {
// 		if(err) { console.log('error getting user'); throw err; }

// 		if(user) {
// 			bcrypt.compare(password, user.password, function(err, valid) {
// 				if(err) { console.log('bcrypt error:', err); return false; }
// 				if(valid) {
// 					var token = jwt.sign({user:user.username}, app.get('secretKey'), {
// 						expiresIn: "1h"
// 					});
// 					return res.json({ user: user.username, firstname: user.firstname, lastname: user.lastname, loggedIn: true, message: "Logged In!", token: token });
// 				} else {
// 					return res.json({ user: username, loggedIn: false, message: "Incorrect username or password"});
// 				}
// 			});
// 		} else {
// 			return res.json({ loggedIn: false, message: "No User Found"});
// 		}
// 	});
// });

app.get('/', (req, res, next) => {
    console.log('root route:', req.route.path);
    console.log('host/domain:', req.headers.host);
    console.log('origin?', req.headers.origin);

    connection.query('SELECT * FROM hoa_user WHERE hoa_id = 925 AND username = "treehornj"', function(error, results, fields) {
        if(error) {
            return next('error with query:', error);
        }
        console.log(`Greetings, ${results[0].first_name} ${results[0].last_name}`);
    });
    
	res.sendFile(path.join(__dirname + '/index-bk.html'));
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