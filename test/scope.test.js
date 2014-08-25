var assert = require('assert'),
    Promise = require('../index.js');

describe('Scope', function() {
    
    it('simple then', function() {
        var myScope = { a: 2 };
        Promise().bind(myScope).then(function() {
            return this.a + 3
        }).then(function(val) {
            assert.strictEqual(val, 5);
        })
    })


    it('steps', function() {
        var myScope = {a: 2};
        Promise().bind(myScope).step([1,2])
            .then(function(val) {
                this.a += val;
                return true;
            })
            .then(function() {
                assert.strictEqual(this.a, 5);
                return true;
            })
    })

    it('parallel', function() {
        var myScope = {a: 2};
        Promise().bind(myScope).parallel([1,2])
            .then(function(val){
                this.a += val;
                return true;
            })
            .then(function(val){
                assert.strictEqual(this.a, 5)
                return;
            })
    })

})