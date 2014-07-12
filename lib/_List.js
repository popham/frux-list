define(['lodash', './Item'], function (_, Item) {

    var List = function () {
        this._index = {};
        this._items = [];
        this._nextKey = 1;
    };

    Object.defineProperty(List.prototype, 'values', {
        get : function () {
            return this.map(function (value) { return value; });
        }
    });

    Object.defineProperty(List.prototype, 'firstKey', {
        get : function () {
            return this._items[0].key;
        }
    });

    Object.defineProperty(List.prototype, 'lastKey', {
        get : function () {
            return this._items[this._items.length-1].key;
        }
    });

    List.prototype.clone = function () {
        var list = new List();
        list._index = _.extend({}, this._index);
        list._items = this._items.slice(0);
        list._nextKey = this._nextKey;

        return list;
    };

    List.prototype.item = function (key) {
        return this._items[this._index[key]];
    };

    List.prototype.hasNext = function (key) { 
        return this._index[key] < this._items.length-1;
    };

    List.prototype.hasPrior = function (key) {
        return this._index[key] > 0;
    };

    List.prototype.nextKey = function (key) {
        return this._items[this._index[key] + 1].key;
    };

    List.prototype.priorKey = function (key) {
        return this._items[this._index[key] - 1].key;
    };

    List.prototype._insert = function (key, values) {
        var position = this._index[key];
        var offset = values.length;
        var tail = this._items.slice(position);

        tail.forEach(function (o) { this._index[o.key] += offset; }.bind(this));

        this._items = this._items.slice(0, position);
        for (var i=0, j=position; i<offset; ++i, ++j) {
            var k = this._nextKey++;

            this._index[k] = j;
            this._items.push(new Item(k, values[i]));
        }
        this._items = this._items.concat(tail);
    };

    List.prototype.append = function (values) {
        for (var i=0, j=this._items.length; i<values.length; ++i, ++j) {
            var k = this._nextKey++;
            this._index[k] = j;
            this._items.push(new Item(k, values[i]));
        }
    };

    List.prototype.replace = function (key, values) {
        var position = this._index[key];
        var offset = values.length;
        var overflow = position + offset - this._items.length;

        for (var i=0, j=position; i<offset; ++i, ++j) {
            this._items[j] = values[i];
        }

        if (overflow > 0) {
            this.append(values.slice(overflow));
        }
    };

    List.prototype.splice = function (key, howMany, values) {
        key = this.remove(key, howMany);

        if (values.length === 0) { return this; }

        if (key) {
            this._insert(key, values);
        } else {
            this.append(values);
        }
    };

    List.prototype.remove = function (key, howMany) {
        var position = this._index[key];
        var tail = this._items.slice(position+howMany);
        var remove = this._items.slice(position, position+howMany);

        tail.forEach(function (o) { this._index[o.key] -= howMany; }.bind(this));

        this._items = this._items.slice(0, position).concat(tail);
        remove.forEach(function (o) { delete this._index[o.key]; }.bind(this));

        return tail[0] ? tail[0].key : undefined;
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

    return List;
});
