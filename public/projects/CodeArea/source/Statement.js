///////////////////////////////////////
// Statement module.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["./prototypes",
    "./options",
    "./Area",
    "./Point",
    "./Size"],
    function (prototypes, options, Area, Point, Size) {

        try {

            // Constructor function.
        	var functionRet = function Statement() {

                try {

            		var self = this;                        // Uber closure.

                    //////////////////
                    // Public fields.

                    // Hold on the block that owns this statement.
                    self.parent = null;

                    //////////////////
                    // Public methods.

                    // Method returns the height of all contained statements.
                    self.getHeight = function () {

                        // Defer to derived class.
                        return self.innerGetHeight();
                    };

                    // Render instance details.
                    self.render = function (iMS, contextRender, areaRender, dHeightOffset) {

                        try {

                            // Get the height of the region.
                            var dHeight = self.getHeight();

                            // Define the statement bounds.
                            var areaStatement = new Area(new Point(areaRender.location.x + options.statementGap, areaRender.location.y + dHeightOffset),
                                new Size(areaRender.extent.width - 2 * options.statementGap, dHeight));

                            // Draw the statement.
                            var exceptionRet = areaStatement.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            contextRender.fillStyle = options.statementFill;
                            contextRender.fill();
                            contextRender.strokeStyle = options.statementStroke;
                            contextRender.stroke();

                            return self.innerRender(iMS, contextRender, areaStatement);
                        } catch (e) {

                            return e;
                        }
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
