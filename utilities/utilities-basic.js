'use strict';
const connection = require('../db');
const Promise = require('bluebird');

const utilFunctions = {
    get_hoa_main: function(sitename) {
        return new Promise((resolve, reject) => {
                connection.query(`select * from hoa_main where hoa_id_name = '${sitename}'`, (error, results) => {
                if(error || results.length === 0) {
                    reject(error);
                } else {
                    resolve(results[0]);
                }
            });
        });
    },

    get_hoa_main_aux: function(hoa_id) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM hoa_main_aux WHERE hoa_id = ${hoa_id}`, (error, results) => {
                if(error || results.length === 0) {
                    reject(error);
                } else {
                    resolve(results[0])
                }
            });
        });
    },

    get_hoa_lookfeel: function(hoa_id) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM hoa_pub_lookfeel WHERE hoa_id = ${hoa_id}`, (error, results) => {
                if(error || results.length === 0) {
                    reject(error);
                } else {
                    resolve(results[0]);
                }
            });
        });
    },

    getPageInfo: function(query) {
        return new Promise((resolve, reject) => {
                connection.query(query, (error, results) => {
                    if(error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
        });
    },

    getGraphicalMenuItemImage: function(button_id) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM hoa_buttons WHERE button_id = ${button_id}`, (error, results) => {
                if(error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    }
}

module.exports = utilFunctions;