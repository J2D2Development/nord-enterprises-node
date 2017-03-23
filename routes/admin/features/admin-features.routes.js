'use strict';

const express = require('express');
const featuresRouter = express.Router();
const connection = require('../../../db');
const Promise = require('bluebird');
const basicUtils = require('../../../utilities/utilities-basic');
//const pageUtils = require('./admin-page.utilities');

featuresRouter.route('/')
    .get((req, res) => {
        res.status(200).send('<h1>features screen...</h1>');
    });

module.exports = featuresRouter;