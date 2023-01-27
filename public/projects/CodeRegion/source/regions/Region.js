////////////////////////////////////////
// Region -- Region maintained as a quasi child of a managed Canvas.
//
// Return constructor function.

"use strict";

define(["../prototypes"],
    function (prototypes) {

        // Define constructor function.
        var functionRet = function Region(optionsOverride) {

            var self = this;            // Uber closure.

            ////////////////////////////
            // Public methods.

            // Method called by container to handle click.
            self.click = function (e) {

                try {

                    // Test against the bounding coordinates.
                    if (!self.options.visible ||
                        e.offsetX < self.options.left ||
                        e.offsetX > self.options.left + self.options.width ||
                        e.offsetY < self.options.top ||
                        e.offsetY > self.options.top + self.options.height ||
                        !self.options.enabled) {

                        return null;
                    }

                    // Generate the path--no reason to render.
                    var exceptionRet = self.generatePath();
                    if (exceptionRet !== null) {

                        return exceptionRet;
                    }

                    // Test the event against the path for this instance.
                    if (self.options.context.isPointInPath(e.offsetX,
                            e.offsetY)) {

                        // Give the region a shot at handling the click event.
                        return self.handleClick(e);
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method called by container to handle mouse move.
            self.mouseMove = function (e) {

                try {

                    // Test against the bounding coordinates.
                    if ((!self.options.visible ||
                        e.offsetX < self.options.left ||
                        e.offsetX > self.options.left + self.options.width ||
                        e.offsetY < self.options.top ||
                        e.offsetY > self.options.top + self.options.height ||
                        !self.options.enabled) &&
                        !self.options.clickedDownInThisRegion) {

                        return null;
                    }

                    // Generate the path--no reason to render.
                    var exceptionRet = self.generatePath();
                    if (exceptionRet !== null) {

                        return exceptionRet;
                    }

                    // Test the event against the path for this instance.
                    if (self.options.clickedDownInThisRegion ||
                        self.options.context.isPointInPath(e.offsetX,
                            e.offsetY)) {

                        // Set cursor.
                        return self.handleMouseMove(e);
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method called by container to handle mouse up.
            self.mouseUp = function (e) {

                try {

                    // Test against the bounding coordinates.
                    if ((!self.options.visible ||
                        e.offsetX < self.options.left ||
                        e.offsetX > self.options.left + self.options.width ||
                        e.offsetY < self.options.top ||
                        e.offsetY > self.options.top + self.options.height ||
                        !self.options.enabled) &&
                        !self.options.clickedDownInThisRegion) {

                        return null;
                    }

                    // Generate the path--no reason to render.
                    var exceptionRet = self.generatePath();
                    if (exceptionRet !== null) {

                        return exceptionRet;
                    }

                    // Test the event against the path for this instance.
                    if (self.options.clickedDownInThisRegion ||
                        self.options.context.isPointInPath(e.offsetX,
                            e.offsetY)) {

                        // Set cursor.
                        return self.handleMouseUp(e);
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method called by container to handle mouse down.
            self.mouseDown = function (e) {

                try {

                    // Test against the bounding coordinates.
                    if (!self.options.visible ||
                        e.offsetX < self.options.left ||
                        e.offsetX > self.options.left + self.options.width ||
                        e.offsetY < self.options.top ||
                        e.offsetY > self.options.top + self.options.height ||
                        !self.options.enabled) {

                        return null;
                    }

                    // Generate the path--no reason to render.
                    var exceptionRet = self.generatePath();
                    if (exceptionRet !== null) {

                        return exceptionRet;
                    }

                    // Test the event against the path for this instance.
                    if (self.options.context.isPointInPath(e.offsetX,
                            e.offsetY)) {

                        // Clear any existing focus using the container.
                        exceptionRet = self.options.container.clearFocus();
                        if (exceptionRet !== null) {

                            return exceptionRet;
                        }

                        // Take focus.
                        self.options.hasFocus = true;

                        // Set cursor.
                        return self.handleMouseDown(e);
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method called by container to handle key press.
            self.keyPress = function (e) {

                try {

                    // If focused, handle key event.
                    if (self.options.hasFocus) {

                        // Set cursor.
                        return self.handleKeyPress(e);
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method called by container to handle key up.
            self.keyUp = function (e) {

                try {

                    // If focused, handle key event.
                    if (self.options.hasFocus) {

                        // Set cursor.
                        return self.handleKeyUp(e);
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method called by container to handle key down.
            self.keyDown = function (e) {

                try {

                    // If focused, handle key event.
                    if (self.options.hasFocus) {

                        // Set cursor.
                        return self.handleKeyDown(e);
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render the region to the parent canvas.
            self.render = function () {

                try {

                    // Leave if not visible.
                    if (!self.options.visible) {
       
                        return null;
                    }

                    // Generate the path.
                    var exceptionRet = self.generatePath();
                    if (exceptionRet !== null) {

                        return exceptionRet;
                    }
       
                    // Render border if specified.
                    if (self.options.border.enabled) {
       
                        self.options.context.strokeStyle = self.convertColor(self.options.border.strokeStyle);
                        self.options.context.lineWidth = self.options.border.lineWidth;
                        self.options.context.stroke();
                    }

                    // Fill in the path that has been generated.
                    if (self.options.selected) {
                    	
                        self.options.context.fillStyle = self.convertColor(self.options.fillStyleSelected);
                    } else if (self.options.enabled) {

                        self.options.context.fillStyle = self.convertColor(self.options.fillStyleEnabled);
                    } else {

                        self.options.context.fillStyle = self.convertColor(self.options.fillStyleDisabled);
                    }
                    self.options.context.fill();

                    // Draw in the rest of the region.
                    exceptionRet = self.renderInterior();
                    if (exceptionRet !== null) {

                        return exceptionRet;
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Set the enabled property to the specified bool.
            self.setEnabled = function (bEnabled) {

                try {

                    // Set.
                    self.options.enabled = bEnabled;

                    // Update display.
                    return self.render();
                } catch (e) {

                    return e;
                }
            };
       
            // Set the selected property to the specified bool.
            self.setSelected = function (bSelected) {

                try {

                    // Set.
                    self.options.selected = bSelected;

                    // Update display.
                    return self.render();
                } catch (e) {

                    return e;
                }
            };
       
            // Set the context for this object.
            self.setContext = function (context) {
       
                try {
       
                    // Set.
                    self.options.context = context;
       
                    return null;
                } catch (e) {
       
                    return e;
                }
            };

            // Set the container for this object.
            self.setContainer = function (container) {
       
                try {
       
                    // Set.
                    self.options.container = container;
       
                    return null;
                } catch (e) {
       
                    return e;
                }
            };

            // Set the container for this object.
            self.setFocus = function (bFocus) {
       
                try {
       
                    // Set.
                    self.options.hasFocus = bFocus;

                    // Update display.
                    return self.render();
                } catch (e) {
       
                    return e;
                }
            };

            // Convert a color from #rrggbb format to rgba(rr,gg,bb,opacity).
            self.convertColor = function (strHex) {
       
                // Return original if not Hex.
                if (strHex.indexOf("#") !== 0) {
       
                    return strHex;
                }
       
                // Convert.
                var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(strHex);
                var iRed = parseInt(result[1], 16);
                var iGreen = parseInt(result[2], 16);
                var iBlue = parseInt(result[3], 16);
                return "rgba("+iRed+","+iGreen+","+iBlue+","+self.options.opacity+")";
            };

            ////////////////////////////
            // Protected methods.

            // Generate the boundard path.
            // Do nothing in base class.
            self.generatePath = function () {

                try {

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Process click event.
            // Do nothing in base class.
            self.handleClick = function () {

                try {

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Process mouse move event.
            // Do nothing in base class.
            self.handleMouseMove = function () {

                try {

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Process mouse move event.
            // Do nothing in base class.
            self.handleMouseUp = function () {

                try {

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Process mouse move event.
            // Do nothing in base class.
            self.handleMouseDown = function () {

                try {

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Process key event.
            // Do nothing in base class.
            self.handleKeyPress = function () {

                try {

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Process key event.
            // Do nothing in base class.
            self.handleKeyUp = function () {

                try {

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Process key event.
            // Do nothing in base class.
            self.handleKeyDown = function () {

                try {

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render the interior of the button.
            // Do nothing in base class.
            self.renderInterior = function () {

                try {

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Protected fields.

            // Options configuration object.
            self.options = {

                container: null,        // The owner of this and related regions.
                zIndex: 1,              // The zindex of the region defines its order (higher first).
                visible: true,          // Indicates this region is visible and responds to events.
                opacity: 1,             // Opacity of region
                left: 0,                // Bounding coordinates:
                top: 0,                 //
                width: 0,               //
                height: 0,              //
                right: 0,               // Placement specifier for "right" positionMode.
                positionMode: "left",   // Determines how the region is placed on page.
                path: null,             // Internal boundary path.
                context: null,          // Context of canvas.
                enabled: true,          // Indicates this region is enabled.
                fillStyleEnabled: "#ffffff",    // Style to fill in enabled.
                fillStyleDisabled: "#808080",   // Style to fill in disabled. Light gray.
                selected: false,		// Indicates that this instance has been selected by the user
                fillStyleSelected: "#6d1b3e",	// Style to fill in selected. Medium purple.
                clickedDownInThisRegion: false, // Indicates that the mouse was depressed over this region.  Overrides clipping tests.
                hasFocus: false,        // Indicates this type cares about focus.
                border: {
       
                    enabled: true,      // Indicates that the boder is enabled.
                    strokeStyle: "#ffffff",     // Style to render the border.
                    lineWidth: 1		// Border line width (overridden only in RegionInput).
                }
            };

            // Allow constructor parameters to override default settings.
            self.options.inject(optionsOverride);
        };

        // Return constructor function.
        return functionRet;
    });
