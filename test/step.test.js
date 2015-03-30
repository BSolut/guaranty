var assert = require('assert'),
    Promise = require('../index.js');

describe('step', function(){


    it('Chain errors async', function(done) {
        Promise().step([2,3]).then(function(nr) {        
            return Promise().step([2,1]).then(function(nr2, resolve, reject) {
                setTimeout(function() {
                    if(nr2 + nr === 3)
                        return reject(new Error('Test'));
                    resolve(nr2+nr);
                }, 50)
            })
        })
        .then(function(list) {
            done(new Error('should not reached'));
        }, function(error) {
            if(error.message !== 'Test')
                return done(error)
            done();
        })
    })

    it('Chain errors', function(done) {
        
        Promise().step([2]).then(function(nr) {        
            return Promise().step([2,1]).then(function(nr2) {
                if(nr2 + nr === 3)
                    throw new Error('Test');
                return nr2 + nr;
            })
        })
        .then(function(list) {
            done(new Error('should not reached'));
        }, function(error) {
            if(error.message !== 'Test')
                return done(error)
            done();
        })

    })

    it('runs empty', function(done){
        Promise().step([]).then(function(itm){
            done( new Error('never reache') );
        })
        .thenCallback(done)
    })

    it('runs null', function(done){
        var catched = false;
        Promise().step().then(function(itm){  //Promise starts with true step has no args so its used true
            done( new Error('never reache') );
        })
        .catch(function(e){
            catched = e.message == 'Step arguments must be an error'
        })
        .then(function(){
            done( !catched ? new Error('Step excepts only arrays') : undefined );
        })
    })

    it('simple', function(done) {
        Promise().step(['a', 'b'])
            .then(function(itm) {
                assert.equal(true, itm === 'a' || itm === 'b')
            })
            .thenCallback(done);
    })

    it('stops on first error', function(done){
        Promise().step([1,2,3])
            .then(function(step){
                if(step === 2)
                    throw new Error('BOOM');
                return true;
            })
            .then(function(stepResult){
                done( new Error('never reache') );
            })
            .catch(function(e){
                if(e.message = 'BOOM')
                    done();
                else
                    done(e);
            })
    })

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