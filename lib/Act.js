var bacon = require('baconjs');

var Act = function () {
    this.streams = {
        append : new bacon.Bus(),
        insert : new bacon.Bus(),
        remove : new bacon.Bus(),
        clear  : new bacon.Bus()
    };
};

Act.prototype.append = function (item) {
    this.streams.append.push({ 
        item : item
    });
};

Act.prototype.insert = function (item, position) {
    this.streams.insert.push({
        item     : item,
        position : position
    });
};

Act.prototype.remove = function (position) {
    this.streams.remove.push({
        position : position
    });
};

Act.prototype.clear = function () {
    this.streams.clear.push({});
};

module.exports = Act;
