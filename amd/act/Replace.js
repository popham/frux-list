define(['baconjs'], function (bacon) {
    var Act = function (list) {
        this.stream = new bacon.Bus();
        this.stream.onValue(function (o) {
            list._items = list._items.clone();
            list._items.replace(o.key, o.values);
            list.publish.push();
        }.bind(this));
    };

    Act.prototype.push = function (key, values) {
        this.stream.push({
            key : key,
            values : values
        });
    };

    return Act;
});
