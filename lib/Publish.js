define(['baconjs'], function (bacon) {
    var Publish = function (list) {
        this._list = list;

        this.stream = new bacon.Bus();
        this.items = this.stream.toProperty(list._items);
    };

    Publish.prototype.push = function () {
        this.stream.push(this._list._items);
    };

    return Publish;
});
