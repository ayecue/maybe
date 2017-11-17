'use strict';

const assert = require('referee').assert;
const maybe = require('../src/index');
const {delay} = require('./utils');

describe('Maybe provider', function () {
    it('default functiality', function () {
        const value1 = maybe('test').get();
        const value2 = maybe(null).get();
        const value3 = maybe(undefined).get();

        assert.equals(value1, 'test');
        assert.equals(value2, null);
        assert.equals(value3, undefined);
    });

    it('default functiality with fallback', function () {
        const value1 = maybe('test')
            .orValue('alt1')
            .get();
        const value2 = maybe(null)
            .orValue('alt2')
            .get();
        const value3 = maybe(undefined)
            .orValue('alt3')
            .get();

        assert.equals(value1, 'test');
        assert.equals(value2, 'alt2');
        assert.equals(value3, 'alt3');
    });

    it('default functiality with callback fallback', function () {
        const value1 = maybe('test')
            .orElse(() => 'alt1')
            .get();
        const value2 = maybe(null)
            .orElse(() => 'alt2')
            .get();
        const value3 = maybe(undefined)
            .orElse(() => 'alt3')
            .get();

        assert.equals(value1, 'test');
        assert.equals(value2, 'alt2');
        assert.equals(value3, 'alt3');
    });

    it('using is as conditional check for value', function () {
        const value1 = maybe('test')
            .is((v) => v === 'test')
            .orValue('alt1')
            .get();
        const value2 = maybe('test2')
            .is((v) => v === 'test')
            .orValue('alt2')
            .get();

        assert.equals(value1, 'test');
        assert.equals(value2, 'alt2');
    });

    it('using map', function () {
        const value1 = maybe('test')
            .map((v) => v + '1')
            .get();
        const value2 = maybe(null)
            .map((v) => v + '2')
            .orValue('alt2')
            .get();

        assert.equals(value1, 'test1');
        assert.equals(value2, 'alt2');
    });

    it('using for-each', function () {
        const value1 = maybe('test')
            .forEach((v) => v + '1')
            .get();
        const value2 = maybe(null)
            .forEach((v) => v + '2')
            .orValue('alt2')
            .get();

        assert.equals(value1, 'test');
        assert.equals(value2, 'alt2');
    });

    it('using flat-map', function () {
        const value1 = maybe('test')
            .flatMap((v) => v + '1');
        const value2 = maybe(null)
            .flatMap((v) => v + '2');

        assert.equals(value1, 'test1');
        assert.equals(value2, null);
    });

    it('doing some async operation', async function () {
        const test = async () => delay(200);
        const result1 = await maybe('test')
            .map(async (v) => {
                await test();

                return v;
            })
            .orElse(async () => {
                await test();

                return 'alt1';
            })
            .get();
        const result2 = await maybe(null)
            .map(async (v) => {
                await test();

                return v;
            })
            .orElse(async () => {
                await test();

                return 'alt2';
            })
            .get();

        assert.equals(result1, 'test');
        assert.equals(result2, 'alt2');
    });
});
