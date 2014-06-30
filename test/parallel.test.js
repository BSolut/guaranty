var assert = require('assert'),
    Promise = require('../index.js');

describe('parallel', function(){

    it('stops on error', function(done) {
        Promise().parallel([1,2,3]).then(function(val, resolve, reject){
            setTimeout(function(){
                if(val !== 3)
                    resolve(val);
                else
                    reject(new Error('BOOM'))
            }, 2)
        }).then(function(val){
            console.log( val );
            assert.equal(false, true, 'should never reached');
        })
        .catch(function(err){
            assert.equal(err.message, 'BOOM');
        })
        .thenCallback(done);
    })
    

    it('run', function(){
        Promise().parallel([1,2,3]).then(function(val){
            return val + 1;
        }).then(function(val){
            assert.deepEqual(val, [2,3,4]);
        })
    })

    it('run from resolve', function(done){
        Promise().then(function(){
            return [1,2,3]
        }).parallel().then(function(val){
            return val + 2;
        }).then(function(val){
            assert.deepEqual(val, [3,4,5]);
            done();
        })
    })

    it('run from resolve async', function(done){
        Promise().then(function(){
            return [1,2,3]
        }).parallel().then(function(val, resolve){
            setTimeout(function(){
                resolve(val +2)
            }, 2);
        }).then(function(val){
            assert.deepEqual(val, [3,4,5]);
            done();
        })
    })    

})
