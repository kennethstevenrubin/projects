///////////////////////////////////////
// Statement module.
//
// A single JavaScript statement object.
//

"use strict";

// AMD includes.
define(["./Expression"],
    function (Expression) {

        try {

            // Statement constructor function.
        	var functionRet = function Statement() {

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
