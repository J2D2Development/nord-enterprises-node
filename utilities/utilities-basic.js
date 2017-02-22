'use strict';
const connection = require('../db');
const Promise = require('bluebird');

function get_hoa_main(sitename) {
    return new Promise((resolve, reject) => {
            connection.query(`select * from hoa_main where hoa_id_name = '${sitename}'`, (error, results) => {
            if(error || results.length === 0) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
}

function get_hoa_main_aux(hoa_id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM hoa_main_aux WHERE hoa_id = ${hoa_id}`, (error, results) => {
            if(error || results.length === 0) {
                reject(error);
            } else {
                resolve(results[0])
            }
        });
    });
}

function get_hoa_lookfeel(hoa_id) {
    return new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM hoa_pub_lookfeel WHERE hoa_id = ${hoa_id}`, (error, results) => {
            if(error || results.length === 0) {
                reject(error);
            } else {
                resolve(results[0]);
            }
        });
    });
}

module.exports = {
    get_hoa_main, get_hoa_main_aux, get_hoa_lookfeel
};