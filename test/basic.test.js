
var assert = require('assert'),
	Promise = require('../index.js');

//describe timeout

describe('Bind', function(){

	it('sync', function(){
		var myObj = {
			id: 2
		}
		Promise().bind(myObj).then(function(){
			return this.id + 3
		}).then(function(val){
			assert.strictEqual(val, 5);
			return this.id2 = 'Test';
		}).then(function(){
			assert.strictEqual(this.id2, 'Test')
		})
	})

	it('async', function(done){
		var myObj = {
			id: 2
		}
		Promise().bind(myObj).then(function(val, resolve){
			this.id += 3;
			setTimeout(function(){
				resolve()
			}, 2)
		}).then(function(val){
			assert.strictEqual(this.id, 5);
			done();
		})
	})

})

describe('Promise inception', function(){

	it('fails', function(){
		Promise().then(function(){
			var p = new Promise();
			p.then(function(val){
				throw new Error('baem')
			})
			return p;
		}).then(function(val){
			assert(false, 'Should never reached');
		}).catch(function(e){
			assert(e.message, 'baem');
			done();
		})
	})

	it('promise as async', function(done){
		Promise().then(function(val, resolve){
			var p = new Promise();
			p.then(function(){
				return 2
			}).then(function(val){
				return val + 3
			})
			setTimeout(function(){
				resolve(p);
				p.resolve();
			}, 2);
		}).then(function(val){
			assert.strictEqual(val, 5);
			done();
		})
	})

	it('promise as result', function(){
		Promise().then(function(){
			var p = new Promise();
			p.then(function(){
				return 2
			}).then(function(val){
				return val + 3
			})
			return p;
		}).then(function(val){
			assert.strictEqual(val, 5);
		})
	})	

})

describe('basic', function() {
	describe('async', function(){
		it('short 1', function(done){
			Promise().then(function(val, resolve, reject){
				setTimeout(function(){
					resolve(12)
				}, 10)
			}).then(function(val){
				assert.strictEqual(val, 12);
				done();
			})
		})
	})

	describe('sync', function(){
		it('new object', function(){
			var p = new Promise();
			p.then(function(){
				return 1
			}).then(function(val){
				assert.strictEqual(val, 1);
				return val +1
			}).then(function(val){
				assert.strictEqual(val, 2);
			})
			p.resolve(true);
		})

		it('short 1', function(){
			Promise.start().then(function(){
				return 1
			}).then(function(val){
				return val + 1
			}).then(function(val){
				assert.strictEqual(val, 2);
			})
		})

		it('short 2', function(){
			Promise().then(function(){
				return 1
			}).then(function(val){
				return val + 1
			}).then(function(val){
				assert.strictEqual(val, 2);
			})
		})
	})
})

describe('NodeStyle', function(){

	it('Promise as callback', function(done){
		var p = new Promise();
		p.then(function(val){
			assert(false, 'Should never reached');
		}).catch(function(e){
			assert.strictEqual(e.message, 'baem');
			done()
		})

		function myNodeFunc(callback){
			setTimeout(function(){
				callback(new Error('baem'));
			},2);
		}
		myNodeFunc(p.asCallback());
	})


	it('Promise as callback', function(done){
		var p = new Promise();
		p.then(function(val){
			assert.strictEqual(val, 5)
			done();
		})

		function myNodeFunc(a,b, callback){
			setTimeout(function(){
				callback(undefined, a+b)
			},2)
		}

		myNodeFunc(3,2,p.asCallback());
	})

	it('Runs', function(done){
		var nodeStyleFunc = function(a, b, callback) {
			setTimeout(function(){
				callback(undefined, a + b)
			}, 2)
		}

		Promise().nfcall(nodeStyleFunc, 2, 3)
		.then(function(val){
			assert.strictEqual(val, 5);
			done();
		})
	})

	it('Multiply callback parameter', function(done){
		var nodeStyleCallback = function(callback){
			setTimeout(function(){
				callback(undefined, 1, 2, 3);
			}, 2)
		}

		Promise().nfcall(nodeStyleCallback)
		.then(function(val){
			assert.deepEqual(val, [1,2,3]);
			done();
		})
	})	

	it('Ignore sync result', function(done){
		var nodeStyleCallError = function(a,b,callback){
			setTimeout(function(){
				callback(a+b)
			}, 2)
			return 'Test'; //The promise will never see that value
		}

		Promise().nfcall(nodeStyleCallError, 2, 3)
		.then(function(){
			assert(false, 'Should never reached');
		})
		.catch(function(e){
			assert.strictEqual(e, 5);	
			done();		
		})
	})


	it('Error case', function(done){
		var nodeStyleError = function(a,b,callback){
			setTimeout(function(){
				callback(new Error('baem'))
			}, 2)
		}

		Promise().nfcall(nodeStyleError, 2, 3)
		.then(function(){
			assert(false, 'Should never reached');
		})
		.catch(function(e){
			assert.strictEqual(e.message, 'baem');
			done();
		})
	})

	it('Error call case', function(){
		var nodeStyleCallError = function(){
			throw new Error('baem');
		}

		Promise().nfcall(nodeStyleCallError, 2, 3)
		.then(function(){
			assert(false, 'Should never reached');
		})
		.catch(function(e){
			assert.strictEqual(e.message, 'baem');			
		})
	})
})


describe('error', function(){
	describe('sync', function(){
		it('catch', function(){
			Promise().then(function(){
				throw new Error('baem');
			}).catch(function(e){
				assert.strictEqual(e.message, 'baem')
			})
		})

		it('stops then before catch', function(){
			Promise().then(function(){
				throw new Error('baem');
			}).then(function(){
				console.log('never reach');
				assert(false);				
			}).catch(function(e){				
				assert.strictEqual(e.message, 'baem')
			})
		})

		it('run then after catch', function(){
			Promise().then(function(){
				throw new Error('baem');
			}).catch(function(e){
				assert.strictEqual(e.message, 'baem');
				return 'hallo';
			}).then(function(val){
				assert.strictEqual(val, 'hallo')
			})
		})
	})

	describe('sync', function(){
		it('catch', function(){
			Promise().then(function(resolve, reject){
				setTimeout(function(){
					reject(new Error('baem'));
				}, 10)
			}).catch(function(e){
				assert.strictEqual(e.message, 'baem')
			})
		})
	});	
})