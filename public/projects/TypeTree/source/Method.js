///////////////////////////////////////
// Method module.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["prototypes",
    "SectionPart"],
    function (prototypes, SectionPart) {

        try {

            // Constructor function.
        	var functionRet = function Method(strName) {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from SectionPart.
                    self.inherits(SectionPart,
                        strName,
                        "method");
                } catch (e) {

                    alert(e.message);
                }
        	};

            // Inherit from TypeSection.
            functionRet.inheritsFrom(SectionPart);

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
