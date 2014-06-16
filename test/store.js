var Store = require('./lib/Store');
var assert = require('assert');

describe('Appended items', function () {
    it('should not invalidate iterators', function () {
        var s = new Store();
        s.append([0,1,2,3]);
        var oldEnd = s.last;
        s.append([4,5,6]);
        
        assert(oldEnd.hasNext, "Iterator refers to store state");
    });

    it('should appear at the end of all items', function () {
        var s = new Store();
        s.append([0,1,2,3]);
        var oldEnd = s.last;
        s.append([4]);

        assert.strictEqual(s.last.value, 4);
        assert.strictEqual(s.first.value, 0);
    });
});

describe('Item splicing', function () {
    it('should not disrupt iterator validity when unnecessary', function () {
        var s = new Store();
        s.append([0,1,2,3,4]);
        var mid = s.first.increment().increment();

        s.splice(mid.key, 0, [10,11,12]);
        assert.strictEqual(mid.value, 2);

        s.splice(mid.key, 1, [20,21,22]);
        assert.throws(function () { return mid.value; }, TypeError);
        assert.strictEqual(mid.hasNext, false);
        assert.strictEqual(mid.hasPrior, false);
    });

    it('should inject items into the middle', function () {
        var s = new Store();
        s.append([0,1,2,3,4]);
        var mid = s.first.increment().increment();
        s.splice(mid.key, 0, [10,11,12]);

        assert.deepEqual([0, 1, 10, 11, 12, 2, 3, 4], s.items.values);
    });

    it('should overwrite a larger set of items', function () {
        var s = new Store();
        s.append([0,1,2,3,4]);
        var mid = s.first.increment();
        s.splice(mid.key, 3, [10]);

        assert.deepEqual([0, 10, 4], s.items.values);
    });

    it('should overwrite a smaller set of items', function () {
        var s = new Store();
        s.append([0,1,2,3,4]);
        var mid = s.first.increment();
        s.splice(mid.key, 2, [10, 11, 12, 13]);

        assert.deepEqual([0, 10, 11, 12, 13, 3, 4], s.items.values);
    });

    it('should remove a set of items', function () {
        var s = new Store();
        s.append([0,1,2,3,4]);
        var mid = s.first.increment();
        s.splice(mid.key, 3, []);

        assert.deepEqual([0, 4], s.items.values);
    });

    it('should overwrite the same size set of items', function () {
        var s = new Store();
        s.append([0,1,2,3,4]);
        var mid = s.first.increment();
        s.splice(mid.key, 3, [10, 11, 12]);

        assert.deepEqual([0, 10, 11, 12, 4], s.items.values);
    });

    it('should overwrite the tail', function () {
        var s = new Store();
        s.append([0,1,2,3,4]);
        var mid = s.first.increment().increment().increment();
        s.splice(mid.key, 3, [10, 11, 12]);

        assert.deepEqual([0, 1, 2, 10, 11, 12], s.items.values);
    });
});

describe('Item removal', function () {
    it('should remove however many are available at the tail without error', function () {
        var s = new Store();
        s.append([0,1,2,3,4]);
        var mid = s.first.increment().increment().increment();
        s.remove(mid.key, 5);

        assert.deepEqual([0, 1, 2], s.items.values);
    });

    it('should remove items from the middle', function () {
        var s = new Store();
        s.append([0,1,2,3,4]);
        var mid = s.first.increment();
        s.remove(mid.key, 3);

        assert.deepEqual([0, 4], s.items.values);
    });
});
