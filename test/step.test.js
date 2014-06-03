var assert = require('assert'),
    Promise = require('../index.js');

describe('step', function(){

    it('run', function(done){
        Promise().step([1,2,3]).then(function(val, resolve){
            setTimeout(function(){
                resolve(val+1)
            }, 2);
        }).then(function(val){
            assert.deepEqual(val, [2,3,4]);
            done();
        })
    })  

    it('run from resolve', function(done){
        Promise().then(function(){
            return [1,2,3]
        }).step().then(function(val, resolve){
            setTimeout(function(){
                resolve(val+1)
            }, 2);
        }).then(function(val){
            assert.deepEqual(val, [2,3,4]);
            done();
        })
    })  

})