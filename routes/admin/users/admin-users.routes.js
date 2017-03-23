'use strict';

const express = require('express');
const userRouter = express.Router();
const connection = require('../../../db');
const Promise = require('bluebird');
const basicUtils = require('../../../utilities/utilities-basic');
//const pageUtils = require('./admin-page.utilities');

userRouter.route('/')
    .get((req, res) => {
        res.status(200).send('<h1>Users screen...</h1>');
    });

module.exports = userRouter;