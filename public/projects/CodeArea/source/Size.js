///////////////////////////////////////
// Size module.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["./prototypes"],
    function (prototypes) {

        try {

            // Constructor function.
        	var functionRet = function Region(dWidth, dHeight) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Width.
                    self.width = dWidth || 0;
                    // Height.
                    self.height = dHeight || 0;
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
