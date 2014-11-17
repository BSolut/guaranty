var assert = require('assert'),
    Promise = require('../index.js');

describe('then done',function(){

    it('done', function(testDone){
        Promise()
        .then(function(val, resolve, reject, done){
            setTimeout(function(){
                done(undefined, 12)
            }, 1)
        })
        .then(function(val){
            assert.strictEqual(val, 12);
            testDone();
        })
    })

    it('done error', function(testDone){
        Promise()
        .then(function(val, resolve, reject, done){
            setTimeout(function(){
                done(new Error('BAEM'))
            }, 1)
        })
        .then(function(val){
            assert(false, 'Should never reached');
        })
        .catch(function(e){
            assert.strictEqual(e.message, 'BAEM');
            testDone();
        })
    })

})