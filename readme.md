Guaranty: a super lightweight promise for node.js
==================================

**Guaranty** is a lightweight promise framework with an aim of providing a basic set of functionality similar to that provided by the [Q library](https://github.com/kriskowal/q "Q") or [Bluebird](https://github.com/petkaantonov/bluebird) without any browser support.


*Why'd we write it?*

same reason like [kew](https://github.com/Medium/kew), less overhead = faster code.

*Its an full Promise framework like [Promises/A+](http://promises-aplus.github.io/promises-spec/)?*

NO! its look and feel like but **guaranty** is more flow controll like [Step](https://github.com/creationix/step) then a promise framework.




###new Promise()

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


###.then([Function resolvedHandler] [, Function rejectedHandler ])


[Promises/A+ `.then()`](http://promises-aplus.github.io/promises-spec/). Returns a new promise chained from this promise. The new promise will be rejected or resolved dedefer on the passed `fulfilledHandler`, `rejectedHandler` and the state of this promise.

Example:

```js
promptAsync("Which url to visit?").then(function(url){
    return ajaxGetAsync(url);
});
```


###.catch(Function handler)

This is a Pokemon handler catch-them-all exception handler, shortcut for calling `.then(null, handler)` on this promise. Any exception happening in a `.then`-chain will propagate to nearest `.catch` handler.

Example:

```js
somePromise.then(function(){
    return a.b.c.d();
}).catch(function(e){
    //ReferenceError
});
 ```


###.bind(dynamic thisArg)

the most efficient way of utilizing `this` with promises. The handler functions are called in scope of the defined argument

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
 

###.nfcall(Function fn [, dynamic arg...])

used for converen node-style callbacks into promises.

```js
Promise().nfcall(fs.readFile, '/tmp/myFile')
  .then(function (data) {
    console.log('File readed successfully', data)
  })
  .fail(function (err) {
    console.log('Failed to read file', err)
  })
```

###.asCallback()

Gives you a function of the PromiseResolver`. The callback accepts error object in first argument and success values on the 2nd parameter and the  rest, I.E. node js conventions. If the the callback is called with multiple success values, it gets convert to an array of the values.


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
