define(['./lib/Store', './lib/act/index', './lib/Publish'], function (
               Store,         act,               Publish) {
    return {
        act : act,
        Store : Store,
        Publish : Publish
    };
});
