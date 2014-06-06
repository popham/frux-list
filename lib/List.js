var Item = require('./Item');

var List = function () {
    this._index = {};
    this._items = [];
    this._nextKey = 1;
};

List.prototype.clone = function () {
    var list = new List();
    list.index = _.extend({}, this._index);
    list.items = this._items.slice(0);
    list.nextKey = this._nextKey;

    return list;
};

List.prototype.item = function (key) {
    return this._items[this._index[key]];
};

List.prototype.hasNext = function (key) { 
    return this.index[key] < this.items.length-1;
};

List.prototype.hasPrevious = function (key) { 
    return this.index[key] > 0;
};

List.prototype.nextKey = function (key) {
    return this.items[this.index[key] + 1].key;
};

List.prototype.previousKey = function (key) {
    return this.items[this.index[key] - 1].key;
};

List.prototype._insert = function (key, values) {
    var position = this._index[key];
    var offset = values.length;
    var tail = this._items.slice(position);

    tail.forEach(function (o) { this._index[o.key] += offset; });

    this._items = this._items.slice(0, position);
    for (var i=0, j=position; i<offset; ++i, ++j) {
        var k = this._nextKey++;

        this._index[k] = j;
        this._items.push(new Item(k, values[i]));
    }
    this._items = this._items.concat(tail);

    return this;
};

List.prototype.append = function (values) {
    for (var i=0, j=this._items.length; i<values.length; ++i, ++j) {
        var k = this._nextKey++;

        this._index[k] = j;
        this._items.push(new Item(k, values[i]));
    }

    return this;
};

List.prototype.splice = function (key, howMany, values) {
    key = this.remove(key, howMany);

    if (values.length === 0) { return this; }

    if (key) {
        this._insert(key, values);
    } else {
        this.append(values);
    }

    return this;
};

List.prototype.remove = function (key, howMany) {
    var position = this._index[key];
    var remove = this._items.slice(position, position+howMany);

    var tail = this._items.slice(position+howMany);

    this._items = this._items.slice(0, position).concat(tail);
    remove.forEach(function (o) { delete this._index[o.key]; });

    return this;
};

List.prototype.some = function (predicate) {
    var i = this._items.length - 1;
    do {
        var item = items[i];
        if (predicate(item.value, item.key)) { return true; }
    } while (i--);

    return false;
};

List.prototype.map = function (fn) {
    var images = [];
    var items = this._items;
    for (var i=0; i<items.length; ++i) {
        var item = items[i];
        images.push(fn(item.key, item.value));
    }

    return images;
};

module.exports = List;
