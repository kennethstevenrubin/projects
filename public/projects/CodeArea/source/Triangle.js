///////////////////////////////////////
// Triangle module.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["./prototypes",
    "./Point",
    "./Size"],
    function (prototypes, Point, Size) {

        try {

            // Constructor function.
        	var functionRet = function Triangle(point0, point1, point2) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // The points.
                    self.point0 = point0 || new Point();
                    self.point1 = point1 || new Point();
                    self.point2 = point2 || new Point();

                    // The points making up this triangle as an array.
                    self.points = [point0, point1, point2];

                    // Get the max and min x and y -- note: if any 
                    // of the above are changed, these will be wrong.
                    var dMinX = Infinity;
                    var dMinY = Infinity;
                    var dMaxX = -Infinity;
                    var dMaxY = -Infinity;
                    for (var i = 0; i < 3; i++) {

                        var pointIth = self.points[i];
                        if (dMinX > pointIth.x) {

                            dMinX = pointIth.x;
                        }
                        if (dMaxX < pointIth.x) {

                            dMaxX = pointIth.x;
                        }
                        if (dMinY > pointIth.y) {

                            dMinY = pointIth.y;
                        }
                        if (dMaxY < pointIth.y) {

                            dMaxY = pointIth.y;
                        }
                    }

                    // Define and hold rectilinear maxima and minima.
                    self.location = new Point(dMinX, dMinY);
                    self.extent = new Size(dMaxX - dMinX, dMaxY - dMinY);

                    ///////////////////////
                    // Public methods.

                    // Generate a path for the triangles.
                    self.generateTriangularPath = function (contextRender) {
                        
                        try {

                            // Generate the rounded path.
                            contextRender.beginPath();
                            contextRender.moveTo(self.points[0].x,
                                    self.points[0].y);
                            contextRender.lineTo(self.points[1].x,
                                    self.points[1].y);
                            contextRender.lineTo(self.points[2].x,
                                    self.points[2].y);
                            contextRender.closePath();

                            return null;
                        } catch (e) {
                            
                            return e;
                        }
                    };

                    // Test if the point is in the area.
                    self.pointInTriangle = function (contextRender, point) {

                        // First, try the coordinates.
                        if (point.x < self.location.x ||
                            point.x > self.location.x + self.extent.width ||
                            point.y < self.location.y ||
                            point.y > self.location.y + self.extent.height) {

                            return false;
                        }

                        // Generate path.
                        var exceptionRet = self.generateTriangularPath(contextRender); 
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
