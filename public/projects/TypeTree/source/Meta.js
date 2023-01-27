///////////////////////////////////////
// Meta module.
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
    function (prototypes, options, Point, Size, Area, TypeSection) {

        try {

            // Constructor function.
            var functionRet = function Meta() {

                try {

                    var self = this;                        // Uber closure.

                    // Inherit from TypeSection.
                    self.inherits(TypeSection,
                        "Meta",
                        "meta",
                        null);

                    ////////////////////////
                    // Public Methods.

                    // Returns the added height of this type if open.
                    self.innerGetHeight = function () {

                        return (self.settingsNode.height);
                    };

                    // Virtual mouse down overridden in meta.
                    self.innerMouseDown = function (e, pointCursor) {

                        return null;
                    };

                    // Invoked to handle mouse move if not over name.
                    self.innerMouseMove = function (e, pointCursor, objectReference) {

                        try {

                            // Else, over the TypeSection or properties.
                            objectReference.cursor = "cell";

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Virtual method to render the open part of the TypeSection.
                    self.innerRender = function (contextRender, areaRender, dYOffset) {

                        try {

                            // Render out headings for now.
                            contextRender.font = self.settingsNode.font;
                            if (self.highlight) {

                                contextRender.fillStyle = self.settingsNode.fillTextHighlight;
                            } else {

                                contextRender.fillStyle = self.settingsNode.fillText;
                            }

                            contextRender.fillText("Base class",
                                self.area.location.x + self.settingsNode.textOffset,
                                self.area.location.y + self.settingsNode.textOffsetY + self.settingsNode.lineHeight,
                                self.area.extent.width - self.settingsNode.textOffset);

                            contextRender.fillText("Description",
                                self.area.location.x + self.settingsNode.textOffset,
                                self.area.location.y + self.settingsNode.textOffsetY + 3 * self.settingsNode.lineHeight,
                                self.area.extent.width - self.settingsNode.textOffset);

                            contextRender.fillText("Developer",
                                self.area.location.x + self.settingsNode.textOffset,
                                self.area.location.y + self.settingsNode.textOffsetY + 6 * self.settingsNode.lineHeight,
                                self.area.extent.width - self.settingsNode.textOffset);

                            contextRender.fillText("Created",
                                self.area.location.x + self.settingsNode.textOffset,
                                self.area.location.y + self.settingsNode.textOffsetY + 8 * self.settingsNode.lineHeight,
                                self.area.extent.width - self.settingsNode.textOffset);

                            if (self.highlight) {

                                contextRender.fillStyle = self.settingsNode.fillHighlight;
                                contextRender.strokeStyle = self.settingsNode.strokeHighlight;
                            } else {

                                contextRender.fillStyle = self.settingsNode.fill;
                                contextRender.strokeStyle = self.settingsNode.stroke;
                            }

                            contextRender.strokeRect(self.area.location.x + self.settingsNode.textOffset,
                                self.area.location.y + self.settingsNode.textOffsetY + 2 * self.settingsNode.lineHeight,
                                self.area.extent.width - 2 * self.settingsNode.textOffset,
                                self.settingsNode.lineHeight);

                            contextRender.fillRect(self.area.location.x + self.settingsNode.textOffset,
                                self.area.location.y + self.settingsNode.textOffsetY + 2 * self.settingsNode.lineHeight,
                                self.area.extent.width - 2 * self.settingsNode.textOffset,
                                self.settingsNode.lineHeight);

                            contextRender.strokeRect(self.area.location.x + self.settingsNode.textOffset,
                                self.area.location.y + self.settingsNode.textOffsetY + 4 * self.settingsNode.lineHeight,
                                self.area.extent.width - 2 * self.settingsNode.textOffset,
                                2 * self.settingsNode.lineHeight);

                            contextRender.fillRect(self.area.location.x + self.settingsNode.textOffset,
                                self.area.location.y + self.settingsNode.textOffsetY + 4 * self.settingsNode.lineHeight,
                                self.area.extent.width - 2 * self.settingsNode.textOffset,
                                2 * self.settingsNode.lineHeight);

                            contextRender.strokeRect(self.area.location.x + self.settingsNode.textOffset,
                                self.area.location.y + self.settingsNode.textOffsetY + 7 * self.settingsNode.lineHeight,
                                self.area.extent.width - 2 * self.settingsNode.textOffset,
                                self.settingsNode.lineHeight);

                            contextRender.fillRect(self.area.location.x + self.settingsNode.textOffset,
                                self.area.location.y + self.settingsNode.textOffsetY + 7 * self.settingsNode.lineHeight,
                                self.area.extent.width - 2 * self.settingsNode.textOffset,
                                self.settingsNode.lineHeight);

                            contextRender.strokeRect(self.area.location.x + self.settingsNode.textOffset,
                                self.area.location.y + self.settingsNode.textOffsetY + 9 * self.settingsNode.lineHeight,
                                self.area.extent.width - 2 * self.settingsNode.textOffset,
                                self.settingsNode.lineHeight);

                            contextRender.fillRect(self.area.location.x + self.settingsNode.textOffset,
                                self.area.location.y + self.settingsNode.textOffsetY + 9 * self.settingsNode.lineHeight,
                                self.area.extent.width - 2 * self.settingsNode.textOffset,
                                self.settingsNode.lineHeight);

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                } catch (e) {

                    alert(e.message);
                }
            };

            // Inherit from TypeSection.
            functionRet.inheritsFrom(TypeSection);

            return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
