var Store = require('../lib/Store');
var assert = require('assert');

describe('Appended items', function () {
    it('should trigger a publish', function (done) {
        var s  = new Store();
        var count = 0;
        s.publish.items.onValue(function (items) {
            switch (count) {
            case 0:
                count += 1;
                assert.deepEqual([], items.values);
                s.act.append.push([0,1,2,3]);
                break;
            case 1:
                count += 1;
                assert.deepEqual([0,1,2,3], items.values);
                s.act.append.push([10,11,12]);
                break;
            case 2:
                count += 1;
                assert.deepEqual([0,1,2,3,10,11,12], items.values);
                done();
                break;
            }
        });
    });
});

describe('Splicing items', function () {
    it('should trigger a publish', function (done) {
        var s  = new Store();
        var count = 0;
        s.publish.items.onValue(function (items) {
            switch (count) {
            case 0:
                count += 1;
                assert.deepEqual([], items.values);
                s.act.append.push([0,1,2,3]);
                break;
            case 1:
                count += 1;
                assert.deepEqual([0,1,2,3], items.values);
                var key = items.firstKey;
                key = items.nextKey(key);
                key = items.nextKey(key);
                s.act.splice.push(key, 1, [10,11,12]);
                break;
            case 2:
                count += 1;
                assert.deepEqual([0,1,10,11,12,3], items.values);
                done();
                break;
            }
        });
    });
});

describe('Removing items', function () {
    it('should trigger a publish', function (done) {
        var s  = new Store();
        var count = 0;
        s.publish.items.onValue(function (items) {
            switch (count) {
            case 0:
                count += 1;
                assert.deepEqual([], items.values);
                s.act.append.push([0,1,2,3]);
                break;
            case 1:
                count += 1;
                assert.deepEqual([0,1,2,3], items.values);
                var key = items.firstKey;
                key = items.nextKey(key);
                s.act.remove.push(key, 2);
                break;
            case 2:
                count += 1;
                assert.deepEqual([0,3], items.values);
                done();
                break;
            }
        });
    });
});
