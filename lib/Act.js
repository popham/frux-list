if (typeof define !== 'function') { var define = require('amdefine')(module); }

define(['baconjs'], function (bacon) {
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

    return Act;
});
