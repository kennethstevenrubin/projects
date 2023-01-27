﻿///////////////////////////////////////
// Events module.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["prototypes",
    "options",
    "Point",
    "Size",
    "Area",
    "TypeSection"],
    function (prototypes, options, Point, Size, Area, TypeSection) {

        try {

            // Constructor function.
        	var functionRet = function Events(arrayEvents) {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from TypeSection.
                    self.inherits(TypeSection,
                        "Events",
                        "events",
                        arrayEvents);
                } catch (e) {

                    alert(e.message);
                }
        	};

            // Inherit from TypeSection.
            functionRet.inheritsFrom(TypeSection);

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
