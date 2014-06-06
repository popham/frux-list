var Iterator = function (store, key) {
    this._store = store;
    this._key = key;
};

Object.defineProperty(Iterator.prototype, 'item', {
    get : function () { return this._store.items.item(this._key); }
});

Object.defineProperty(Iterator.prototype, 'hasNext', {
    get : function () { return this._store.items.hasNext(this._key); }
});

Object.defineProperty(Iterator.prototype, 'hasPrior', {
    get : function () { return this._store.items.hasPrior(this._key); }
});

Iterator.prototype.increment = function () {
    this._key = this._store.items.nextKey(this._key);
    return this;
};

Iterator.prototype.decrement = function () {
    this._key = this._store.items.priorKey(this._key);
    return this;
};

module.exports = Iterator;
