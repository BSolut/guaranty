[![Build Status](https://travis-ci.org/BSolut/guaranty.svg?branch=master)](https://travis-ci.org/BSolut/guaranty)




Guaranty: a super lightweight promise for node.js
==================================


**Guaranty** is a lightweight promise framework with an aim of providing a basic set of functionality similar to that provided by the [Q library](https://github.com/kriskowal/q "Q") or [Bluebird](https://github.com/petkaantonov/bluebird) without any browser support.


*Why'd we write it?*

For the same reason as [kew](https://github.com/Medium/kew), less overhead = faster code.

*Is it an full Promise framework like [Promises/A+](http://promises-aplus.github.io/promises-spec/)?*

NO! it looks and feels like it, but **guaranty** is more flow control (like [Step](https://github.com/creationix/step) and [Asyn.js](https://github.com/caolan/async)) than a promise framework.




### new Promise()

Create a new promise. 

Example:

```js
var p = new Promise();
p.then(function(){
  return 1
}).then(function(val){
  return val +1
}).then(function(val){
  val === 2;
})
p.resolve(true); //Start resolving the promise
```

```js
//immediately resolving the promise
Promise().then(function(){
  return 1
}).then(function(val){
  return val +1
}).then(function(val){
  val === 2;
})
```


### .then([Function resolvedHandler] [, Function rejectedHandler ])


[Promises/A+ `.then()`](http://promises-aplus.github.io/promises-spec/). Returns a new promise chained from this promise. The new promise will be rejected or resolved depending on the passed `fulfilledHandler`, `rejectedHandler` and the state of this promise.

Example:

```js
promptAsync("Which url to visit?").then(function(url){
    return ajaxGetAsync(url);
});
```

NOTE: Since version 0.2 resolveHandler are able to return undefined. As long then resolveHandler only has 0 or 1 parameter guranaty interprete as an sync call and will execute the promis chain immediately after that call.

```js
var a = 1;
Promie().then(function(){
  a += 2;
}).then(function(val){
  //val === undefined
  //  a === 3
})
```

NOTE: Since version 0.3 resolvedHandler gets an new argument done, its an node callback styled function to resolve or reject the promise. Done function only pass the the second argument, everything after is ignored.

```js
Promie().then(function(val, resolve, reject, done){
  fs.open('testfile.data','r+', done)
}).then(function(fd){
  //fd == reslult from fs.open 
})
```



### .catch(Function handler)

This is a Pokemon gotta-catch-them-all exception handler; a shortcut for calling `.then(null, handler)` on this promise. Any exception happening in a `.then`-chain will propagate to nearest `.catch` handler.

Example:

```js
somePromise.then(function(){
    return a.b.c.d();
}).catch(function(e){
    //ReferenceError
});
 ```


### .bind(dynamic thisArg)

the most efficient way of utilizing `this` with promises. The handler functions are called in the scope of the defined argument

Example:

```js
var myObj = {id: 2};

Promise().bind(myObj).then(function(){
    this.id += 3;
    return true;
}).then(function(){
    this.id === 5; //true
})

myObj.id === 5; //true
 ```
 

### .nfcall(Function fn [, dynamic arg...])

used for converting node-style callbacks into promises.

```js
Promise().nfcall(fs.readFile, '/tmp/myFile')
  .then(function (data) {
    console.log('File readed successfully', data)
  })
  .catch(function (err) {
    console.log('Failed to read file', err)
  })
```

### .nfcallScope(Function fn, Object scope, [, dynamic arg...])

used for converting node-style callbacks with scoped into promises.

```js
Promise().nfcall(objFunction, obj, parm1)
  .then(function (data) {
    console.log('File readed successfully', data)
  })
  .catch(function (err) {
    console.log('Failed to read file', err)
  })
```

### .thenCallback(Function fn, [Boolean stopError = false])

Wrapper for node-style function callback. If any step before fails thenCallback checks callback functions exstist, if not thenCallback executes the fail chain. If stopError is true the fail chain execution gets stop even there is no callback function.


```js
// Old style
function doStuff(data, callback) {
    Promise().then(function(val){
        return data + 12;
    })
    .then(function(value){
        callback(undefined, value)
    })
    .catch(callback)
}

// Wrapped style
function doStuff(data, callback) {
    Promise().then(function(val){
        return data + 12;
    })
    .thenCallback(callback)
}

//Speical error handling

function doStuff(data, callback) {
    Promise().then(function(val){
        return someRandomCrash();
    })
    .thenCallback(callback); //if callback function is undefined Guaranty will raise the error
}


function doStuff(data, callback) {
    Promise().then(function(val){
        return someRandomCrash();
    })
    .thenCallback(callback, true); //no error will raised also the callback function is undefined
}

```



### .asCallback()

Gives you a function of the PromiseResolver. The callback accepts error object in first argument and success values on the 2nd parameter and the  rest, i.e. node JS conventions. If the the callback is called with multiple success values, it gets converted to an array of the values.


```js
var fs = require("fs");
function readAbc() {
    var p = Promise();
    fs.readFile("abc.txt", resolver.asCallback());
    return p;
}

readAbc()
.then(function(abcContents) {
    console.log(abcContents);
})
.catch(function(e) {
    console.error(e);
});
```

### .step(Array parameter, [Boolean stopOnFirstError = true])

If you have a number of functions that need to be run sequentially, you can use step:


```js
var Promise = require('guaranty'),
    a = 2;
Promise().step([1,2,3]).then(function(value){
    return a + value;
})
.then(function(stepResult){
    //stepResult = [3,4,5]
})


//Or as result from a promise
function getParams() {
    return Promise().then(function(){
        return [1,2,3]  
    })
}

Promise().then(getParams)
    .step().then(function(value){
    a += value;
    return true;
})
//a = 6
```


### .parallel(Array parameter, [Boolean stopOnFirstError = true])

Like .step but the all functions get called asynchronously.


```js
var Promise = require('guaranty'),
    a = 2;
Promise().parallel([1,2,3]).then(function(value, resolve){
    setTimeout(function(){
        resolve( a + value)
    }, 500)
})
.then(function(ret){
    //ret = [3,4,5]
})
```
