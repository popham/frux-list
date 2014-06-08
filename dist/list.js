!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.fruxList=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
exports.Store = _dereq_('./lib/Store');
exports.Act = _dereq_('./lib/Act');
exports.Publish = _dereq_('./lib/Publish');

},{"./lib/Act":2,"./lib/Publish":6,"./lib/Store":7}],2:[function(_dereq_,module,exports){
var bacon = _dereq_('baconjs');

var Act = function () {
    this.streams = {
        append : new bacon.Bus(),
        splice : new bacon.Bus(),
        remove : new bacon.Bus(),
    };
};

Act.prototype.append = function (values) {
    this.streams.append.push({ values : values });
};

Act.prototype.splice = function (key, howMany, values) {
    this.streams.splice.push({
        key : key,
        howMany : howMany,
        values : values
    });
};

Act.prototype.remove = function (key, howMany) {
    this.streams.remove.push({
        key : key,
        howMany : howMany
    });
};

module.exports = Act;

},{"baconjs":"wY/X68"}],3:[function(_dereq_,module,exports){
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

},{}],4:[function(_dereq_,module,exports){
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

},{}],5:[function(_dereq_,module,exports){
var Item = _dereq_('./Item');

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

List.prototype.hasPrior = function (key) {
    return this.index[key] > 0;
};

List.prototype.nextKey = function (key) {
    return this.items[this.index[key] + 1].key;
};

List.prototype.priorKey = function (key) {
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
        images.push(fn(item.value, item.key));
    }

    return images;
};

module.exports = List;

},{"./Item":3}],6:[function(_dereq_,module,exports){
var bacon = _dereq_('baconjs');

var Publish = function (store) {
    this.store = store;
    this.streams = { items : new bacon.Bus() };
};

Object.defineProperty(Publish.prototype, 'items', {
    get : function () { return this.streams.items.toProperty(this.store.items); }
});

},{"baconjs":"wY/X68"}],7:[function(_dereq_,module,exports){
var Act = _dereq_('./Act');
var Publish = _dereq_('./Publish');
var List = _dereq_('./List');
var Iterator = _dereq_('./Iterator');

var Store = function () {
    this.act = new Act();
    this.publish = new Publish(this);
    this.items = new List();
    // No mutation--any references to `this.items` are guaranteed invariant.

    this.act.streams.append.onValue(function (o) { this.append(o.values);  }.bind(this));
    this.act.streams.splice.onValue(function (o) { this.splice(o.key,
                                                               o.howMany,
                                                               o.values);  }.bind(this));
    this.act.streams.remove.onValue(function (o) { this.remove(o.key,
                                                               o.howMany); }.bind(this));
};

Store.prototype.iterator = function (key) {
    return new Iterator(this, key);
};

Store.prototype.append = function (values) {
    this.items = this.items.clone();
    this.items.append(values);
    this.publish.streams.items.push(this.items);
};

Store.prototype.splice = function (key, howMany, values) {
    this.items = this.items.clone();
    this.items.splice(key, howMany, values);
    this.publish.streams.items.push(this.items);
};

Store.prototype.remove = function (key, howMany) {
    this.items = this.items.clone();
    this.items.remove(key, howMany);
    this.publish.streams.items.push(this.items);
};

module.exports = Store;

},{"./Act":2,"./Iterator":4,"./List":5,"./Publish":6}]},{},[1])
(1)
});