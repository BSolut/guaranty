var assert = require('assert'),
    Promise = require('../index.js');

describe('stack overflow',function(){

    it('step fixed', function(testDone){
        var tmpList = [];
        for(var i=0;i<10000;i++)
            tmpList.push(i);

        Promise()
        .step(tmpList).then(function(i){
            return i;
        })
        .then(function(val){
            assert.strictEqual(val.length, 10000);
            testDone();
        })
    })


    it('parallel fixed', function(testDone){
        var tmpList = [];
        for(var i=0;i<10000;i++)
            tmpList.push(i);

        Promise()
        .parallel(tmpList).then(function(i){
            return i;
        })
        .then(function(val){
            assert.strictEqual(val.length, 10000);
            testDone();
        })
    })

})