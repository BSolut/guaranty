var assert = require('assert'),
	Promise = require('../index.js');


describe('thenCallback', function(){


	it('chainable', function(){
		var callData;
		function myCall(err, data){
			if(err) throw err;
			callData = data;
		}

		Promise().then(function(){
			return 3
		})
		.thenCallback(myCall)
		.then(function(val){
			return val + 2
		})
		.then(function(val){
			assert.strictEqual(val, 5);
			assert.strictEqual(callData, 3);
		})
	})

	it('chainable no function', function(){
		Promise().then(function(){
			return 3
		})
		.thenCallback(undefined)
		.then(function(val){
			return val + 2
		})
		.then(function(val){
			assert.strictEqual(val, 5);
		})
	})

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