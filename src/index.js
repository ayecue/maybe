'use strict';

const defaultFuncs = require('./default');
const defaultInterface = require('./types/default');
const nilInterface = require('./types/nil');
const asyncInterface = require('./types/async');
const defaultProvider = provider();

function maybe(value, handlers) {
    const {isPromise} = handlers;
    const type = isPromise(value) ? asyncMaybe : syncMaybe;

    return type(value, handlers);
}

function syncMaybe(value, handlers) {
    const {isPromise, nil} = handlers;
    const morph = (v) => maybe(v, handlers);
    const isNothing = () => handlers.isNothing(value);
    const operations = {morph, isNothing};
    const type = isNothing() ? nilInterface : defaultInterface;

    return type(value, handlers, operations);
}

function asyncMaybe(value, handlers) {
    const morph = (v) => asyncMaybe(v, handlers);
    const maybeInterface = syncMaybe(value, handlers);
    const flatResolve = (arg, key) =>  (v) => maybe(v, handlers)[key](arg);
    const resolve = (arg, key) => (v) => flatResolve(arg, key)(v).get();
    const operations = {morph, flatResolve, resolve};

    return Object.assign({}, maybeInterface, asyncInterface(value, operations));
}

function provider(handlers = {}) {
    return (value) => {
        return maybe(value, Object.assign({}, defaultFuncs, handlers));
    };
}

defaultProvider.provider = provider;
module.exports = defaultProvider;
