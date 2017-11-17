'use strict';

const assert = require('referee').assert;
const {isNothing} = require('../src/default');

describe('Default handlers', function () {
    it('returns conditional state if value is nothing', function () {
        const value1 = 'test';
        const value2 = null;
        const value3 = undefined;
        const value4 = 0;

        assert.equals(isNothing(value1), false);
        assert.equals(isNothing(value2), true);
        assert.equals(isNothing(value3), true);
        assert.equals(isNothing(value4), false);
    });
});
