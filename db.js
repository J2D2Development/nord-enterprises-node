'use strict';
const config = require('./config');

const mysql = require('mysql');
const connection = mysql.createConnection({
    host: config.host,
    user: config.user,
    password: config.pass,
    database: config.db_name,
    multipleStatements: true
});

module.exports = connection;