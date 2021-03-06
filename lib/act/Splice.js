var bacon = require('baconjs');
    var Act = function (list) {
        this.stream = new bacon.Bus();
        this.stream.onValue(function (o) {
            list._items = list._items.clone();
            list._items.splice(o.key, o.howMany, o.values);
            list.publish.push();
        }.bind(this));
    };

    Act.prototype.push = function (key, howMany, values) {
        this.stream.push({
            key : key,
            howMany : howMany,
            values : values
        });
    };

    module.exports = Act;

