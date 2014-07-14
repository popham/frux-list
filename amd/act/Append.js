define(['baconjs'], function (bacon) {
    var Act = function (list) {
        this.stream = new bacon.Bus();
        this.stream.onValue(function (o) {
            list._items = list._items.clone();
            list._items.append(o.values);
            list.publish.push();
        }.bind(this));
    };

    Act.prototype.push = function (values) {
        this.stream.push({ values : values });
    };

    return Act;
});
