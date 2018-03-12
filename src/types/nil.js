'use strict';

module.exports = (value, handlers, operations) => {
    const {nil} = handlers;
    const {morph, isNothing} = operations;
    const maybeInterface = {
        isNothing,
        is: () => maybeInterface,
        map: () => maybeInterface,
        flatMap: () => nil(),
        forEach: () => maybeInterface,
        orElse: (fn) => morph(fn(value)),
        orValue: (v) => morph(v),
        get: () => nil()
    };

    return maybeInterface;
};
