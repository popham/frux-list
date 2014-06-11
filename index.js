if (typeof define !== 'function') { var define = require('amdefine')(module) }

define(['./lib/Store', './lib/Act', './lib/Publish'], function (
               Store,         Act,         Publish) {
    return {
        Store : Store,
        Act : Act,
        Publish : Publish
    };
});
