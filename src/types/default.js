'use strict';

module.exports = (value, handlers, operations) => {
    const {isPromise, nil} = handlers;
    const {morph, isNothing} = operations;
    const maybeInterface = {
        isNothing,
        is: (fn) => {
            const conditional = fn(value);

            if (isPromise(conditional)) {
                return morph(conditional.then((isValid) => isValid ? value : nil()));
            }

            return conditional ? maybeInterface : morph();
        },
        map: (fn) => morph(fn(value)),
        flatMap: (fn) => fn(value),
        forEach: (fn) => {
            fn(value);
            return maybeInterface;
        },
        orElse: () => maybeInterface,
        orValue: () => maybeInterface,
        get: () => value
    };

    return maybeInterface;
};
