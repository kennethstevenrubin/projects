////////////////////////////////////////
// RegionButtonRoundedPlay -- Button region displays play button
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/regions/RegionButtonRounded"],
    function (prototypes,
        RegionButtonRounded) {

        // Define constructor function.
        var functionRet = function RegionButtonRoundedPlay(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from RegionButtonRounded.
            self.inherits(RegionButtonRounded, {

                width: 53,
                height: 53,
                glyph: {
                
                    fillStyle: "#ffffff"
                }
            }.inject(optionsOverride));

            ////////////////////////////
            // Protected methods.

            // Render the interior of the button.
            self.renderInterior = function () {

                try {

                    // Draw the pause glyph.
                    self.options.context.fillStyle = self.convertColor(self.options.glyph.fillStyle);

                    self.options.context.beginPath();

                    self.options.context.moveTo(self.options.left + self.options.width / 2 - self.options.height / 6,
                        self.options.top + self.options.height / 2 - self.options.height / 6 * Math.sqrt(2));
                    self.options.context.lineTo(self.options.left + self.options.width / 2 + self.options.height / 6,
                        self.options.top + self.options.height / 2);
                    self.options.context.lineTo(self.options.left + self.options.width / 2 - self.options.height / 6,
                        self.options.top + self.options.height / 2 + self.options.height / 6 * Math.sqrt(2));

                    self.options.context.closePath();

                    self.options.context.fill();

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
