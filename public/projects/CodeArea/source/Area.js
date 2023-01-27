///////////////////////////////////////
// self module.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["./prototypes",
    "./Point",
    "./Size",
    "./options"],
    function (prototypes, Point, Size, options) {

        try {

            // Constructor function.
        	var functionRet = function self(pointLocation, sizeExtent) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Location of this self.
                    self.location = pointLocation || new Point();
                    // Extent of this self.
                    self.extent = sizeExtent || new Size();

                    ///////////////////////
                    // Public methods.

                    // Generate path for the pinched rounded rect.
                    self.generateRoundedRectPath = function (contextRender) {
                        
                        try {

                            // Calculate a good, relative corner radius.
                            var dCornerRadius = Math.max(Math.min(self.extent.width, self.extent.height) / (options.cornerRadiusFactor),
                                options.minBorderRadius);

                            // Generate the rounded path.
                            contextRender.beginPath();
                            contextRender.moveTo(self.location.x,
                                    self.location.y);
                            contextRender.lineTo(self.location.x,
                                    (self.location.y + self.extent.height) - dCornerRadius);
                            contextRender.quadraticCurveTo(self.location.x,
                                    (self.location.y + self.extent.height),
                                    (self.location.x + dCornerRadius),
                                    (self.location.y + self.extent.height));

                            contextRender.lineTo((self.location.x + self.extent.width) - dCornerRadius,
                                    (self.location.y + self.extent.height));

                            contextRender.quadraticCurveTo((self.location.x + self.extent.width),
                                    (self.location.y + self.extent.height),
                                    (self.location.x + self.extent.width),
                                    (self.location.y + self.extent.height) - dCornerRadius);

                            contextRender.lineTo((self.location.x + self.extent.width),
                                    (self.location.y + dCornerRadius));

                            contextRender.quadraticCurveTo((self.location.x + self.extent.width),
                                    self.location.y,
                                    (self.location.x + self.extent.width) - dCornerRadius,
                                    self.location.y);

                            contextRender.closePath();

                            return null;
                        } catch (e) {
                            
                            return e;
                        }
                    };

                    // Test if the point is in the self.
                    self.pointInArea = function (contextRender, point) {

                        // First, try the coordinates.
                        if (point.x < self.location.x ||
                            point.x > self.location.x + self.extent.width ||
                            point.y < self.location.y ||
                            point.y > self.location.y + self.extent.height) {

                            return false;
                        }

                        // Generate path.
                        var exceptionRet = self.generateRoundedRectPath(contextRender); 
                        if (exceptionRet) {

                            throw exceptionRet;
                        }

                        // Return hit-test against generated path.
                        return contextRender.isPointInPath(point.x,
                            point.y);
                    }
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
