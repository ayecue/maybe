'use strict';

const defaultFuncs = require('./default');

function maybe(value, handlers) {
    const {isPromise} = handlers;

    return isPromise(value)
        ? asyncMaybe(value, handlers)
        : syncMaybe(value, handlers);
}

function syncMaybe(value, handlers) {
    const {isPromise, nil} = handlers;
    const morph = (v) => maybe(v, handlers);
    const isNothing = () => handlers.isNothing(value);
    const maybeInterface = {
        isNothing,
        is: (fn) => {
            const conditional = !isNothing() && fn(value);

            if (isPromise(conditional)) {
                return morph(conditional.then((isValid) => isValid ? value : nil()));
            }

            return conditional ? maybeInterface : morph();
        },
        map: (fn) => isNothing() ? maybeInterface : morph(fn(value)),
        flatMap: (fn) => isNothing() ? nil() : fn(value),
        forEach: (fn) => {
            if (!isNothing()) fn(value);
            return maybeInterface;
        },
        orElse: (fn) => isNothing() ? morph(fn(value)) : maybeInterface,
        orValue: (v) => isNothing() ? morph(v) : maybeInterface,
        get: () => isNothing() ? nil() : value
    };

    return maybeInterface;
}

function asyncMaybe(value, handlers) {
    const morph = (v) => asyncMaybe(v, handlers);
    const maybeInterface = syncMaybe(value, handlers);
    const flatResolve = (arg, key) =>  (v) => maybe(v, handlers)[key](arg);
    const resolve = (arg, key) => (v) => flatResolve(arg, key)(v).get();

    return Object.assign({}, maybeInterface, {
        is: (fn) => morph(value.then(resolve(fn, 'is'))),
        map: (fn) => morph(value.then(resolve(fn, 'map'))),
        flatMap: (fn) => value.then(flatResolve(fn, 'flatMap')),
        forEach: (fn) => morph(value.then(resolve(fn, 'forEach'))),
        orElse: (fn) => morph(value.then(resolve(fn, 'orElse'))),
        orValue: (v) => morph(value.then(resolve(v, 'orValue')))
    });
}

function provider(handlers) {
    return (value) => {
        return maybe(value, handlers);
    };
}

module.exports = provider(defaultFuncs);
exports.provider = provider;
