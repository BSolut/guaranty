var assert = require('assert'),
	Promise = require('../index.js');



describe('error', function() {
	
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