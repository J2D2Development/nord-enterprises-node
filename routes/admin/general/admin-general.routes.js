'use strict';

const express = require('express');
const generalRouter = express.Router();
const connection = require('../../../db');
const Promise = require('bluebird');
const basicUtils = require('../../../utilities/utilities-basic');
//const pageUtils = require('./admin-page.utilities');

generalRouter.route('/')
    .get((req, res) => {
        res.status(200).send('<h1>Admin-General screen...</h1>');
    });

module.exports = generalRouter;