'use strict';

const defaultFuncs = require('./default');

function maybe(value, handlers) {
    const morph = (v) => maybe(v, handlers);
    const isNothing = () => handlers.isNothing(value);
    const maybeInterface = {
        isNothing: isNothing,
        is: (fn) => !isNothing() && fn(value) ? maybeInterface : morph(),
        map: (fn) => isNothing() ? maybeInterface : morph(fn(value)),
        flatMap: (fn) => isNothing() ? null : fn(value),
        forEach: (fn) => {
            if (!isNothing()) fn(value);
            return maybeInterface;
        },
        orElse: (fn) => isNothing() ? morph(fn(value)) : maybeInterface,
        orValue: (v) => isNothing() ? morph(v) : maybeInterface,
        get: () => value
    };

    return maybeInterface;
}

function provider(handlers) {
    return (value) => {
        return maybe(value, handlers);
    };
}

module.exports = provider(defaultFuncs);
exports.provider = provider;
