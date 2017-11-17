'use strict';

exports.delay = (time = 1000) => {
    return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
            clearTimeout(timer);
            resolve(true);
        }, time);
    });
};
