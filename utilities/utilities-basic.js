'use strict';
const connection = require('../db');
const Promise = require('bluebird');

module.exports = {
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

    getDBInfo: function(query) {
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
    },

    getMenuItems: function(arr) {
        let menuItems = [];
        if(arr.length) {
            menuItems = arr.map(item => {
                let urlString = '';
                if(item.action === 'p') {
                    urlString = `page?page_id=${item.action_id}`;
                } else if(item.action === 'f') {
                    urlString = `feature?feature_id=${item.action_id}&item_id=${item.action_item}`;
                } else if(item.action === 'x') {
                    //need to add check for string
                    //1) if http already exists
                    //2) if uses https
                    urlString = `http://${item.action_url}`;
                }
                item.urlString = urlString;
                return item;
            });
        }
        return menuItems;        
    }
}