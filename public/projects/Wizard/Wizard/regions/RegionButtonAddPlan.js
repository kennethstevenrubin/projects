////////////////////////////////////////
// RegionButtonAddPlan -- Button region with rounded-rect-like display.
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/regions/RegionButton"],
    function (prototypes,
        RegionButton) {

        // Define constructor function.
        var functionRet = function RegionButtonAddPlan(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from RegionButton.
            self.inherits(RegionButton, {

                top: 32,
                left: 200,
                enabled: true,
                curveWidth: 13,
                width: 45,
                straightWidth: 30,
                overallWidth: 45,
                height: 30,
                fillStyleEnabled: "#924863",
                plus: {

                    lineWidth: 2,
                    strokeStyle: "#FFFFFF",
                    nearAcross: 17,
                    middleAcross: 22,
                    farAcross: 27,
                    nearDown: 10,	// added 2 to these 3
                    middleDown: 15,
                    farDown: 20
                }
            }.inject(optionsOverride));

            ////////////////////////////
            // Protected methods.

            // Generate the boundard path.
            self.generatePath = function () {

                try {

                    // Render the bounding path.
                    var dAddPlanLeft = self.options.left;
                    var dAddPlanTop = self.options.top;
                    var dAddPlanCurveWidth = self.options.curveWidth;
                    var dAddPlanStraightWidth = self.options.straightWidth;
                    var dAddPlanOverallWidth = self.options.overallWidth;
                    var dAddPlanHeight = self.options.height;

                    self.options.context.beginPath();
                    self.options.context.moveTo(dAddPlanLeft + dAddPlanCurveWidth,
                        dAddPlanTop + dAddPlanHeight);
                    self.options.context.bezierCurveTo(dAddPlanLeft,
                        dAddPlanTop + dAddPlanHeight,
                        dAddPlanLeft,
                        dAddPlanTop,
                        dAddPlanLeft + dAddPlanCurveWidth,
                        dAddPlanTop);
                    self.options.context.lineTo(dAddPlanLeft + dAddPlanStraightWidth,
                        dAddPlanTop);
                    self.options.context.bezierCurveTo(dAddPlanLeft + dAddPlanOverallWidth,
                        dAddPlanTop,
                        dAddPlanLeft + dAddPlanOverallWidth,
                        dAddPlanTop + dAddPlanHeight,
                        dAddPlanLeft + dAddPlanStraightWidth,
                        dAddPlanTop + dAddPlanHeight);
                    self.options.context.lineTo(dAddPlanLeft + dAddPlanCurveWidth,
                            dAddPlanTop + dAddPlanHeight);
                    self.options.context.closePath();

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render the interior of the button.
            self.renderInterior = function () {

                try {

                    var dAddPlanLeft = self.options.left;
                    var dAddPlanTop = self.options.top;

                    // Now draw the plus.
                    self.options.context.lineWidth = self.options.plus.lineWidth;
                    self.options.context.strokeStyle = self.convertColor(self.options.plus.strokeStyle);
                    self.options.context.beginPath();
                    self.options.context.moveTo(dAddPlanLeft + self.options.plus.middleAcross,
                        dAddPlanTop + self.options.plus.nearDown);
                    self.options.context.lineTo(dAddPlanLeft + self.options.plus.middleAcross,
                        dAddPlanTop + self.options.plus.farDown);
                    self.options.context.moveTo(dAddPlanLeft + self.options.plus.nearAcross,
                        dAddPlanTop + self.options.plus.middleDown);
                    self.options.context.lineTo(dAddPlanLeft + self.options.plus.farAcross,
                        dAddPlanTop + self.options.plus.middleDown);
                    self.options.context.stroke();

                    // Reset.
                    self.options.context.lineWidth = 1;

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
