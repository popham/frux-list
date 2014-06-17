define(['baconjs'], function (bacon) {
    var Act = function (list) {
        this.stream = new bacon.Bus();
        this.stream.onValue(function (o) {
            list._items = list._items.clone();
            list._items.remove(o.key, o.howMany);
            list.publish.push();
        }.bind(this));
    };

    Act.prototype.push = function (key, howMany) {
        this.stream.push({
            key : key,
            howMany : howMany
        });
    };

    return Act;
});
