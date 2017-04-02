'use strict';
const connection = require('../../../db');
const Promise = require('bluebird');

module.exports = {
    getPageList: function(hoa_id) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM hoa_pv_page WHERE hoa_id = ${hoa_id} ORDER BY home_page DESC, title`, (error, results) => {
                if(error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
        });
    },

    getPage: function(hoa_id, page_id) {
        return new Promise((resolve, reject) => {
            connection.query(`SELECT * FROM hoa_pv_page WHERE hoa_id = ${hoa_id} AND page_id = ${page_id}`, (error, results) => {
                if(error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            })
        })
    }
}