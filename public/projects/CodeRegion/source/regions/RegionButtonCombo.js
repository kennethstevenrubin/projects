////////////////////////////////////////
// RegionButtonCombo -- Button region which looks like a combo button.
//
// Return constructor function.
// 

"use strict";

define(["../prototypes",
    "./RegionButton"],
    function (prototypes,
        RegionButton) {

        // Define constructor function.
        var functionRet = function RegionButtonCombo(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from RegionButton.
            self.inherits(RegionButton, {

                top: 32,
                left: 200,
                fillStyleEnabled: "#924863",
                straightWidth: 17,
                overallWidth: 40,
                width: 40,
                height: 30,
                enabled: true,
                squareBottomRightAdjustment: 2,
                showSquare: true,
                open: false,
                opacity: 1,
                downArrow: {

                    fillStyle: "#FFFFFF",
                    nearAcross: 12,
                    middleAcross: 17,
                    farAcross: 22,
                    nearDown: 11,	// added 2 to these 2
                    farDown: 18
                },
            }.inject(optionsOverride));

            ////////////////////////////
            // Public methods.

            // Set the button to draw as "open" or "closed".
            self.setOpen = function (bOpen) {
       
                try {
       
                    // Set state.
                    self.options.open = bOpen;

                    // Update dislpay.
                    return self.render();
                } catch (e) {
       
                    return e;
                }
            };

            ////////////////////////////
            // Protected methods.

            // Generate the boundard path.
            self.generatePath = function () {

                try {

                    // Render the bounding path.
                	var bSquareBottomRight = (self.options.open && self.options.showSquare);
                    var dComboButtonLeft = self.options.left;
                    var dComboButtonTop = self.options.top;
                    var dComboButtonStraightWidth = self.options.straightWidth;
                    var dComboButtonOverallWidth = self.options.overallWidth;
                    var dComboButtonHeight = self.options.height;

                    self.options.context.beginPath();
                    self.options.context.moveTo(dComboButtonLeft,
                        dComboButtonTop);
                    self.options.context.lineTo(dComboButtonLeft + dComboButtonStraightWidth,
                        dComboButtonTop);

                    if (bSquareBottomRight === false) {

                        self.options.context.bezierCurveTo(dComboButtonLeft + dComboButtonOverallWidth,
                            dComboButtonTop,
                            dComboButtonLeft + dComboButtonOverallWidth,
                            dComboButtonTop + dComboButtonHeight,
                            dComboButtonLeft + dComboButtonStraightWidth,
                            dComboButtonTop + dComboButtonHeight);
                        
                    } else {

                        self.options.context.bezierCurveTo(dComboButtonLeft +
                                dComboButtonOverallWidth -
                                self.options.squareBottomRightAdjustment,
                            dComboButtonTop,
                            dComboButtonLeft +
                                dComboButtonOverallWidth -
                                self.options.squareBottomRightAdjustment,
                            dComboButtonTop +
                                dComboButtonHeight / self.options.squareBottomRightAdjustment,
                            dComboButtonLeft +
                                dComboButtonOverallWidth -
                                self.options.squareBottomRightAdjustment,
                            dComboButtonTop +
                                dComboButtonHeight);
                    }

                    self.options.context.lineTo(dComboButtonLeft,
                        dComboButtonTop + dComboButtonHeight);
                    self.options.context.closePath();

                    return null;
                    
                } catch (e) {

                    return e;
                }
            };

            // Render the interior of the button.
            self.renderInterior = function () {

                try {

                	var bSquareBottomRight = self.options.open;
                    var dComboButtonLeft = self.options.left;
                    var dComboButtonTop = self.options.top;

                    // Now draw the white down arrow.
                    // Also switch on squareness.  self time implying drop-down open.
                    if (bSquareBottomRight === false) {

                        // Closed.
                        self.options.context.fillStyle = self.options.downArrow.strokeStyle;
                        self.options.context.beginPath();
                        self.options.context.moveTo(dComboButtonLeft + self.options.downArrow.nearAcross,
                            dComboButtonTop + self.options.downArrow.nearDown);
                        self.options.context.lineTo(dComboButtonLeft + self.options.downArrow.farAcross,
                            dComboButtonTop + self.options.downArrow.nearDown);
                        self.options.context.lineTo(dComboButtonLeft + self.options.downArrow.middleAcross,
                            dComboButtonTop + self.options.downArrow.farDown);
                        
                    } else {

                        // Open.
                        self.options.context.fillStyle = self.options.downArrow.strokeStyle;
                        self.options.context.beginPath();
                        self.options.context.moveTo(dComboButtonLeft + self.options.downArrow.nearAcross,
                            dComboButtonTop + self.options.downArrow.farDown);
                        self.options.context.lineTo(dComboButtonLeft + self.options.downArrow.farAcross,
                            dComboButtonTop + self.options.downArrow.farDown);
                        self.options.context.lineTo(dComboButtonLeft + self.options.downArrow.middleAcross,
                            dComboButtonTop + self.options.downArrow.nearDown);
                    }
       
                    self.options.context.closePath();
                    self.options.context.fillStyle = self.convertColor(self.options.downArrow.fillStyle);
                    self.options.context.fill();

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
