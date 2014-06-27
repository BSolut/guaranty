var assert = require('assert'),
	Promise = require('../index.js');


describe('thenCallback', function(){

	it('goodcase', function(){
		
		function doStuff(data, callback) {
			Promise().then(function(){
				return data + 2
			})
			.thenCallback(callback);
		}
		
		doStuff(3, function(err, value){
			assert.strictEqual(err, undefined);
			assert.strictEqual(value, 5);
		})
	})

	it('basecase', function(){
		
		function doStuff(data, callback) {
			Promise().then(function(){
				return a + b();
			})
			.thenCallback(callback);
		}
		
		doStuff(3, function(err, value){
			assert.equal(err instanceof Error, true)
			assert.strictEqual(err.message, 'a is not defined');
			assert.strictEqual(value, undefined);
		})
	})	

})