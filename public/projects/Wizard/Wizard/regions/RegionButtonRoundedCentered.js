////////////////////////////////////////
// RegionButtonRoundedCentered -- Button region with rounded-rect-display and centered content.
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/regions/RegionButtonRounded"],
    function (prototypes,
        RegionButtonRounded) {

        // Define constructor function.
        var functionRet = function RegionButtonRoundedCentered(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from RegionButtonRounded.
            self.inherits(RegionButtonRounded, {

                label: {

                    text: "Everyday Living",
                    fillStyle: "#FFCCCC",
                    font: "24px Arial",
                    leftRight: 15
                }
            }.inject(optionsOverride));

            ////////////////////////////
            // Protected methods.

            // Generate the boundard path.
            self.generatePath = function () {

                try {

                	// Determine width based on content.
                	self.options.context.font = self.options.label.font;
                	var widthLabelText = self.options.context.measureText(self.options.label.text).width;
                	self.options.width = widthLabelText + (2 * self.options.label.leftRight);

                    // Render the bounding path.
                    self.options.context.beginPath();

                    self.options.context.moveTo(self.options.left + self.options.cornerRadius,
                        self.options.top);

                    self.options.context.lineTo(self.options.left + self.options.width - self.options.cornerRadius,
                        self.options.top);

                    self.options.context.quadraticCurveTo(self.options.left + self.options.width,
                        self.options.top,
                        self.options.left + self.options.width,
                        self.options.top + self.options.cornerRadius);

                    self.options.context.lineTo(self.options.left + self.options.width,
                        self.options.top + self.options.height - self.options.cornerRadius);

                    self.options.context.quadraticCurveTo(self.options.left + self.options.width,
                        self.options.top + self.options.height,
                        self.options.left + self.options.width - self.options.cornerRadius,
                        self.options.top + self.options.height);

                    self.options.context.lineTo(self.options.left + self.options.cornerRadius,
                        self.options.top + self.options.height);

                    self.options.context.quadraticCurveTo(self.options.left,
                        self.options.top + self.options.height,
                        self.options.left,
                        self.options.top + self.options.height - self.options.cornerRadius);

                    self.options.context.lineTo(self.options.left,
                        self.options.top + self.options.cornerRadius);

                    self.options.context.quadraticCurveTo(self.options.left,
                        self.options.top,
                        self.options.left + self.options.cornerRadius,
                        self.options.top);

                    self.options.context.closePath();

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render the interior of the button.
            self.renderInterior = function () {

                try {

               		// Render large text.
                    self.options.context.fillStyle = self.convertColor(self.options.label.fillStyle);
                    self.options.context.font = self.options.label.font;
                    self.options.context.textBaseline = "middle";
                    self.options.context.textAlign = "center";
	
                    self.options.context.fillText(self.options.label.text,
                        self.options.left + self.options.width / 2,
                        self.options.top + self.options.height / 2);
                	
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
