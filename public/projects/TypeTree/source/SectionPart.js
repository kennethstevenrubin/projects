///////////////////////////////////////
// SectionPart module.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["prototypes",
    "options",
    "Point",
    "Size",
    "Area"],
    function (prototypes, options, Point, Size, Area) {

        try {

            // Constructor function.
        	var functionRet = function SectionPart(strName, strSettingsNode) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Name of this method object.
                    self.name = strName || "default";
                    // Indicates the method is highlighted.
                    self.highlight = false;
                    // Get a reference to the settings for this object.
                    self.settingsNode = options.tree[strSettingsNode || "TypeSection"];

                    ////////////////////////
                    // Public methods.

                    // Returns the height of this sectionpart.
                    self.getHeight = function () {

                        var dHeight = self.settingsNode.lineHeight + 2 * self.settingsNode.margin;
                        return dHeight;
                    };

                    // Render out this part.
                    self.render = function (contextRender, areaRender, dYOffset) {

                        try {

                            // Define the containing area.
                            m_area = new Area(
                                new Point(areaRender.location.x + self.settingsNode.margin, 
                                    areaRender.location.y + self.settingsNode.margin + dYOffset),
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
                            if (self.highlight) {

                                contextRender.fillStyle = self.settingsNode.fillTextHighlight;
                            } else {

                                contextRender.fillStyle = self.settingsNode.fillText;
                            }
                            contextRender.fillText(self.name,
                                m_area.location.x + self.settingsNode.textOffset,
                                m_area.location.y + self.settingsNode.margin,
                                m_area.extent.width - self.settingsNode.textOffset);

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    //////////////////////////
                    // Private fields.

                    // The area, relative to the canvas, occupied by this instance.
                    var m_area = null;
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
