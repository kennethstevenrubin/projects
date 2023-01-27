///////////////////////////////////////
// Type module.
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
    "TypeSection"],
    function (prototypes, options, Point, Size, Area, TypeSections) {

        try {

            // Constructor function.
        	var functionRet = function Type(strName, arrayTypeSections) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Name of this type object.
                    self.name = strName || "default";
                    // Collection of contained method objects.
                    self.typeSections = arrayTypeSections || [];
                    // Indicates the type is open.
                    self.open = false;
                    // Indicates the type is highlighted.
                    self.highlight = false;
                    // Get the node containing settings for this type.
                    self.settingsNode = options.tree.type;

                    ////////////////////////
                    // Public methods.

                    // Returns the height of this type.
                    self.getHeight = function () {

                        var dHeight = self.settingsNode.lineHeight + 2 * self.settingsNode.margin;
                        if (self.open && self.typeSections.length > 0) {

                            // Add in child height and borders....
                            for (var i = 0; i < self.typeSections.length; i++) {

                                dHeight += self.typeSections[i].getHeight();
                            }
                            dHeight += self.settingsNode.margin * (self.typeSections.length - 1);
                        }

                        return dHeight;
                    };

                    // Invoked when the mouse is pressed down over the type.
                    self.mouseDown = function (e, pointCursor) {

                        try {

                            // Can't do much if no area.
                            if (!m_area) {

                                return null;
                            }
                            // If over the title.
                            if (m_functionOverName(pointCursor)) {

                                // Toggle openness.
                                if (self.open) {

                                    self.open = false;
                                } else {

                                    self.open = true;
                                }
                            } else if (m_objectHighlight) {

                                // Pass down to highlight object.
                                m_objectHighlight.mouseDown(e, pointCursor);
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Invoked when the mouse is moved over the type.
                    self.mouseMove = function (e, pointCursor, objectReference, contextRender) {

                        try {

                            // Can't do much if no area.
                            if (!m_area) {

                                return null;
                            }

                            // Reset highlight.
                            var exceptionRet = self.mouseOut();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // If over the title.
                            if (m_functionOverName(pointCursor)) {

                                objectReference.cursor = "ns-resize";
                            } else {

                                // Else, over the methods or properties or events.
                                objectReference.cursor = "hand";

                                // Figure out which.
                                for (var i = 0; i < self.typeSections.length; i++) {

                                    var typeSectionIth = self.typeSections[i];

                                    // Test mouse.
                                    if (typeSectionIth.pointInTypeSection(contextRender, 
                                        pointCursor)) {

                                        // Highlight.
                                        m_objectHighlight = typeSectionIth;
                                        typeSectionIth.highlight = true;

                                        // Pass down to methods.
                                        exceptionRet = typeSectionIth.mouseMove(e, 
                                            pointCursor, 
                                            objectReference, 
                                            contextRender);
                                        if (exceptionRet) {

                                            throw exceptionRet;
                                        }

                                        // There can be only one!
                                        break;
                                    } 
                                }
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
                            if (m_objectHighlight) {

                                m_objectHighlight.mouseOut();
                                m_objectHighlight.highlight = false;
                                m_objectHighlight = null;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Test if the point is in this Type.
                    self.pointInType = function (contextRender, point) {

                        // Return false if never rendered.
                        if (!m_area) {

                            return false;
                        }

                        // Return hit-test against generated path.
                        return m_area.pointInArea(contextRender,
                            point);
                    }

                    // Render out this type.
                    self.render = function (contextRender, areaRender, dY) {

                        try {

                            // Define the containing area.
                            m_area = new Area(
                                new Point(areaRender.location.x + self.settingsNode.margin, 
                                    areaRender.location.y + self.settingsNode.margin + dY),
                                new Size(areaRender.extent.width - 2 * self.settingsNode.margin, 
                                    self.getHeight() - 2 * self.settingsNode.margin)
                            );

                            // Generate the path.
                            var exceptionRet = m_area.generateRoundedRectPath(contextRender);
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
                            contextRender.fillStyle = self.settingsNode.fillText;
                            contextRender.fillText(self.name,
                                m_area.location.x + self.settingsNode.textOffset,
                                m_area.location.y,
                                m_area.extent.width - self.settingsNode.textOffset);

                            // If open, render methods and properties.
                            if (self.open) {

                                // Figure out which.
                                var dYOffset = self.settingsNode.lineHeight;
                                for (var i = 0; i < self.typeSections.length; i++) {

                                    var typeSectionIth = self.typeSections[i];

                                    // Render type section.
                                    exceptionRet = typeSectionIth.render(contextRender, 
                                        m_area,
                                        dYOffset);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    // Adjust for the next typesection.
                                    dYOffset += typeSectionIth.getHeight() + self.settingsNode.margin;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private methods.

                    // Helper method returns bool if eponymous.
                    var m_functionOverName = function (pointCursor) {

                        // Figure out where, over the type, the cursor is.
                        var dHeightRelativeToTopOfType = pointCursor.y - m_area.location.y;

                        // If over the title.
                        return (dHeightRelativeToTopOfType < self.settingsNode.lineHeight);
                    };

                    //////////////////////////
                    // Private fields.

                    // The area, relative to the canvas, occupied by this instance.
                    var m_area = null;
                    // Remember which object has the highlight.
                    var m_objectHighlight = null;
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
