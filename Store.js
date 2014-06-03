var Act = require('./Act');
var Publish = require('./Publish');

var Store = function () {
    this.act = new Act();
    this.publish = new Publish(this);
    this.items = [];
    // No mutation--any references to `this.items` are guaranteed invariant.

    this.act.streams.append.onValue(function (o) { this.append(o.item);             }.bind(this));
    this.act.streams.insert.onValue(function (o) { this.insert(o.item, o.position); }.bind(this));
    this.act.streams.remove.onValue(function (o) { this.remove(o.position);         }.bind(this));
    this.act.streams.clear.onValue( function (o) { this.clear();                    }.bind(this));
};

Store.prototype.append = function (item) {
    this.items = this.items.concat([item]);
    this.publish.streams.items.push(this.items);
};

Store.prototype.insert = function (item, position) {
    if (position < 0 || this.items.length < position) {
        throw new RangeError();
    }

    var update = this.items.slice(0,position);
    update.push(item);
    this.items = update.concat(this.items.slice(position));

    this.publish.streams.items.push(this.items);
};

Store.prototype.remove = function (position) {
    var head = this.items.slice(0, position);
    this.items = head.concat(this.items.slice(position+1));

    this.publish.streams.items.push(this.items);
};

Store.prototype.clear = function () {
    this.items = [];
    this.publish.streams.items.push(this.items);
};

module.exports = Store;
