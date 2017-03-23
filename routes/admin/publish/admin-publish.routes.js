'use strict';

const express = require('express');
const publishRouter = express.Router();
const connection = require('../../../db');
const Promise = require('bluebird');
const basicUtils = require('../../../utilities/utilities-basic');
//const pageUtils = require('./admin-page.utilities');

publishRouter.route('/')
    .get((req, res) => {
        res.status(200).send('<h1>Publish screen...</h1>');
    });

module.exports = publishRouter;