/* eslint-env node, mocha */
const assert = require('assert');
require("babel-register");

import { utilities } from '../static/js/src/admin/utilities';

describe('Test feature', () => {
    describe('Test scenario', () => {
        it('Should work', () => {
            assert(true);
        });
    });
});

describe('Utilities Tests', () => {
    describe('Test SEtup', () => {
        it('Should have a hideLoader function', () => {
            assert.equal(typeof utilities.hideLoader, 'function');
        });
    });
});