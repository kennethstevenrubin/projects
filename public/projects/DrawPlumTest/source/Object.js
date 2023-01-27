///////////////////////////////////////
// Extend Object's prototype to support OOP.

"use strict";

define(function () {

    // Extend Object's prototype to support OOP.
    Object.prototype.inherits = function (parent) {

        // Call the parent constructor in the 
        // context of "this" (the object instance)
        // to link the two objects together.
        if (arguments.length > 1) {

            // Pass extra constructor parameters.
            parent.apply(this, Array.prototype.slice.call(arguments, 1));
        }
        else {

            // Just call default constuctor.
            parent.call(this);
        }
    };

    // Note: no return value.  This code just needs to run to load up the new method into Object.
});
