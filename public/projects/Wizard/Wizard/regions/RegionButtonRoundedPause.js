////////////////////////////////////////
// RegionButtonRoundedPause -- Button region display pause button.
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/regions/RegionButtonRounded"],
    function (prototypes,
        RegionButtonRounded) {

        // Define constructor function.
        var functionRet = function RegionButtonRoundedPause(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from RegionButtonRounded.
            self.inherits(RegionButtonRounded, {

                width: 53,
                height: 53,
                glyph: {
                
                    fillStyle: "#ffffff",
                    lineWidth: 4
                }
            }.inject(optionsOverride));

            ////////////////////////////
            // Protected methods.

            // Render the interior of the button.
            self.renderInterior = function () {

                try {

                    // Draw the pause glyph.
                    self.options.context.fillStyle = self.convertColor(self.options.glyph.fillStyle);

                    self.options.context.fillRect(self.options.left + self.options.width / 2 - self.options.height / 6,
                        self.options.top + self.options.height / 2 - self.options.height / 6,
                        self.options.height / 12,
                        self.options.height / 3);

                    self.options.context.fillRect(self.options.left + self.options.width / 2 + self.options.height / 12,
                        self.options.top + self.options.height / 2 - self.options.height / 6,
                        self.options.height / 12,
                        self.options.height / 3);

                    return null;
                } catch (e) {

                    return e;
                }
            };
        };

        // One-time injection.
        functionRet.inherits(RegionButtonRounded);

        // Return constructor function.
        return functionRet;
    });
