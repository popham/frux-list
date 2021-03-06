
    var Item = function (key, value) {
        this._key = key;
        this._value = value;
    };

    Object.defineProperty(Item.prototype, 'key', {
        get : function () { return this._key; }
    });

    Object.defineProperty(Item.prototype, 'value', {
        get : function () { return this._value; }
    });

    module.exports = Item;

