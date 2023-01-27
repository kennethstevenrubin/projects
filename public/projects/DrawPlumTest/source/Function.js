///////////////////////////////////////
// Extend Function's prototype to support OOP.

"use strict";

define(function () {

    // Extend Function's prototype to support OOP.
    Function.prototype.inherits = function (ParentConstructorFunction) {

        // Set the prototype for "this" function.
        // This injects ParentConstructorFunction
        // into "this", which is another function.
        this.prototype = new ParentConstructorFunction();

        // Also set the prototype's constructor to this.
        // This has the effect of circumventing some
        // behavior of JavaScript which would otherwise
        // cause problems for the new this.prototype.
        this.prototype.constructor = this;
    };

    // Note: no return value.  This code just needs to run to load up the new method into Function.
});
