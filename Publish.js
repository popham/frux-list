var bacon = require('baconjs');

var Publish = function (store) {
    this.store = store;
    this.streams = {
        items : new bacon.Bus()
    };
};

Object.defineProperty(Publish.prototype, 'items', {
    get : function () { return this.streams.items.toProperty(this.store.items); }
});
