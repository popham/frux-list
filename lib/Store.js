var Act = require('./Act');
var Publish = require('./Publish');
var List = require('./List');
var Iterator = require('./Iterator');

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
