////////////////////////////////////////
// RegionLabel -- Non-clickable label.
//
// Return constructor function.

"use strict";

define(["../prototypes",
    "./RegionButtonLabel"],
    function (prototypes,
        RegionButtonLabel) {

        // Define constructor function.
        var functionRet = function RegionLabel(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from RegionButtonLabel.
            self.inherits(RegionButtonLabel, {

            }.inject(optionsOverride));

            ////////////////////////////
            // Protected methods.

            // Generate the boundard path.
            self.generatePath = function () {

                try {

                    // This is the trick to the non-clickable label--no path.
                    self.options.context.beginPath();
                    self.options.context.closePath();

                    return null;
                } catch (e) {

                    return e;
                }
            };
        };

        // One-time injection.
        functionRet.inherits(RegionButtonLabel);

        // Return constructor function.
        return functionRet;
    });
