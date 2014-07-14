define(['./amd/Publish', './amd/List', './amd/Store', './amd/act/index'], function (
               Publish,         List,         Store,         act) {
    return {
        List : List,
        Publish : Publish,
        Store : Store,
        act : act
    };
});
