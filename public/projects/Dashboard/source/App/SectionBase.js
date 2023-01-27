////////////////////////////////////////////
// PlumPalette section.

"use strict";

define([],
    function () {

        // Constructor function.
        var functionRet = function SectionBase(optionsOverride) {

            var self = this;            // Uber-closure.

            ////////////////////////////////////////////
            // Public methods.

            // Render section to Dashboard context.
            self.render = function (contextRender) {

                try {

                    // Do nothing if invisible.
                    if (self.isVisible() === false) {

                        return null;
                    }

                    var rectangle = self.options.rectangleSection;

                    // Fill background.
                    if (contextRender.foreground === undefined ||
                        contextRender.foreground === false) {

                        contextRender.fillStyle = self.options.backgroundFillStyle;
                        contextRender.fillRect(rectangle.left,
                            rectangle.top,
                            rectangle.width,
                            rectangle.height);
                    }

                    // Ask derived class to render itself.
                    return self.innerRender(contextRender);
                } catch (e) {

                    return e;
                }
            };

            // Give the sections an opportunity to handle the resize.
            self.onResize = function () {

                try {

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Return bool indicating the point is inside the triangle.
            self.isPointInRectangle = function (e) {

                return ((e.offsetX >= self.options.rectangleSection.left) && 
                    (e.offsetX < self.options.rectangleSection.left + self.options.rectangleSection.width) &&
                    (e.offsetY >= self.options.rectangleSection.top) &&
                    (e.offsetY < self.options.rectangleSection.top + self.options.rectangleSection.height));
            };

            // Return the string which fits in the size.
            self.fitStringToWidth = function (strDescription,
                fontRender,
                dWidth) {

                // First just fall out.
                var dFirstSize = strDescription.size(fontRender).width;
                if (dFirstSize <= dWidth) {

                    return strDescription;
                }

                // Chop off one character at a time.
                strDescription = strDescription.substring(0, strDescription.length - 1);
                var strUse = strDescription + "...";
                while (strUse.size(fontRender).width > dWidth) {

                    strDescription = strDescription.substring(0, strDescription.length - 1);
                    strUse = strDescription + "...";
                }
                return strUse;
            }

            ////////////////////////////////////////////
            // Public properties.

            // Set the new rectangle and set for render.
            self.setRectangle = function (rectangleSection) {

                // Save in instance state.
                self.options.rectangleSection = rectangleSection;
            };

            // Return the rectangle for this section.
            self.getRectangle = function () {

                // Save in instance state.
                return self.options.rectangleSection;
            };

            ////////////////////////////////////////////
            // Virtual methods.

            // Function implemented to render section.
            // Do nothing in base class--must override.
            self.innerRender = function (contextRender) {

                // Do nothing.
                return null;
            };

            // Invoked when the mouse is clicked down.
            self.onMouseDown = function (e) {

                // Do nothing in base class.
                return null;
            }

            // Invoked when the mouse is let up.
            self.onMouseUp = function (e) {

                // Do nothing in base class.
                return null;
            }

            // Invoked when the mouse is moved.
            self.onMouseMove = function (e) {

                // Do nothing in base class.
                return null;
            }

            // Invoked when the mouse leaves the render context.
            self.onMouseOut = function (e) {

                // Do nothing in base class.
                return null;
            }

            ////////////////////////////////////////////
            // Virtual properties.

            // Return the height required by the section.
            // Do nothing in base class--must override.
            self.getHeight = function () {

                return 0;
            };

            // Return bool indicating visibility of Section.
            self.isVisible = function () {

                return false;
            };

            ////////////////////////////////////////////
            // Public fields.

            // Options configuration object.
            self.options = {

                planName: "Retirement",
                dashboard: null,
                endDate: function () {

                    return new Date(self.options.startDate.getTime() + self.options.displayWindowMS);
                },
                startDate: new Date(),
                displayWindowMS: new Date(2026, 0, 1).getTime() - new Date().getTime(),
                rectangleSection: null,
                renderData: [],
                title: "title"
            };

            // Allow constructor parameters to override default settings.
            self.options.inject(optionsOverride);
        };

        // No inherits in base class.

        // Just return the constructor function.
        return functionRet;
    });
