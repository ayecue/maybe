'use strict';

exports.isPromise = (value) => {
    return typeof value === 'object' && value instanceof Promise;
};

exports.isNothing = (value) => {
    return value === undefined || value === null;
};

exports.nil = () => {
    return void 0;
};
