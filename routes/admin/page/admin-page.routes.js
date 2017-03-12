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
        const sitename = req.session['sitename'];
        const hoa_main = req.session['hoa_main'];
        const hoa_main_aux = req.session['hoa_main_aux'];

        pageUtils.getPageList(hoa_id)
        .then(results => {
            if(results.length === 0) {
                return res.status(404).send('Not found!');
            } else {
                const pageList = results;
                return res.render('admin/pages-main.ejs', {
                    hoa_main,
                    hoa_main_aux,
                    sitename,
                    pageList
                });
            }
        })
        .catch(error => {
            console.log('Error getting button bg image:', error);
        });
    });
    //.post and so on... - this .post would be to add new page?

pageRouter.route('/:page_id')
    .all((req, res, next) => {
        //do we need to check session login here?  already doing it at base level
        next();
    })
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
                const featureList = results[2];
                const featureItemList = results[3];
                const pageList = results[4];

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

pageRouter.route('/:page_id/menuitems')
    .get((req, res) => {
        const hoa_id = req.session['hoa_main']['hoa_id'];
        const page_id = +req.params['page_id'];

        basicUtils.getDBInfo(`SELECT * FROM hoa_pub_menuitem WHERE hoa_id = ${hoa_id} AND page_id = ${connection.escape(page_id)};`)
            .then(result => {
                res.json(result);
                // const formattedResult = result.map(item => {
                //     return `
                //         <a title="Click to edit" 
                //             class="menuitem-vertical-img openMenuItemModal"
                //             data-helptext="${item.help_text}"
                //             data-title="${item.title}"
                //             data-action="${item.action}"
                //             data-linkeditemid="${item.action_id}"
                //             data-linkeditemspecific="${item.action_item}">
                //             ${item.title}
                //         <span class="glyphicon glyphicon-pencil edit-icon-right" aria-hidden="true"></span>
                //         </a>
                //     `;
                // });
                // formattedResult.push(`
                //     <a id="addnew-menuitem" class="menuitem-vertical-img openMenuItemModal" title="Add Menu Item">
                //         Add Menu Item
                //         <span class="glyphicon glyphicon-plus edit-icon-right" aria-hidden="true"></span>
                //     </a>
                // `);
                // res.json(formattedResult);
            })
            .catch(err => console.log(err));
    })
    .post((req, res) => {
        //add new menu item
        console.log(req.body);
        console.log(req.user);
        const hoa_id = req.session['hoa_main']['hoa_id'];
        const page_id = +req.params['page_id'];
        const update = req.body;
        //!!!3 different kinds of menu item (p, f, x)- how to tell what to pass as update?  just pass everything?  figure that out next!
        res.status(200).send('post received...');

        //need to use backtics because 'order' is a keyword in sql and query doesn't work otherwise!
        basicUtils.getDBInfo('SELECT MAX(`order`) AS next FROM hoa_pv_menuitem WHERE hoa_id = ' + hoa_id + ' AND page_id = ' + page_id)
            .then(result => {
                console.log(result.next + 1);
                const nextOrder = result.next + 1;
                //sql query
                const query = `INSERT INTO hoa_pv_menuitem SET hoa_id = ${hoa_id}, page_id = ${page_id}, order = ${nextOrder}, title = ${connection.escape()} ... updt_user = ${req.user.username}`;

                // basicUtils.getDBInfo(``)
                //     .then(result => {

                //     })
            });
    });

    //edit/delete individual menu items
    pageRouter.route('/:page_id/menuitems/:menu_item_id')
        .put((req, res) => {
            //update existing menu item
            
        })
        .delete((req, res) => {
            //delete existing menu item
        });


module.exports = pageRouter;