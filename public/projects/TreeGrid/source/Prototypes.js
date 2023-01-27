///////////////////////////////////////
// Extend JavaScript prototypes.

"use strict";

define([],
    function () {

        try {

            ///////////////////////////////////////
            // Date.

            // Extends Date's prototype for validity.
            Date.prototype.isValid = function () {

                return isFinite(this);
            };

            ///////////////////////////////////////
            // String.

            // Extends String's prototype to support measure text.
            String.prototype.size = function (strFont) {

                try {

                    // Create an element with which to measure.
                    var jqMeasurer = $("<div style='position:absolute;float:left;visibility:hidden'>" + this + "</div>");

                    // Set font, if specified.
                    if (strFont !== undefined &&
                        strFont !== null) {

                        jqMeasurer.css("font",
                            strFont);
                    }

                    jqMeasurer.appendTo($(document.body));

                    // Extract dimension from element.
                    var dWidth = jqMeasurer.width();
                    var dHeight = jqMeasurer.height();

                    // Remove the measurer from DOM.
                    jqMeasurer.remove();

                    return {

                        width: dWidth,
                        height: dHeight
                    };
                } catch (e) {

                    return -1;
                }
            };

            ///////////////////////////////////////
            // Function.

            // Extends Function's prototype to support OOP.
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

            ///////////////////////////////////////
            // Object!

            // Extends Object's prototype to support OOP.
            Object.defineProperty(Object.prototype,
                "inherits", {

                    value: function (parent) {

                        // Call the parent constructor in the 
                        // context of "this" (the object instance)
                        // to link the two objects together.
                        if (arguments.length > 1) {

                            // Pass extra constructor parameters.
                            parent.apply(this,
                                Array.prototype.slice.call(arguments, 1));
                        }  else {

                            // Just call default constuctor.
                            parent.call(this);
                        }
                    },
                    enumerable: false
                });

            // Merges the function parameter's properties into "this".
            Object.defineProperty(Object.prototype,
                "inject", {

                    value: function (objectSource) {

                        // Define recursive object merger.
                        var functionMerge = function (objectTarget,
                            objectSource) {

                            // Can't merge undefineds.
                            if (objectSource === undefined) {

                                return objectTarget;
                            }
                            // Can't merge nulls either.
                            if (objectSource === null) {

                                return objectTarget;
                            }
                            // Target can't be undefined or null because it is "this" in calling block.

                            // Must handle arrays and objects differently.
                            if (objectSource instanceof Array) {

                                // Loop over all source items.
                                for (var i = 0; i < objectSource.length; i++) {

                                    if (objectTarget.length > i) {

                                        // Recurse down.
                                        functionMerge(objectTarget[i],
                                            objectSource[i]);
                                    } else {

                                        objectTarget.push(objectSource[i]);
                                    }
                                }
                            } else if (objectSource instanceof Object) {

                                    // Loop over all source properties.
                                for (var strKey in objectSource) {

                                    // Do not handle base properties.
                                    if (objectSource.hasOwnProperty(strKey) === false) {

                                        continue;
                                    }

                                    // If the target does not have a source property, add, else...
                                    if (objectTarget[strKey] === undefined) {

                                        objectTarget[strKey] = objectSource[strKey];
                                    } else {

                                        // Recurse down if object or array, otherwise assign.

                                        if (objectTarget[strKey] instanceof Array ||
                                            objectTarget[strKey] instanceof Object) {

                                            // Recurse down.
                                            functionMerge(objectTarget[strKey],
                                                objectSource[strKey]);
                                        } else {

                                            // Even though target has a value here, need
                                            // To over-write since the type is a kernel.
                                            objectTarget[strKey] = objectSource[strKey];
                                        }
                                    }
                                }
                            } else { // Kernel type

                                objectTarget = objectSource;
                            }

                            // Return the target for chaining purposes.
                            return objectTarget;
                        };

                        // Invoke merger function with this and specified object.
                        return functionMerge(this,
                            objectSource);
                    },
                    enumerable: false
                });

            // Returns the name of object's constructor.
            Object.defineProperty(Object.prototype,
                "getTypeName", {

                    value: function () {

                        // Get the full constructor as a string.
                        var strConstructor = this.constructor.toString();

                        // Match against regex expression to extract name of function.
                        var matches = strConstructor.match(/function (.{1,})\(/);

                        // If there are  matches, then get the 1th match.
                        return (matches && matches.length > 1) ? matches[1] : "";
                    },
                    enumerable: false
                });
        } catch (e) {

            alert(e.message);
        }
    });
