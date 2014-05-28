var assert = require('assert'),
    Promise = require('../index.js');

//nodeify
//promis in promis
//describe bind
//describe timeout


function printStatus(fn) {
    switch(%GetOptimizationStatus(fn)) {
        case 1: console.log("Function is optimized"); break;
        case 2: console.log("Function is not optimized"); break;
        case 3: console.log("Function is always optimized"); break;
        case 4: console.log("Function is never optimized"); break;
        case 6: console.log("Function is maybe deoptimized"); break;
    }
}

function nodeStyleFunc(a, b, callback) {
    return 1
}


//var p = new Promise();

nodeStyleFunc();
%OptimizeFunctionOnNextCall(nodeStyleFunc);
nodeStyleFunc();



//Check
printStatus(nodeStyleFunc);


