if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(['baconjs', './Item'], function (bacon, Item) {
    var Publish = function (store) {
        this.store = store;
        this.streams = { items : new bacon.Bus() };
    };

    Object.defineProperty(Publish.prototype, 'items', {
        get : function () { return this.streams.items.toProperty(this.store.items); }
    });

    return Publish;
});
