////////////////////////////////////////
// RegionButton -- Button region class.
//
// Return constructor function.

"use strict";

define(["prototypes",
    "Region"],
    function (prototypes,
        Region) {

        // Define constructor function.
        var functionRet = function RegionButton(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from Region.
            self.inherits(Region, {

                fillStyleEnabled: "#924863",
                fillStyleDisabled: "#666666",
                click: null             // Event raised when the user clicks in the region.

            }.inject(optionsOverride));

            ////////////////////////////
            // Protected methods.

            // Process click event.
            // Do nothing in base class.
            self.handleClick = function (e) {

                try {

                    // Raise the click event--if it is a function.
                    if ($.isFunction(self.options.click)) {

                        // Raise event.
                        self.options.click.call(this,
                            e);
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Process mouse move event.
            // Return "pointer" cursor.
            self.handleMouseMove = function () {

                try {

                    return "pointer";
                } catch (e) {

                    return e;
                }
            };
        };

        // One-time injection.
        functionRet.inherits(Region);

        // Return constructor function.
        return functionRet;
    });
