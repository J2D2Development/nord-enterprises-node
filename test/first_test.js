/* eslint-env node, mocha */
const assert = require('assert');
require("babel-register");

import { utilities } from '../static/js/src/admin/utilities';

describe('Test feature', function() {
    describe('Test scenario', function() {
        it('Should work', function() {
            assert(true);
        });
    });
});

describe('Utilities Tests', function() {
    describe('Test SEtup', function() {
        it('Should have a hideLoader function', function() {
            assert.equal(typeof utilities.hideLoader, 'function');
        });
    });
});