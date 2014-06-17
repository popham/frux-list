define(['./_List', './Iterator'], function (
     MutableList,     Iterator) {

    var List = function () {
        this._items = new MutableList();
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

    return List;
});
