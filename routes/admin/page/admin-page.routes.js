'use strict';

const express = require('express');
const pageRouter = express.Router();
const connection = require('../../../db');
const Promise = require('bluebird');
const basicUtils = require('../../../utilities/utilities-basic');
const pageUtils = require('./admin-page.utilities');
const templates = require('../../../templates');

pageRouter.route('/')
    .get((req, res) => {
        const hoa_id = req.session['hoa_main']['hoa_id'];
        const page_id = 1;
        const sitename = req.session['sitename'];

        const hoa_main = req.session['hoa_main'];
        const hoa_main_aux = req.session['hoa_main_aux'];
        const hoa_lookfeel = req.session['hoa_lookfeel'];

        Promise.all([
            basicUtils.getDBInfo(`SELECT * FROM hoa_pub_page WHERE hoa_id = ${hoa_main['hoa_id']} AND page_id = ${connection.escape(page_id)};`), 
            basicUtils.getDBInfo(`SELECT * FROM hoa_pub_page_area WHERE hoa_id = ${hoa_main['hoa_id']} AND page_id = ${connection.escape(page_id)};`), 
            basicUtils.getDBInfo(`SELECT * FROM hoa_pub_menuitem WHERE hoa_id = ${hoa_main['hoa_id']} AND page_id = ${connection.escape(page_id)};`),
            basicUtils.getDBInfo(`SELECT * FROM hoa_feature WHERE hoa_id = ${hoa_main['hoa_id']};`),
            basicUtils.getDBInfo(`SELECT * FROM hoa_feature_item WHERE hoa_id = ${hoa_main['hoa_id']};`),
            pageUtils.getPageList(hoa_id)
        ])
        .then(results => {
            if(results[0].length === 0) {
                return res.status(404).send('Not found!');
            } else {
                const pageInfo = results[0];
                const pageAreas = results[1];
                const featureList = results[3];
                const featureItemList = results[4];
                const pageList = results[5];

                const title = req.query['page_id'] && req.query['page_id'] !== 1 ? pageInfo['title'] : hoa_main['short_name'];
                const template = templates[hoa_lookfeel['nav_orientation']].template;
                //const folder = templates[hoa_lookfeel['nav_orientation']].folder;
                const currentPage = pageList.find(p => p.page_id === page_id);

                //insert selected prop on current page
                pageList.forEach(page => {
                    page.selected = page.page_id === currentPage.page_id;
                });

                //if menu item is graphical, get the background image
                //!!! need to add a new function to handle the menuItems array gen- call it in this block as well as below?
                if(hoa_lookfeel['menu_button_type'] === 'bg_image') {
                    const button_id = hoa_lookfeel['menu_button_id'];
                    basicUtils.getGraphicalMenuItemImage(button_id)
                        .then(button => {
                            //using graphic menu items- got item, now generate info
                            const menuItems = basicUtils.getMenuItems(results[2]);
                            const buttonBgInfo = {
                                buttonBgImg: `/static/images/${button[0].normal_file}`,
                                buttonHoverImg: `/static/images/${button[0].hover_file}`,
                                width: `${button[0].file_width}px`,
                                height: `${button[0].file_height}px`,
                                padding: `0 ${button[0].pad_right}px 0 ${button[0].pad_left}px`
                            };
                            return res.render('admin/pages.ejs', {
                                main_page_template: `./${template}`,
                                hoa_main,
                                hoa_main_aux,
                                hoa_lookfeel,
                                title,
                                pageAreas,
                                menuItems,
                                buttonBgInfo,
                                sitename,
                                pageList,
                                featureList,
                                featureItemList,
                                currentPage
                            });
                        })
                        .catch(error => {
                            console.log('Error getting button bg image:', error);
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
        });
    });
    //.post and so on... - this .post would be to add new page?

pageRouter.route('/:page_id')
    .get((req, res) => {
        const hoa_id = req.session['hoa_main']['hoa_id'];
        const page_id = +req.params['page_id'];
        const sitename = req.session['sitename'];
        const hoa_main = req.session['hoa_main'];
        const hoa_main_aux = req.session['hoa_main_aux'];
        const hoa_lookfeel = req.session['hoa_lookfeel'];

        Promise.all([
            basicUtils.getDBInfo(`SELECT * FROM hoa_pub_page WHERE hoa_id = ${hoa_main['hoa_id']} AND page_id = ${connection.escape(page_id)};`), 
            basicUtils.getDBInfo(`SELECT * FROM hoa_pub_page_area WHERE hoa_id = ${hoa_main['hoa_id']} AND page_id = ${connection.escape(page_id)};`), 
            basicUtils.getDBInfo(`SELECT * FROM hoa_pub_menuitem WHERE hoa_id = ${hoa_main['hoa_id']} AND page_id = ${connection.escape(page_id)};`),
            basicUtils.getDBInfo(`SELECT * FROM hoa_feature WHERE hoa_id = ${hoa_main['hoa_id']} AND feature_id != 8;`),
            basicUtils.getDBInfo(`SELECT * FROM hoa_feature_item WHERE hoa_id = ${hoa_main['hoa_id']};`),
            pageUtils.getPageList(hoa_id)
        ])
        .then(results => {
            if(results[0].length === 0) {
                return res.status(404).send('Not found!');
            } else {
                const pageInfo = results[0];
                const pageAreas = results[1];
                const menuItems = results[2];
                const featureList = results[3];
                const featureItemList = results[4];
                const pageList = results[5];

                const title = req.query['page_id'] && req.query['page_id'] !== 1 ? pageInfo['title'] : hoa_main['short_name'];
                const template = templates[hoa_lookfeel['nav_orientation']].template;
                const currentPage = pageList.find(p => p.page_id === page_id);

                //insert selected prop on current page drop down
                pageList.forEach(page => {
                    page.selected = page.page_id === currentPage.page_id;
                });

                //if menu item is graphical, get the background image
                //!!! need to add a new function to handle the menuItems array gen- call it in this block as well as below?
                if(hoa_lookfeel['menu_button_type'] === 'bg_image') {
                    const button_id = hoa_lookfeel['menu_button_id'];
                    basicUtils.getGraphicalMenuItemImage(button_id)
                        .then(button => {
                            //using graphic menu items- got item, now generate info
                            const buttonBgInfo = {
                                buttonBgImg: `/static/images/${button[0].normal_file}`,
                                buttonHoverImg: `/static/images/${button[0].hover_file}`,
                                width: `${button[0].file_width}px`,
                                height: `${button[0].file_height}px`,
                                padding: `0 ${button[0].pad_right}px 0 ${button[0].pad_left}px`
                            };
                            return res.render('admin/pages.ejs', {
                                main_page_template: `./${template}`,
                                hoa_main,
                                hoa_main_aux,
                                hoa_lookfeel,
                                title,
                                pageAreas,
                                menuItems,
                                buttonBgInfo,
                                sitename,
                                pageList,
                                featureList,
                                featureItemList,
                                currentPage
                            });
                        })
                        .catch(error => {
                            console.log('Error getting button bg image:', error);
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
        });
    });
    //.post for ??? .put for updating page, .delete for deleting page

module.exports = pageRouter;