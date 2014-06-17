define(['./act/index', './Publish', './List'], function (
           act,           Publish,     List) {
    var Store = function () {
        List.call(this);

        this.act = {
            append : new act.Append(this),
            remove : new act.Remove(this),
            splice : new act.Splice(this)
        };

        this.publish = new Publish(this);
    };

    Store.prototype = Object.create(List.prototype);

    return Store;
});
