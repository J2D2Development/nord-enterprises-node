'use strict';

const express = require('express');
const adminRouter = express.Router();
const connection = require('../../db');
const Promise = require('bluebird');
const basicUtils = require('../../utilities/utilities-basic');

const adminPageRoutes = require('./page/admin-page.routes');
const adminUsersRoutes = require('./users/admin-users.routes');
const adminFeaturesRoutes = require('./features/admin-features.routes');
const adminGeneralRoutes = require('./general/admin-general.routes');
const adminPublishRoutes = require('./publish/admin-publish.routes');

adminRouter.route('/')
    .all((req, res, next) => {
        checkUser(req.user)
            .then(response => {
                next();
            })
            .catch(error => {
                res.render('admin/login-admin.ejs', {
                    sitename: req.session['sitename'],
                    message: error
                });
            });
    })
    .get((req, res) => {
        let message;
        if(req.session['flash'] && req.session['flash']['success']) {
            message = req.session['flash']['success'][0];
            req.session['flash'] = {};
        }

        res.render('admin/index-admin.ejs', {
            sitename: req.session['sitename'],
            user: req.user,
            message: message,
            sub_nav: './index-subnav.ejs'
        });
    });

adminRouter.use('/pages', adminPageRoutes);
adminRouter.use('/users', adminUsersRoutes);
adminRouter.use('/features', adminFeaturesRoutes);
adminRouter.use('/general', adminGeneralRoutes);
adminRouter.use('/publish', adminPublishRoutes);

function checkUser(user) {
    return new Promise((resolve, reject) => {
        if(!user) {
            reject('Please Log In');
        } else {
            resolve();
        }
    });
}

module.exports = adminRouter;