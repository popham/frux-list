var act = require('./act/index');
var Publish = require('./Publish');
var List = require('./List');

    var Store = function () {
        List.call(this);

        this.act = {
            append : new act.Append(this),
            remove : new act.Remove(this),
            replace : new act.Replace(this),
            splice : new act.Splice(this)
        };

        this.publish = new Publish(this);
    };

    Store.prototype = Object.create(List.prototype);

    module.exports = Store;

