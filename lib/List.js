var MutableList = require('./_List');
var Iterator = require('./Iterator');

    var List = function (initial) {
        initial = initial || [];
        this._items = new MutableList();
        this._items.append(initial);
    };

    List.prototype.iterator = function (key) {
        return new Iterator(this, key);
    };

    List.prototype.value = function (key) {
        return this.iterator(key).value;
    };

    Object.defineProperty(List.prototype, 'values', {
        get: function () { return this._items.values; }
    });

    Object.defineProperty(List.prototype, 'first', {
        get : function () { return this.iterator(this._items.firstKey); }
    });

    Object.defineProperty(List.prototype, 'last', {
        get: function () { return this.iterator(this._items.lastKey); }
    });

    module.exports = List;

