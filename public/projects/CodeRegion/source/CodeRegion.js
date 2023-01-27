///////////////////////////////////////
// CodeRegion module.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["./prototypes",
    "./Block",
    "./Statement",
	"./Expression"],
    function (prototypes,
        Block,
        Statement,
    	Expression) {

        try {

            // CodeRegion constructor function.
        	var functionRet = function CodeRegion(optionsOverride) {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public field.

                    // Options configuration.
                    self.options = {

                        host: {

                            selector: "#CodeLadder"         // The host selector.
                        },
                        strokeBackground: "#ffff33",        // Border color.
                        strokeWidth: 3,                     // Width of border.
                        fillBackground: "#333333",          // Background color.
                        defaultWidth: 800,                  // Arbitrary default width.
                        defaultHeight: 600,                 // Arbitrary default height.
                        cornerRadius: 40                    // Radius of background corner.
                    };

                    // Allow constructor parameters to override default settings.
                    self.options.inject(optionsOverride);

                    ///////////////////////
                    // Public methods.

                    // Add a region to the collection of regions,
                    // sort for z-index, and causse a re-render,
                    // but only render if already this is created.
                    self.addRegion = function (region) {

                        try {

                            // Set the context in the region.
                            var exceptionRet = region.setContainer(self);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Set the context in the region.
                            exceptionRet = region.setContext(m_contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Add the region to the collection of regions.
                            m_arrayRegions.push(region);

                            // Define the sort comparison function.
                            var functionCompare = function(regionLHS, regionRHS) {

                                // Sort on zIndex.
                                if (regionLHS.options.zIndex < regionRHS.options.zIndex) {

                                    return -1;
                                } else if (regionLHS.options.zIndex > regionRHS.options.zIndex) {

                                    return 1;
                                } else {

                                    return 0;
                                }
                            };

                            // Sort the regions using the custom 
                            // compare function (e.g. by zIndex).
                            m_arrayRegions.sort(functionCompare);

                            // If this instance is created, then re-
                            // render it to now display this new region.
                            if (m_bCreated) {

                                // Render (but not dirty).
                                exceptionRet = m_functionRender();
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Clear the focus from all regions.
                    self.clearFocus = function () {

                        try {

                            // Clear for all regions.
                            for (var i = 0; i < m_arrayRegions.length; i++) {

                                // Extract the region.
                                var regionIth = m_arrayRegions[i];
                                if (!regionIth) {

                                    continue;
                                }

                                // Clear.
                                var exceptionRet = regionIth.setFocus(false);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Attach instance to DOM and initialize state.
                    self.create = function () {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "Instance already created!" };
                            }

                            // Get the parent references.
                            m_jqParent = $(self.options.host.selector);
                            if (m_jqParent.length === 0) {

                                throw { message: "Failed to select parent element: " + self.options.host.selector };
                            }

                            // Create the render canvas.
                            m_canvasRender = document.createElement("canvas");
                            m_canvasRender.id = "CodeRegionSurface";
                            m_canvasRender.tabIndex = "1";
                            m_contextRender = m_canvasRender.getContext("2d");
                            m_jqCanvas = $(m_canvasRender);
                            m_jqCanvas.css({

                                    position: "absolute",
                                    top: "0px",
                                    left: "0px"
                                });
                            m_jqParent.append(m_canvasRender);

                            // Hook the resize to update the size of the dashboard when the browser is resized.
                            $(window).bind("resize",
                                m_functionWindowResize);

                            // Wire events to canvas.
                            m_jqCanvas.bind("click",
                                m_functionClick);
                            m_jqCanvas.bind("mousemove",
                                m_functionMouseMove);
                            m_jqCanvas.bind("mousedown",
                                m_functionMouseDown);
                            m_jqCanvas.bind("mouseup",
                                m_functionMouseUp);
                            m_jqCanvas.bind("mouseout",
                                m_functionMouseOut);
                            m_jqCanvas.bind("keydown",
                                m_functionKeyDown);
                            m_jqCanvas.bind("keypress",
                                m_functionKeyPress);
                            m_jqCanvas.bind("keyup",
                                m_functionKeyUp);

                            // Because it is!
                            m_bCreated = true;
                            
                            // Cause the initial render.
                            return self.forceRender();
                        } catch (e) {

                            return e;
                        }
                    };

                    // Decompose instance.
                    self.destroy = function () {

                        try {

                            // Can only destroy a created instance.
                            if (!m_bCreated) {

                                throw { message: "Instance not created!" };
                            }

                            // Unwire events from canvas.
                            m_jqCanvas.unbind("click",
                                m_functionClick);
                            m_jqCanvas.unbind("mousemove",
                                m_functionMouseMove);
                            m_jqCanvas.unbind("mousedown",
                                m_functionMouseDown);
                            m_jqCanvas.unbind("mouseup",
                                m_functionMouseUp);
                            m_jqCanvas.unbind("mouseout",
                                m_functionMouseOut);
                            m_jqCanvas.unbind("keydown",
                                m_functionOnKeyDown);
                            m_jqCanvas.unbind("keypress",
                                m_functionOnKeyPress);
                            m_jqCanvas.unbind("keyup",
                                m_functionOnKeyUp);

                            // Un-hook the resize too.
                            $(window).unbind("resize",
                                m_functionWindowResize);

                            // Because is no longer is.
                            m_bCreated = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Force update display.
                    self.forceRender = function () {

                        try {

                            // Cause recalculate of layout and re-render.
                            m_functionWindowResize();

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };
               
                    ///////////////////////
                    // Private methods.

                    // Calculate e.offsetX and e.offsetY 
                    // if they are undefined (as in Firefox).
                    var m_functionPossibleFirefoxAdjustment = function (e) {

                        try {
                            
                            // Check...
                            if (e.offsetX !== undefined &&
                                e.offsetY !== undefined)
                                return null;

                            // ... else, calculate.
                            e.offsetX = e.pageX - m_jqParent.offset().left;
                            e.offsetY = e.pageY - m_jqParent.offset().top;

                            return null;
                        } catch (e) {
                            
                            return e;
                        }
                    };

                    // Invoked when the browser is resized.
                    // Implemented to recalculate the regions
                    // and re-render the display elements.
                    var m_functionWindowResize = function (e) {

                        try {

                            // Setting dirty causes the render to calculate layout.
                            m_bDirty = true;
               
                            // Cause the render.
                            var exceptionRet = m_functionRender();
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Calculate the section rectangles.
                    var m_functionCalculateLayout = function () {

                        try {

                            // Get the size from the container, 
                            // if possible, or default (?).
                            m_dWidth = m_jqParent.width();
                            if (m_dWidth === undefined || 
                                m_dWidth === 0) {

                                m_dWidth = self.options.defaultWidth;
                            }
                            m_dHeight = m_jqParent.height();
                            if (m_dHeight === undefined || 
                                m_dHeight === 0) {

                                m_dHeight = self.options.defaultHeight;
                            }

                            // Update canvas sizes--do this last to minimize the time that the canvas is blank.
                            m_canvasRender.width = m_dWidth;
                            m_canvasRender.height = m_dHeight;

                            // Also ajust the CSS values so the canvas never scales.
                            m_jqCanvas.css({

                                width: m_dWidth.toString() + "px",
                                height: m_dHeight.toString() + "px"
                            });

                            // Possibly not neccessary to refresh this?
                            m_contextRender = m_canvasRender.getContext("2d");

                            // Also update all regions.
                            for (var i = 0; i < m_arrayRegions.length; i++) {

                                // Extract the region.
                                var regionIth = m_arrayRegions[i];
                                if (!regionIth) {

                                    continue;
                                }

                                // Set the context in each region.
                                var exceptionRet = regionIth.setContext(m_contextRender);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }
                            
                            // These pipes are clean!
                            m_bDirty = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render out the code regions.
                    var m_functionRender = function () {
                        
                        try {
               
                            var exceptionRet = null;
               
                            // Calculate the layout whenever dirty.
                            if (m_bDirty) {

                                exceptionRet = m_functionCalculateLayout();
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            }

                            // Render body.
                            exceptionRet = m_functionRenderBackground();
                            if (exceptionRet !== null) {
                                
                                return exceptionRet;
                            }

                            // Render all regions.
                            exceptionRet = m_functionRenderRegions();
                            if (exceptionRet !== null) {
                                
                                return exceptionRet;
                            }

                            return null;
                        } catch (e) {
                            
                            return e;
                        }
                    };

                    // Render out the background area.
                    var m_functionRenderBackground = function () {
                        
                        try {

                            // Clear background.
                            m_contextRender.clearRect(0,
                                0,
                                m_dWidth,
                                m_dHeight);

                            // Draw the rounded body background.
                            m_contextRender.beginPath();
                            m_contextRender.moveTo(0,
                                    0);
                            m_contextRender.lineTo(0,
                                    m_dHeight - self.options.cornerRadius);
                            m_contextRender.quadraticCurveTo(0,
                                    m_dHeight,
                                    self.options.cornerRadius,
                                    m_dHeight);

                            m_contextRender.lineTo(m_dWidth - self.options.cornerRadius,
                                    m_dHeight);

                            m_contextRender.quadraticCurveTo(m_dWidth,
                                    m_dHeight,
                                    m_dWidth,
                                    m_dHeight - self.options.cornerRadius);

                            m_contextRender.lineTo(m_dWidth,
                                    self.options.cornerRadius);

                            m_contextRender.quadraticCurveTo(m_dWidth,
                                    0,
                                    m_dWidth - self.options.cornerRadius,
                                    0);

                            m_contextRender.closePath();

                            // Render solid background color.
                            m_contextRender.fillStyle = self.options.fillBackground;
                            m_contextRender.fill();
                            m_contextRender.lineWidth = self.options.strokeWidth;
                            m_contextRender.strokeStyle = self.options.strokeBackground;
                            m_contextRender.stroke();

                            return null;
                        } catch (e) {
                            
                            return e;
                        }
                    };

                    // Render out the regions.
                    var m_functionRenderRegions = function () {
                        
                        try {

                            // Render each region back to front.
                            for (var i = 0; i < m_arrayRegions.length; i++) {

                                // Extract region.
                                var regionIth = m_arrayRegions[i];
                                if (!regionIth) {

                                    continue;
                                }

                                // Render it.
                                var exceptionRet = regionIth.render();
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            return null;
                        } catch (e) {
                            
                            return e;
                        }
                    };

                    // Invoked when the canvas is clicked by the user.
                    // Implemented to pass on to managed regions.
                    var m_functionClick = function (e) {

                        try {

                            // Possibly adjust offset for firefox.
                            var exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                            if (exceptionRet !== null) {

                                return exceptionRet;
                            }

                            // Allow each region to handle click back to front.
                            for (var i = 0; i < m_arrayRegions.length; i++) {

                                // Extract region.
                                var regionIth = m_arrayRegions[i];
                                if (!regionIth) {

                                    continue;
                                }

                                // Render it.
                                var exceptionRet = regionIth.click(e);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when the mouse is moved over the canvas.
                    // Implemented to pass on to managed regions.
                    var m_functionMouseMove = function (e) {

                        try {

                            // Possibly adjust offset for firefox.
                            var exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                            if (exceptionRet !== null) {

                                return exceptionRet;
                            }

                            // Talk to each region.  If any region cares, it can 
                            // set the cursor, otherwise default it to default.
                            var strCursor = null;

                            // Allow each region to handle move front to back.
                            for (var i = 0; i < m_arrayRegions.length; i++) {

                                // Extract region (redro esrever ni).
                                var regionIth = m_arrayRegions[m_arrayRegions.length - 1 - i];
                                if (!regionIth) {

                                    continue;
                                }

                                // Ask it to handle move.
                                strCursor = regionIth.mouseMove(e);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }

                                // Once found, just exit.
                                if (strCursor) {

                                    break;
                                }
                            }

                            // Ensure the cursor is set to...something....
                            if (!strCursor) {

                                strCursor = "default";
                            }

                            // Set the cursor.
                            m_jqCanvas.css("cursor",
                                strCursor);
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when the mouse is let up over the canvas.
                    // Implemented to pass on to managed regions.
                    var m_functionMouseUp = function (e) {

                        try {

                            // Possibly adjust offset for firefox.
                            var exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            // Allow each region to handle mouseup back to front.
                            for (var i = 0; i < m_arrayRegions.length; i++) {

                                // Extract region.
                                var regionIth = m_arrayRegions[i];
                                if (!regionIth) {

                                    continue;
                                }

                                // Render it.
                                var exceptionRet = regionIth.mouseUp(e);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };
               
                    // Invoked when the mouse is moved away from the canvas.
                    // Implemented to pass on to managed regions.
                    var m_functionMouseOut = function (e) {

                        try {

                            // Possibly adjust offset for firefox.
                            var exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            // Allow each region to handle click back to front.
                            for (var i = 0; i < m_arrayRegions.length; i++) {

                                // Extract region.
                                var regionIth = m_arrayRegions[i];
                                if (!regionIth) {

                                    continue;
                                }

                                // Clear the "capture" state.
                                regionIth.options.clickedDownInThisRegion = false;
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };
               
                    // Invoked when the mouse is pressed down over the canvas.
                    // Implemented to pass on to managed regions.
                    var m_functionMouseDown = function (e) {

                        try {

                            // Possibly adjust offset for firefox.
                            var exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            // Allow each region to handle click back to front.
                            for (var i = 0; i < m_arrayRegions.length; i++) {

                                // Extract region.
                                var regionIth = m_arrayRegions[i];
                                if (!regionIth) {

                                    continue;
                                }

                                // Mouse down.
                                var exceptionRet = regionIth.mouseDown(e);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };
               
                    // Invoked when a key is depressed over the canvas.
                    // Implemented to pass on to managed regions.
                    var m_functionKeyDown = function (e) {

                        try {

                            // Allow each region to handle click back to front.
                            for (var i = 0; i < m_arrayRegions.length; i++) {

                                // Extract region.
                                var regionIth = m_arrayRegions[i];
                                if (!regionIth) {

                                    continue;
                                }

                                // Key down.
                                var exceptionRet = regionIth.keyDown(e);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when a key is let up over the canvas.
                    // Implemented to pass on to managed regions.
                    var m_functionKeyUp = function (e) {

                        try {

                            // Allow each region to handle click back to front.
                            for (var i = 0; i < m_arrayRegions.length; i++) {

                                // Extract region.
                                var regionIth = m_arrayRegions[i];
                                if (!regionIth) {

                                    continue;
                                }

                                // Key up.
                                var exceptionRet = regionIth.keyUp(e);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };
               
                    // Invoked when a key is pressed over the canvas.
                    // Implemented to pass on to managed regions.
                    var m_functionKeyPress = function (e) {

                        try {

                            // Allow each region to handle keypress back to front.
                            for (var i = 0; i < m_arrayRegions.length; i++) {

                                // Extract region.
                                var regionIth = m_arrayRegions[i];
                                if (!regionIth) {

                                    continue;
                                }

                                // Key press.
                                var exceptionRet = regionIth.keyPress(e);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };
               
                    ///////////////////////
                    // Private fields.

                    // jQuery object wrapping the parent DOM element.
                    var m_jqParent = null;
                    // jQuery object wrapping the child (render) DOM element.
                    var m_jqCanvas = null;
                    // The rendering canvas.
                    var m_canvasRender = null;
                    // The rendering canvas's render context.
                    var m_contextRender = null;
                    // Indicates this instance is already created.
                    var m_bCreated = false;
                    // Define the dirty state.
                    var m_bDirty = true;
                    // Width of object.
                    var m_dWidth = 0;
                    // Height of object.
                    var m_dHeight = 0;
                    // Collection of managed regions.
                    var m_arrayRegions = [];
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
