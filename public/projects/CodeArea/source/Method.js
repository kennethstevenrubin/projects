///////////////////////////////////////
// Method module.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["./prototypes",
    "./Block"],
    function (prototypes, Block) {

        try {

            // Constructor function.
        	var functionRet = function Method(strName, arrayParameters, blockBehavior) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Name of method.
                    self.name = strName || "";

                    // Array of parameters.
                    self.parameters = arrayParameters || [];

                    // Block defining behaviors.
                    self.behavior = blockBehavior || new Block();
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
