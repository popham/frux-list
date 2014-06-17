define([], function () {
    var Iterator = function (list, key) {
        this._list = list;
        this._key = key;
    };

    Object.defineProperty(Iterator.prototype, 'item', {
        get : function () { return this._list._items.item(this._key); }
    });

    Object.defineProperty(Iterator.prototype, 'key', {
        get : function () { return this._key; }
    });

    Object.defineProperty(Iterator.prototype, 'value', {
        get : function () { return this._list._items.item(this._key).value; }
    });

    Object.defineProperty(Iterator.prototype, 'hasNext', {
        get : function () { return this._list._items.hasNext(this._key); }
    });

    Object.defineProperty(Iterator.prototype, 'hasPrior', {
        get : function () { return this._list._items.hasPrior(this._key); }
    });

    Iterator.prototype.increment = function () {
        this._key = this._list._items.nextKey(this._key);
        return this;
    };

    Iterator.prototype.decrement = function () {
        this._key = this._list._items.priorKey(this._key);
        return this;
    };

    return Iterator;
});
