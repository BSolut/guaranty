//from: bluebrid utils
//Try catch is not supported in optimizing compiler, so it is isolated
//https://github.com/petkaantonov/bluebird/wiki/Optimization-killers
var catchedError = {e: {}};
function tryCatch1(fn, receiver, arg) {
    try {
        return fn.call(receiver, arg);
    } catch (e) {
        catchedError.e = e;
        return catchedError;
    }
}

function tryCatch3(fn, receiver, arg1, arg2, arg3) {
    try {
        return fn.call(receiver, arg1, arg2, arg3);
    } catch (e) {
        catchedError.e = e;
        return catchedError;
    }
}

function tryCatchApply(fn, args, receiver) {
    try {
        return fn.apply(receiver, args);
    } catch (e) {
        catchedError.e = e;
        return catchedError;
    }
}



var Promise = module.exports = function(onSuccess, onFail) {
    if(!(this instanceof Promise)) {
        if(onSuccess === false)
            return new Promise()
        else
            return Promise.start();
    }
    this.scope = this;
    this.nextPromise = false;
    this.successFn = onSuccess;
    this.failFn = onFail;
}

Promise.isPromise = function(val){
    return val && (val instanceof Promise);
}

Promise.start = function(){
    var ret = new Promise();    
    process.nextTick(function(){
        ret.resolve(true)
    })
    return ret;
}


/**
 * the most efficient way of utilizing `this` with promises. The handler functions are called in scope of the defined argument
 */
Promise.prototype.bind = function(scope){
    this.scope = scope;
    return this;
}

/**
 * Provide a callback to be called whenever this promise successfully
 * resolves. Allows for an optional second callback to handle the failure
 * case.
 */
Promise.prototype.then = function(onSuccess, onFail) {
    var ret = new Promise(onSuccess, onFail);
    if(this.scope !== this)
        ret.bind(this.scope);
    return this.chainPromise(ret);
}

/**
 * Provide a callback to be called whenever this promise is rejected
 */
Promise.prototype.catch = function(onFail) {
    return this.then(undefined, onFail);
}

/**
 * Returns a promise that will be call the function in a node style format with
 * an callback. All arguments for function should be given except the final 
 * callback
 */
Promise.prototype.nfcall = function(fn, var_args) {
    //https://github.com/petkaantonov/bluebird/wiki/Optimization-killers#3-managing-arguments
    var args = new Array(arguments.length-1);
    for(var i=1;i<arguments.length;++i)
        args[i-1] = arguments[i];
    args.push( mycallback );

    var result;

    function mycallback(err, data) {
        if(err !== undefined)
            result.reject(err)
        else {
            if(arguments.length > 2) {
                var retArgs = new Array(arguments.length-1);
                for(var i=1;i<arguments.length;++i)
                    retArgs[i-1] = arguments[i];
                data = retArgs;
            }
            result.resolve(data);
        }
    }

    result = new Promise(function(){
        var ret = tryCatchApply(fn, args);
        if(ret === catchedError)
            result.reject(ret.e);
    });

    return this.chainPromise(result);
}


/**
 * Gives you a function of the PromiseResolver`. The callback accepts error 
 * object in first argument and success values on the 2nd parameter and the 
 * rest, I.E. node js conventions.
 * If the the callback is called with multiple success values, it gets convert to an array of the values.
 */
Promise.prototype.asCallback = function() {
    var promise = this;
    function resolver(err, value) {
        if(err)
            promise.reject(err)
        else {
            if(arguments.length > 2) {
                var retArgs = new Array(arguments.length-1);
                for(var i=1;i<arguments.length;++i)
                    retArgs[i-1] = arguments[i];
                value = retArgs;
            }
            promise.resolve(value);            
        }
    }
    return resolver;
};


/**
 * Adds a new promis to chain
 * @private
 */
Promise.prototype.chainPromise = function(promise) {
    if(this.nextPromise)
        throw new Error('Promise allready chained');
    this.nextPromise = promise;
    return promise;
}

/**
 * Resolve this promise with a specified value
 */
Promise.prototype.resolve = function(data){
    delete this.scope;
    if(Promise.isPromise(data)) {        
        while(data.nextPromise) //Find the last promis and add me
            data = data.nextPromise;
        var me = this;
        data.then(
            function(val){
                me.resolve(val)
            }, 
            function(e){
                me.reject(e)
            }
        )
    } else {
        if(this.nextPromise)
            this.nextPromise.withInput(data);
    }
}

/**
 * Reject this promise with an error
 */
Promise.prototype.reject = function (e) {
    delete this.scope;
    if(!this.nextPromise)
        process.nextTick(function onPromiseThrow(){
            throw e
        })
    else
        this.nextPromise.withError(e);
}

/**
 * Attempt to resolve this promise with the specified input
 * @private
 */
Promise.prototype.withInput = function(data) {
    if(this.successFn) {
        var me = this;

        function doResolved(data){ me.resolve(data) }
        function doRejected(e){ me.reject(e); }

        var ret = tryCatch3(this.successFn, this.scope, data, doResolved, doRejected);
        if(ret === catchedError)
            this.reject(ret.e)
        else
        if(ret !== void 0)
            this.resolve(ret);
    } else
        this.resolve(data);
}
/**
 * Attempt to reject this promise with the specified error
 * @private
 */
Promise.prototype.withError = function (e) {
    if(this.failFn) {
        var ret = tryCatch1(this.failFn, this.scope, e);
        if(ret !== catchedError)
            return this.resolve(ret)
        else
            this.reject(ret.e)
    } else
        this.reject(e)
}
