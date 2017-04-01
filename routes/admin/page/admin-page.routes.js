'use strict';

const express = require('express');
const pageRouter = express.Router();
const connection = require('../../../db');
const Promise = require('bluebird');
const basicUtils = require('../../../utilities/utilities-basic');
const pageUtils = require('./admin-page.utilities');
const templates = require('../../../templates');

//admin page list wrapper
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
                return res.render('admin/pages.ejs', {
                    hoa_main,
                    hoa_main_aux,
                    sitename,
                    pageList,
                    sub_nav: './pages-subnav.ejs',
                });
            }
        })
        .catch(error => {
            console.log('Error getting button bg image:', error);
        });
    });

//return json of pages data (basic)
pageRouter.route('/pages-list')
    .get((req, res) => {
        const hoa_id = req.session['hoa_main']['hoa_id'];
        const billing_type = req.session['hoa_main']['billing_type'] > 0 ? 'extended' : 'basic';
        console.log('BILLING TYPE', billing_type);

        let promiseArray = [
            pageUtils.getPageList(hoa_id),
            basicUtils.getDBInfo(`SELECT * FROM hoa_user WHERE hoa_id = ${hoa_id} AND page_admin = 'y';`)
        ];
        if(billing_type === 'extended') {
            promiseArray.push(basicUtils.getDBInfo(`SELECT * FROM hoa_user_groups WHERE hoa_id = ${hoa_id}`));
            promiseArray.push(basicUtils.getDBInfo(`SELECT * FROM hoa_ug_pages WHERE hoa_id = ${hoa_id}`));
        }

        Promise.all(promiseArray)
        .then(results => {
            if(results[0].length === 0) {
                return res.status(404).json({
                    success: false,
                    errorMsg: 'Error Getting Page Info'
                });
            } else {
                let returnObj = {
                    pageList: results[0],
                    pageAdmins: results[1]
                };
                if(billing_type === 'extended') {
                    returnObj.userGroups = results[2],
                    returnObj.userGroupsAssigned = results[3]
                }
                return res.status(200).json(returnObj);
            }
        })
        .catch(error => {
            return res.status(500).json({
                success: false,
                errorMsg: 'Server Error: ' + error
            });
        });
    })
    .post((req, res) => {
        const hoa_id = req.session['hoa_main']['hoa_id'];
        const page_id = +req.params['page_id'];
        const sitename = req.session['sitename'];
        //const hoa_main = req.session['hoa_main'];
        const submitted = req.body;
        let updt_user = 'undefined user';
        if(req.user && req.user.username) {
            updt_user = req.user.username;
        }

        //validation on submission before going to db
        //MOVE THIS TO FUNCTION
        if(!updt_user) { 
            return res.status(500).json({
                    success: false,
                    msg: 'No user logged in'
                });
        }

        if(!submitted.title) {
            res.status(500).json({
                    success: false,
                    msg: 'Please enter a title'
                });
        }

        const require_auth = submitted.require_auth || 'n';
        const require_group_auth = submitted.require_group_auth || 'n';
        const admin_user = submitted.admin_user || '';

        //check for max(page_id) to get the new page's id
        basicUtils.getDBInfo(`SELECT MAX(page_id) AS next_page_id FROM hoa_pv_page WHERE hoa_id = ${hoa_id}`)
            .then(result => {
                const next_page_id = +result[0].next_page_id + 1;
                console.log('next page:', next_page_id);
                console.log('user:', updt_user);
                console.log('admin user:', submitted.admin_user);
                if(next_page_id) {
                    basicUtils.getDBInfo(`INSERT INTO hoa_pv_page SET hoa_id = ${hoa_id}, page_id = ${next_page_id}, title = ${connection.escape(submitted.title)}, result_desc = ${connection.escape(submitted.result_desc)}, require_auth = ${connection.escape(require_auth)}, require_group_auth = ${connection.escape(require_group_auth)}, admin_user = ${connection.escape(admin_user)}, updt_user = ${connection.escape(updt_user)}`)
                        .then(result => {
                            return res.status(200).json({
                                success: true,
                                msg: 'New Page Added',
                                result: result
                            });
                        });
                } else {
                    return res.status(500).json({
                        success: false,
                        msg: 'Error getting next page id'
                    });
                }
            })
            .catch(err => {
                return res.status(500).json({
                    success: false,
                    msg: 'Error getting max page id: ' + err
                });
            });
    });

//editing page basics (title, password, admin, etc)
pageRouter.route('/pages-list/:page_id')
    .put((req, res) => {
        const hoa_id = req.session['hoa_main']['hoa_id'];
        const page_id = +req.params['page_id'];
        const sitename = req.session['sitename'];
        const hoa_main = req.session['hoa_main'];
        const submitted = req.body;

        return res.status(200).json({
            success: true,
            msg: 'Page Basics Updated'
        });
    })
    .delete((req, res) => {
        const hoa_id = req.session['hoa_main']['hoa_id'];
        const page_id = +req.params['page_id'];
        const sitename = req.session['sitename'];
        const hoa_main = req.session['hoa_main'];

        return res.status(200).json({
            hoa_id,
            page_id,
            sitename
        });
    });

//editing individual page contents (menu/page areas)
pageRouter.route('/page-contents/:page_id')
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
            basicUtils.getDBInfo(`SELECT * FROM hoa_feature WHERE hoa_id = ${hoa_main['hoa_id']} AND feature_id != 8;`),
            basicUtils.getDBInfo(`SELECT * FROM hoa_feature_item WHERE hoa_id = ${hoa_main['hoa_id']};`),
            pageUtils.getPageList(hoa_id)
        ])
        .then(results => {
            if(results[0].length === 0) {
                return res.status(404).send('Not found!');
            } else {
                const pageInfo = results[0];
                const featureList = results[1];
                const featureItemList = results[2];
                const pageList = results[3];

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
                            return res.render('admin/page.ejs', {
                                main_page_template: `./${template}`,
                                sub_nav: './page-subnav.ejs',
                                hoa_main,
                                hoa_main_aux,
                                hoa_lookfeel,
                                title,
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
                        menuItems
                    });
                }
            }
        });
    });

pageRouter.route('/page-contents/:page_id/menuitems')
    .get((req, res) => {
        const hoa_id = req.session['hoa_main']['hoa_id'];
        const page_id = +req.params['page_id'];
        const menu_style = req.session['hoa_lookfeel']['menu_button_type'];

        basicUtils.getDBInfo(`SELECT * FROM hoa_pv_menuitem WHERE hoa_id = ${hoa_id} AND page_id = ${connection.escape(page_id)};`)
            .then(result => {
                if(result.length) {
                    for(let i = 0; i < result.length; i += 1) {
                        result[i].menu_style = menu_style;
                    }
                    res.json(result);
                }
            })
            .catch(err => {
                console.log(err);
                const error = { errorMsg: 'Error getting menu items', err };
                res.json(error);
            });
    })
    .post((req, res) => {
        //add new menu item        
        const hoa_id = req.session['hoa_main']['hoa_id'];
        const page_id = +req.params['page_id'];
        const update = req.body;

        //parse the update
        const title = update.title || '';
        const help_text = update.help_text || '';
        const action = update.action;
        const action_item = update.action_item || 0;
        const action_url = update.action_url || null;
        let updt_user = 'Unknown User';
            if(req.user && req.user.username) {
                updt_user = req.user.username;
            }

        //figure out what type of action and set id- if 'x', adding external link and id should be 0
        let action_id = 0;
        if(update.page_action_id) {
            action_id = update.page_action_id;
        } else if(update.feature_action_id) {
            action_id = update.feature_action_id;
        }

        //need to use backtics because 'order' is a keyword in sql and query doesn't work otherwise!
        basicUtils.getDBInfo('SELECT MAX(`order`) AS next FROM hoa_pv_menuitem WHERE hoa_id = ' + hoa_id + ' AND page_id = ' + connection.escape(page_id))
            .then(result => {
                const nextOrder = result[0].next ? result[0].next + 1 : 1;
                const query = "INSERT INTO hoa_pv_menuitem SET hoa_id = " + hoa_id + ", page_id = " + page_id + ", `order` = " + nextOrder + ", title = " + connection.escape(title) + ", help_text = " + connection.escape(help_text) + ", action = " + connection.escape(action) + ", action_id = " + action_id + ", action_item = " + action_item + ", action_url = " + connection.escape(action_url) + ", updt_user = " + connection.escape(updt_user);

                basicUtils.getDBInfo(query)
                    .then(result => {
                        if(result['affectedRows']) {
                            res.status(200).json({
                                success: true,
                                msg: 'Menu Item Added!',
                                next: true
                            })
                        } else {
                            res.status(503).json({
                                success: false,
                                msg: 'Error adding menu item',
                                next: false
                            });
                        }
                    })
                    .catch(err => {
                        res.status(500).json({
                            success: false,
                            msg: `Server Error: ${err}`,
                            next: false
                        });
                    });
            });
    });

    //edit/delete individual menu items
    pageRouter.route('/page-contents/:page_id/menuitems/:menu_item_id')
        .put((req, res) => {
            //update existing menu item- no unique id field so use order
            const hoa_id = req.session['hoa_main']['hoa_id'];
            const page_id = +req.params['page_id'];
            const update = req.body;

            //parse the update
            const title = update.title || '';
            const help_text = update.help_text || '';
            const action = update.action;
            const action_item = update.action_item || 0;
            const action_url = update.action_url || null;
            const order = +req.params['menu_item_id'];
            let updt_user = 'Unknown User';
            if(req.user && req.user.username) {
                updt_user = req.user.username;
            }

            //figure out what type of action and set id- if 'x', adding external link and id should be 0
            let action_id = 0;
            if(update.page_action_id) {
                action_id = update.page_action_id;
            } else if(update.feature_action_id) {
                action_id = update.feature_action_id;
            }

            const query = "UPDATE hoa_pv_menuitem SET title = " + connection.escape(title) + ", help_text = " + connection.escape(help_text) + ", action = " + connection.escape(action) + ", action_id = " + action_id + ", action_item = " + action_item + ", action_url = " + connection.escape(action_url) + ", updt_user = " + connection.escape(updt_user) + " WHERE hoa_id = " + hoa_id + " AND page_id = " + page_id + " AND `order` = " + order;
            
            basicUtils.getDBInfo(query)
                .then(result => {
                    if(result['affectedRows']) {
                        res.status(200).json({
                            success: true,
                            msg: 'Menu Item Updated!',
                            next: true
                        })
                    } else {
                        res.status(503).json({
                            success: false,
                            msg: 'Error updating menu item',
                            next: false
                        });
                    }
                })
                .catch(err => {
                    res.status(500).json({
                        success: false,
                        msg: `Server Error: ${err}`,
                        next: false
                    });
                });
        })
        .delete((req, res) => {
            //delete existing menu item
            const hoa_id = req.session['hoa_main']['hoa_id'];
            const page_id = +req.params['page_id'];
            const order = +req.params['menu_item_id'];

            const queryCheck = "SELECT * FROM hoa_pv_menuitem WHERE hoa_id = " + hoa_id + " AND page_id = " + connection.escape(page_id) + " AND `order` = " + order;

            const queryDelete = "DELETE FROM hoa_pv_menuitem WHERE hoa_id = " + hoa_id + " AND page_id = " + connection.escape(page_id) + " AND `order` = " + order;

            const queryUpdateOrder = "UPDATE hoa_pv_menuitem SET `order` = (`order` - 1) WHERE hoa_id = " + hoa_id + " AND page_id = " + page_id + " AND `order` > " + order;

            basicUtils.getDBInfo(queryCheck)
                .then(result => {
                    return result.length;
                })
                .then(rows => {
                    if(rows === 1) {
                        basicUtils.deleteDBInfo(queryDelete)
                            .then(result => {
                                if(result['affectedRows']) {
                                    basicUtils.getDBInfo(queryUpdateOrder)
                                        .then(finalResult => {
                                            return res.status(200).json({
                                                success: true,
                                                msg: 'Menu Item Deleted!',
                                                next: true
                                            });
                                        })
                                        .catch(error => {
                                            throw new Error('Remaining Order Update Failed', error);
                                        });
                                } else {
                                    return res.status(503).json({
                                        success: false,
                                        msg: 'Error deleting menu item',
                                        next: false
                                    });
                                }
                            })
                            .catch(error => {
                                throw new Error('Remaining Order Update Failed:', error);
                            })
                    } else {
                        throw new Error('Check got result, but error');
                    }   
                })
                .catch(err => {
                    return res.status(500).json({
                        success: false,
                        msg: `Server error: ${err}`,
                        next: false
                    });
                });
        });

pageRouter.route('/page-contents/:page_id/pageareas')
    .get((req, res) => {
        const hoa_id = req.session['hoa_main']['hoa_id'];
        const page_id = +req.params['page_id'];

        basicUtils.getDBInfo(`SELECT * FROM hoa_pv_page_area WHERE hoa_id = ${hoa_id} AND page_id = ${connection.escape(page_id)};`)
            .then(result => {
                res.json(result);
            })
            .catch(err => {
                console.log(err);
                const error = { errorMsg: 'Error getting page areas', err };
                res.json(error);
            });
    })
    .post((req, res) => {
        console.log(req.body);
        console.log(req.user);
        const hoa_id = req.session['hoa_main']['hoa_id'];
        const page_id = +req.params['page_id'];
        const update = req.body;

        res.status(200).send('post received...');

        //need to use backtics because 'order' is a keyword in sql and query doesn't work otherwise!
        basicUtils.getDBInfo('SELECT MAX(`order`) AS next FROM hoa_pv_page_area WHERE hoa_id = ' + hoa_id + ' AND page_id = ' + page_id)
            .then(result => {
                const nextOrder = result[0].next ? result[0].next + 1 : 1;
                console.log('next page area order:', nextOrder);
                console.log('adding page area:', update);
                //sql query
                //const query = `INSERT INTO hoa_pv_page_area SET hoa_id = ${hoa_id}, page_id = ${page_id}, order = ${nextOrder}, title = ${connection.escape()} ... updt_user = ${req.user.username}`;

                // basicUtils.getDBInfo(``)
                //     .then(result => {

                //     })
            });
    });


module.exports = pageRouter;