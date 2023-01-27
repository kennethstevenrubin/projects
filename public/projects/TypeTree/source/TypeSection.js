///////////////////////////////////////
// TypeSection module.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["prototypes",
    "options",
    "Point",
    "Size",
    "Area",
    "SectionPart"],
    function (prototypes, options, Point, Size, Area, SectionPart) {

        try {

            // Constructor function.
        	var functionRet = function TypeSection(strName, strSettingsNode, arrayParts) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Name of this type object.
                    self.name = strName || "Default";
                    // Collection of contained method objects.
                    self.parts = arrayParts || [];
                    // Indicates the type is open.
                    self.open = false;
                    // Indicates the TypeSection is highlighted.
                    self.highlight = false;
                    // Get a reference to the settings for this object.
                    self.settingsNode = options.tree[strSettingsNode || "TypeSection"];
                    // The area, relative to the canvas, occupied by this instance.
                    self.area = null;
                    // Remember which object has the highlight.
                    self.highlightChild = null;

                    ////////////////////////
                    // Public Methods.

                    // Returns the height of this type.
                    self.getHeight = function () {

                        var dHeight = self.settingsNode.lineHeight + 2 * self.settingsNode.margin;
                        if (self.open) {

                            // Add in child height and borders....
                            dHeight += self.innerGetHeight();
                        }

                        return dHeight;
                    };

                    // Virtual method overridden for meta.
                    self.innerGetHeight = function () {

                        // If parts, then they are all the same height.
                        if (self.parts.length > 0) {

                            return (self.parts[0].getHeight() * self.parts.length);
                        } else {

                            return 0;
                        }
                    };

                    // Invoked when the mouse is pressed down over the type.
                    self.mouseDown = function (e, pointCursor) {

                        try {

                            // Can't do much if no area.
                            if (!self.area) {

                                return null;
                            }

                            // If over the title.
                            if (self.overName(pointCursor)) {

                                // Toggle openness.
                                if (self.open) {

                                    self.open = false;
                                } else {

                                    self.open = true;
                                }
                            } else {

                                // Call down to virtual.
                                var exceptionRet = self.innerMouseDown(e, pointCursor);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Virtual mouse down overridden in meta.
                    self.innerMouseDown = function (e, pointCursor) {

                        return null;
                    };

                    // Invoked when the mouse is moved over the type.
                    self.mouseMove = function (e, pointCursor, objectReference) {

                        try {

                            // Can't do much if no area.
                            if (!self.area) {

                                return null;
                            }

                            // Reset highlight.
                            var exceptionRet = self.mouseOut();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // If over the title.
                            if (self.overName(pointCursor)) {

                                objectReference.cursor = "ns-resize";
                            } else {

                                // Call virtual.
                                exceptionRet = self.innerMouseMove(e, 
                                    pointCursor, 
                                    objectReference);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked to handle mouse move if not over name.
                    self.innerMouseMove = function (e, pointCursor, objectReference) {

                        try {

                            // Else, over the TypeSection or properties.
                            objectReference.cursor = "hand";

                            // Figure out which.
                            self.highlightChild = self.over(pointCursor);
                            if (self.highlightChild) {

                                self.highlightChild.highlight = true;
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is moved out of the type.
                    self.mouseOut = function () {

                        try {

                            // Reset highlight.
                            if (self.highlightChild) {

                                self.highlightChild.highlight = false;
                                self.highlightChild = null;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Test if the point is in this Type.
                    self.pointInTypeSection = function (contextRender, point) {

                        // Return false if never rendered.
                        if (!self.area) {

                            return false;
                        }

                        // Return hit-test against generated path.
                        return self.area.pointInArea(contextRender,
                            point);
                    }

                    // Render out this type.
                    self.render = function (contextRender, areaRender, dYOffset) {

                        try {

                            // Define the containing area.
                            self.area = new Area(
                                new Point(areaRender.location.x + self.settingsNode.margin, 
                                    areaRender.location.y + self.settingsNode.margin + dYOffset),
                                new Size(areaRender.extent.width - 2 * self.settingsNode.margin, 
                                    self.getHeight() - 2 * self.settingsNode.margin)
                            );

                            // Generate the path.
                            var exceptionRet = self.area.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Fill and stroke the path.
                            if (self.highlight) {

                                contextRender.fillStyle = self.settingsNode.fillBackgroundHighlight;
                                contextRender.strokeStype = self.settingsNode.strokeBackgroundHighlight;
                            } else {

                                contextRender.fillStyle = self.settingsNode.fillBackground;
                                contextRender.strokeStype = self.settingsNode.strokeBackground;
                            }
                            contextRender.fill();
                            contextRender.stroke();

                            // Render the name.
                            contextRender.font = self.settingsNode.font;
                            if (self.highlight) {

                                contextRender.fillStyle = self.settingsNode.fillTextHighlight;
                            } else {

                                contextRender.fillStyle = self.settingsNode.fillText;
                            }
                            contextRender.fillText(self.name,
                                self.area.location.x + self.settingsNode.textOffset,
                                self.area.location.y + self.settingsNode.textOffsetY,
                                self.area.extent.width - self.settingsNode.textOffset);

                            // If open, render TypeSection.
                            if (self.open) {

                                exceptionRet = self.innerRender(contextRender, areaRender, dYOffset);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Virtual method to render the open part of the TypeSection.
                    self.innerRender = function (contextRender, areaRender, dYOffset) {

                        try {

                            // Render TypeSection.
                            var dYOffsetOffset = self.settingsNode.lineHeight;
                            for (var i = 0; i < self.parts.length; i++) {

                                var sectionPartIth = self.parts[i];

                                // Render out the section part.
                                var exceptionRet = sectionPartIth.render(contextRender,
                                    self.area,
                                    dYOffsetOffset);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }

                                // Adjust for the next typesection.
                                dYOffsetOffset += sectionPartIth.getHeight();
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method returns bool if eponymous.
                    self.overName = function (pointCursor) {

                        // No area = no parts.
                        if (!self.area) {

                            return false;
                        }

                        // Figure out where, over the type, the cursor is.
                        var dHeightRelativeToTopOfType = pointCursor.y - self.area.location.y;

                        // If over the title.
                        return (dHeightRelativeToTopOfType < self.settingsNode.lineHeight);
                    };

                    // Helper method returns method or property under cursor.
                    self.over = function (pointCursor) {

                        // No area = no parts.
                        if (!self.area) {

                            return null;
                        }

                        // Figure out where, over the parent, the cursor is.
                        var dHeightRelative = pointCursor.y - (self.area.location.y + self.settingsNode.lineHeight);

                        // No part if no parts.
                        if (self.parts.length === 0) {

                            return null;
                        }

                        // Calcuate index into collection based on first element.
                        var iIndex = Math.floor(dHeightRelative / self.parts[0].getHeight());
                        return self.parts[iIndex];
                    };
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
