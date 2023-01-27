////////////////////////////////////////
// RegionButtonRounded -- Button region with rounded-rect-like display.
//
// Return constructor function.

"use strict";

define(["../prototypes",
    "./RegionButton"],
    function (prototypes,
        RegionButton) {

        // Define constructor function.
        var functionRet = function RegionButtonRounded(optionsOverride) {

            var self = this;            // Uber closure.

            self.inherits(RegionButton, {

                width: 255,
                height: 72,
                cornerRadius: 15,
                allowFadeInOut: true,
                bigLabel: {

                    text: "Everyday Living",
                    fillStyle: "#ffffff",
                    font: "24px Arial",
                    left: 13,
                    top: 15
                },
                smallLabel: {

                    text: "Income, expense and saving",
                    fillStyle: "#ffcccc",
                    font: "14px Arial",
                    left: 13,
                    bottom: 13
                }
            }.inject(optionsOverride));

            ////////////////////////////
            // Protected methods.

            // Generate the boundard path.
            self.generatePath = function () {

                try {

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
                    self.options.context.fillStyle = self.convertColor(self.options.bigLabel.fillStyle);
                    self.options.context.font = self.options.bigLabel.font;
                    self.options.context.textBaseline = "top";
                    self.options.context.textAlign = "left";
                    self.options.context.fillText(self.options.bigLabel.text,
                        self.options.left + self.options.bigLabel.left,
                        self.options.top + self.options.bigLabel.top);

                    // Render small text.
                    self.options.context.fillStyle = self.convertColor(self.options.smallLabel.fillStyle);
                    self.options.context.font = self.options.smallLabel.font;
                    self.options.context.textAlign = "left";
                    self.options.context.textBaseline = "bottom";
                    self.options.context.fillText(self.options.smallLabel.text,
                        self.options.left + self.options.smallLabel.left,
                        self.options.top + self.options.height - self.options.smallLabel.bottom);

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
