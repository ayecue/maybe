'use strict';

module.exports = (value, operations) => {
    const {morph, resolve, flatResolve} = operations;
    const maybeInterface = {
        is: (fn) => morph(value.then(resolve(fn, 'is'))),
        map: (fn) => morph(value.then(resolve(fn, 'map'))),
        flatMap: (fn) => value.then(flatResolve(fn, 'flatMap')),
        forEach: (fn) => morph(value.then(resolve(fn, 'forEach'))),
        orElse: (fn) => morph(value.then(resolve(fn, 'orElse'))),
        orValue: (v) => morph(value.then(resolve(v, 'orValue')))
    };

    return maybeInterface;
};
