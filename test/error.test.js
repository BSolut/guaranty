var assert = require('assert'),
	Promise = require('../index.js');



describe('error', function() {
	
    it('thenCallback handels exceptions or not', function(done){
        var p = new Promise(false);
        p.then(function(val, resolve, reject){
            reject(new Error('BAEM'));
        }) 
        .thenCallback(undefined)
        .then(function(val){
            done(new Error('thenCallback handles error'));
        })
        .catch(function(e){
            assert.strictEqual(e.message, 'BAEM');
            done();
        })
        p.resolve(true);
    })  

    it('thenCallback handels exceptions', function(done){
        var p = new Promise(false);
        p.then(function(val, resolve, reject){
            reject(new Error('BAEM'));
        }) 
        .thenCallback(undefined, true)
        p.resolve(true);
        done();
    })  

	it('resolve twice', function(done){
        Promise.DEBUG = true;

        var mochaException = process.listeners('uncaughtException').pop()        
        process.removeListener('uncaughtException', mochaException);
        process.once("uncaughtException", function (error) {
            Promise.DEBUG = false;
            if(mochaException)
                process.listeners('uncaughtException').push(mochaException);

            if(error.message.indexOf('call resolve but promise allready resolved') === 0)
                done()
            else
                done(error);
        })

		var p = new Promise();
		p.resolve(true);
		p.resolve(true);
	})
    

})