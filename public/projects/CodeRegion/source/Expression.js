///////////////////////////////////////
// Expression module.
//
// A single JavaScript expression object.
//

"use strict";

// AMD includes.
define([],
    function () {

        try {

            // Expression constructor function.
            var functionRet = function Expression() {

                try {

                    var self = this;          // Uber closure.

                    /////////////////////
                    // Public.

                    // Create instance.
                    self.create = function () {

                        try {

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    /////////////////////
                    // Private.

                } catch (e) {

                    alert(e.message);
                }
            };

            // Return Require module component.
            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
