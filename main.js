define(['./lib/Publish', './lib/List', './lib/Store', './lib/act/index'], function (
               Publish,         List          Store,         act) {
    return {
        List : List
        Publish : Publish,
        Store : Store,
        act : act
    };
});
