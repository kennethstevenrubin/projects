////////////////////////////////////////
// RegionButtonPinched -- Button region maintained as a quasi child of a parent Canvas.
//
// Return constructor function.

"use strict";

define(["../prototypes",
    "./RegionButton"],
    function (prototypes,
        RegionButton) {

        // Define constructor function.
        var functionRet = function RegionButtonPinched(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from RegionButton.
            self.inherits(RegionButton, {

                width: 100,
                height: 30,
                pinchWidth: 22,
                curveDistort: 3,
                cornerRadius: 15,
                label: {

                    text: "Continue",
                    fillStyle: "#ffcccc",
                    font: "14px Arial",
                    left: 15,
                    right: 22,
                    bottom: 10
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
                	self.options.width = widthLabelText + self.options.label.left + self.options.label.right;

                    // Render the bounding path.
                    self.options.context.beginPath();

                    self.options.context.moveTo(self.options.left + self.options.cornerRadius,
                        self.options.top);

                    self.options.context.lineTo(self.options.left + self.options.width -
                            self.options.pinchWidth,
                        self.options.top);

                    self.options.context.quadraticCurveTo(self.options.left + self.options.width - self.options.pinchWidth / 2,
                        self.options.top + self.options.curveDistort,
                        self.options.left + self.options.width,
                        self.options.top + self.options.height / 2);

                    self.options.context.quadraticCurveTo(self.options.left + self.options.width - self.options.pinchWidth / 2,
                        self.options.top + self.options.height - self.options.curveDistort,
                        self.options.left + self.options.width - self.options.pinchWidth,
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

                    // Render text.
                    self.options.context.fillStyle = self.convertColor(self.options.label.fillStyle);
                    self.options.context.font = self.options.label.font;
                    self.options.context.textAlign = "left";
                    self.options.context.textBaseline = "middle";
                    self.options.context.fillText(self.options.label.text,
                        self.options.left + self.options.label.left,
                        self.options.top + self.options.height / 2);

                    return null;
                } catch (e) {

                    return e;
                }
            };
        };
       
        // One-time injection.
        functionRet.inherits(RegionButton);

        // Return constructor function.
        return functionRet;
    });
