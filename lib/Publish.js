var bacon = require('baconjs');
    var Publish = function (list) {
        this._list = list;

        this.stream = new bacon.Bus();
        this.items = this.stream.toProperty(list._items);
    };

    Publish.prototype.push = function () {
        this.stream.push(this._list._items);
    };

    module.exports = Publish;

