///////////////////////////////////////
// Point module.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["./prototypes"],
    function (prototypes) {

        try {

            // Constructor function.
        	var functionRet = function Point(dX, dY) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // X-coordinate.
                    self.x = dX || 0;
                    // Y-coordinate.
                    self.y = dY || 0;
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
