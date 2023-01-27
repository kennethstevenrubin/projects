///////////////////////////////////////
// Typeree module.
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
    "Type"],
    function (prototypes, options, Point, Size, Area, Type) {

        try {

            // Constructor function.
        	var functionRet = function TypeTree() {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public methods.

                    // Attach instance to DOM and initialize state.
                    self.create = function (arrayTypes) {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "Instance already created!" };
                            }

                            // Save the parents.
                            m_arrayTypes = arrayTypes;

                            // Get the parent references.
                            m_jqParent = $(options.tree.hostSelector);
                            if (m_jqParent.length === 0) {

                                throw { message: "Failed to select parent element: " + options.host.selector };
                            }

                            // Create the render canvas.
                            m_canvasRender = document.createElement("canvas");
                            m_canvasRender.id = "ObjectTreeSurface";
                            m_canvasRender.tabIndex = "1";
                            m_contextRender = m_canvasRender.getContext("2d");
                            m_jqCanvas = $(m_canvasRender);
                            m_jqCanvas.css({

                                    position: "absolute"
                                });
                            m_jqParent.append(m_canvasRender);

                            // Hook the resize to update the size of the dashboard when the browser is resized.
                            $(window).bind("resize",
                                m_functionWindowResize);
                            
                            // Wire events to canvas.
                            m_jqCanvas.bind("mousemove",
                                m_functionMouseMove);
                            m_jqCanvas.bind("mousedown",
                                m_functionMouseDown);
                            m_jqCanvas.bind("mouseup",
                                m_functionMouseUp);
                            m_jqCanvas.bind("mouseout",
                                m_functionMouseOut);
                            m_jqCanvas.bind("mousewheel", 
                                m_functionMouseWheel);

                            // Because it is!
                            m_bCreated = true;

                            // Start the rendering.
                            m_iAnimationFrameSequence = requestAnimationFrame(m_functionRender);

                            return null;
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

                            // Stop the rendering.
                            cancelAnimationFrame(m_iAnimationFrameSequence);

                            // Un-hook the resize too.
                            $(window).unbind("resize",
                                m_functionWindowResize);

                            // Unwire events from canvas.
                            m_jqCanvas.unbind("mousemove",
                                m_functionMouseMove);
                            m_jqCanvas.unbind("mousedown",
                                m_functionMouseDown);
                            m_jqCanvas.unbind("mouseup",
                                m_functionMouseUp);
                            m_jqCanvas.unbind("mouseout",
                                m_functionMouseOut);
                            m_jqCanvas.unbind("mousewheel", 
                                m_functionMouseWheel);

                            // Because is no longer is.
                            m_bCreated = false;

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

                            // Setting dirty causes the next render to calculate layout.
                            m_bDirty = true;
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when the mouse is moved over the canvas.
                    // Implemented to pass on to managed regions.
                    var m_functionMouseMove = function (e) {

                        try {

                            var exceptionRet = null;
                            if (e) {

                                // Possibly adjust offset for firefox.
                                exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                                if (exceptionRet !== null) {

                                    return exceptionRet;
                                }

                                // Convert event to point.
                                m_pointCursor = new Point(e.offsetX,
                                    e.offsetY);
                            }

                            // Test for over scroll margin.
                            // Calculate the total height.
                            var dTotalHeight = m_functionGetTotalHeight();

                            // Do nothing if nothing to scroll.
                            if (m_pointCursor &&
                                dTotalHeight > m_areaMaximal.extent.height) {

                                if (m_pointCursor.y < options.general.scrollStub.height / 2) {

                                    if (!m_cookieScroll) {

                                        m_cookieScroll = setInterval(function () {

                                            // Special case, scroll up.
                                            if (m_dScrollOffset < (dTotalHeight - m_areaMaximal.extent.height)) {

                                                m_dScrollOffset += 1;
                                            }
                                            // Pin to bounds.
                                            if (m_dScrollOffset > (dTotalHeight - m_areaMaximal.extent.height)) {

                                                m_dScrollOffset = (dTotalHeight - m_areaMaximal.extent.height);
                                            }
                                        },
                                            options.general.scrollStub.delayMS);
                                    }

                                    // Set the cursor.
                                    m_jqCanvas[0].style.cursor = "n-resize";
                                    return;
                                } else if (m_pointCursor.y > m_dHeight - options.general.scrollStub.height / 2) {

                                    if (!m_cookieScroll) {

                                        m_cookieScroll = setInterval(function () {

                                            // Special case, scroll down.
                                            if (m_dScrollOffset > 0) {

                                                m_dScrollOffset -= 1;
                                            }
                                            // Pin to bounds.
                                            if (m_dScrollOffset < 0) {

                                                m_dScrollOffset = 0;
                                            }
                                        },
                                            options.general.scrollStub.delayMS);
                                    }

                                    // Set the cursor.
                                    m_jqCanvas[0].style.cursor = "s-resize";
                                    return;
                                } else {

                                    if (m_cookieScroll) {

                                        clearInterval(m_cookieScroll);
                                        m_cookieScroll = null;
                                    }
                                }
                            }

                            // Call helper method to test the cursor point.
                            exceptionRet = m_functionTestPoint(m_pointCursor);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Define a reference object to pass 
                            // to mouseMove to extract a value.
                            var objectReference = {

                                cursor: null
                            };

                            // Pass mouse move to Parent, if cursor over parent.
                            if (m_typeCursor) {

                                // Pass it down.
                                var exceptionRet = m_typeCursor.mouseMove(e,
                                    m_pointCursor,
                                    objectReference,
                                    m_contextRender);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            // Ensure the cursor is set to...something....
                            if (!objectReference.cursor) {

                                objectReference.cursor = "default";
                            }

                            // Set the cursor.
                            m_jqCanvas[0].style.cursor = objectReference.cursor;
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when the mouse is let up over the canvas.
                    // Implemented to pass on to managed regions.
                    var m_functionMouseUp = function (e) {

                        try {

                        } catch (e) {

                            alert(e.message);
                        }
                    };
               
                    // Invoked when the mouse is moved away from the canvas.
                    // Implemented to pass on to managed regions.
                    var m_functionMouseOut = function (e) {

                        try {

                            // Deactivate the selection in the current parent.
                            if (m_typeCursor) {

                                var exceptionRet = m_typeCursor.mouseOut();
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            // Stop scrolling, if scrolling.
                            if (m_cookieScroll) {

                                clearInterval(m_cookieScroll);
                                m_cookieScroll = null;
                            }

                            // Reset the type under the cursor.
                            if (m_typeCursor) {

                                m_typeCursor.highlight = false;
                                m_typeCursor = null;
                            }

                            // Also reset the last mouse location.
                            m_pointCursor = null;
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

                                return exceptionRet;
                            }

                            // Convert event to point.
                            m_pointCursor = new Point(e.offsetX,
                                e.offsetY);

                            // Call helper method to test the cursor point.
                            exceptionRet = m_functionTestPoint(m_pointCursor);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Pass mouse down to Parent, if cursor over parent.
                            if (m_typeCursor) {

                                // Pass it down.
                                var exceptionRet = m_typeCursor.mouseDown(e,
                                    m_pointCursor);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }

                                // Calculate the total height.
                                var dTotalHeight = m_functionGetTotalHeight();

                                // Adjust down the scroll, if necessary.
                                if (m_dScrollOffset > (dTotalHeight - m_areaMaximal.extent.height)) {

                                    m_dScrollOffset = Math.max(0, 
                                        dTotalHeight - m_areaMaximal.extent.height);
                                }
                            }

                            // Force a render.
                            m_functionRender();

                            // Call helper method (again) to test the cursor point.
                            exceptionRet = m_functionTestPoint(m_pointCursor);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }


                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when the mouse wheel is scrolled over the canvas.
                    var m_functionMouseWheel = function (e) {

                        try {

                            // Calculate the total height.
                            var dTotalHeight = m_functionGetTotalHeight();

                            // Do nothing if nothing to scroll.
                            if (dTotalHeight < m_areaMaximal.extent.height) {

                                return null;
                            }

                            // Cancel default behavior.
                            e.preventDefault();
                            e.stopPropagation();

                            // Calculate distance.
                            var dAmount = -e.deltaY * e.deltaFactor;

                            // Scroll up if negative, else, down.
                            if (dAmount < 0) {

                                // Move it.
                                if (m_dScrollOffset > 0) {

                                    m_dScrollOffset += dAmount;
                                }
                                // Pin to bounds.
                                if (m_dScrollOffset < 0) {

                                    m_dScrollOffset = 0;
                                }
                            } else {

                                // Move it.
                                if (m_dScrollOffset < (dTotalHeight - m_areaMaximal.extent.height)) {

                                    m_dScrollOffset += dAmount;
                                }
                                // Pin to bounds.
                                if (m_dScrollOffset > (dTotalHeight - m_areaMaximal.extent.height)) {

                                    m_dScrollOffset = (dTotalHeight - m_areaMaximal.extent.height);
                                }
                            }

                            // Remove item selection.
                            m_functionMouseMove(null);
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Helper method tests cursor point, 
                    // sets cursor parent and mouse cursor.
                    var m_functionTestPoint = function (pointTest) {

                        try {

                            // Do nothing if no cursor.
                            if (!m_pointCursor) {

                                return null;
                            }

                            // Remember the current type cursor.
                            var typeOriginal = m_typeCursor;

                            // See if the cursor point is in any type.
                            if (m_typeCursor) {

                                m_typeCursor.highlight = null;
                                m_typeCursor = null;
                            }

                            for (var i = 0; i < m_arrayTypes.length; i++) {

                                // Get the ith type.
                                var typeIth = m_arrayTypes[i];

                                // Ask the parent if it contains the point.
                                var bContainsPoint = typeIth.pointInType(m_contextRender,
                                    m_pointCursor);
                                if (bContainsPoint) {

                                    m_typeCursor = typeIth;
                                    m_typeCursor.highlight = true;

                                    // Pass it down.
                                    var objectReference = {

                                        cursor: null
                                    };
                                    var exceptionRet = m_typeCursor.mouseMove(null,
                                        m_pointCursor,
                                        objectReference,
                                        m_contextRender);
                                    if (exceptionRet) {

                                        throw exceptionRet;
                                    }

                                    break;
                                }
                            }

                            // Deactivate the selection in the 
                            // current type, if it changed.
                            if (typeOriginal &&
                                m_typeCursor !== typeOriginal) {

                                var exceptionRet = typeOriginal.mouseOut();
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Helper method calculates usable total height of tree.
                    var m_functionGetTotalHeight = function () {

                        // Sum each type.
                        var dHeight = 0;
                        for (var i = 0; i < m_arrayTypes.length; i++) {

                            // Get the ith type.
                            var typeIth = m_arrayTypes[i];

                            // Ask the type how tall it is.
                            dHeight += typeIth.getHeight();
                        }
                        return dHeight;
                    };

                    // Calculate the section rectangles.
                    var m_functionCalculateLayout = function () {

                        try {

                            // Get the size from the container, 
                            // if possible, or default (?).
                            m_dWidth = m_jqParent.width();
                            if (m_dWidth === undefined || 
                                m_dWidth === 0) {

                                m_dWidth = options.tree.defaultWidth;
                            }
                            m_dHeight = m_jqParent.height();
                            if (m_dHeight === undefined || 
                                m_dHeight === 0) {

                                m_dHeight = options.tree.defaultHeight;
                            }

                            // Update canvas sizes--do this last to minimize the time that the canvas is blank.
                            m_canvasRender.width = m_dWidth;
                            m_canvasRender.height = m_dHeight;

                            // Also adjust the CSS values so the canvas never scales.
                            m_jqCanvas.css({

                                width: m_dWidth.toString() + "px",
                                height: m_dHeight.toString() + "px"
                            });

                            // Possibly not neccessary to refresh this?
                            m_contextRender = m_canvasRender.getContext("2d");
                            m_contextRender.textBaseline = "top";
                            m_contextRender.textAlign = "left";

                            // Calculate the maximal area.
                            m_areaMaximal = new Area(new Point(0, 0), 
                                new Size(m_dWidth, m_dHeight));

                            m_areaScrollStubUp = new Area(new Point((m_dWidth - options.general.scrollStub.width) / 2, options.general.scrollStub.yOffset), 
                                new Size(options.general.scrollStub.width, options.general.scrollStub.height));

                            m_areaScrollStubDown = new Area(new Point((m_dWidth - options.general.scrollStub.width) / 2, m_dHeight + options.general.scrollStub.yOffset), 
                                new Size(options.general.scrollStub.width, options.general.scrollStub.height));

                            // These pipes are clean!
                            m_bDirty = false;

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Render out the objects.
                    var m_functionRender = function () {
                        
                        try {

                            // Get "now".
                            var iMS = (new Date()).getTime();

                            // Calculate the layout whenever dirty.
                            var exceptionRet = null;
                            if (m_bDirty) {

                                exceptionRet = m_functionCalculateLayout();
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            }

                            // Clear background.
                            m_contextRender.clearRect(m_areaMaximal.location.x,
                                m_areaMaximal.location.y,
                                m_areaMaximal.extent.width,
                                m_areaMaximal.extent.height);

                            // Draw the rounded body background.
                            exceptionRet = m_areaMaximal.generateRoundedRectPath(m_contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            m_contextRender.fillStyle = options.tree.fillBackground;
                            m_contextRender.fill();

                            // Save canvas state.
                            m_contextRender.save();

                            // Set clip to background shape
                            m_contextRender.clip();

                            // Render each type.
                            var dYCursor = -m_dScrollOffset;
                            for (var i = 0; i < m_arrayTypes.length; i++) {

                                // Get the ith type.
                                var typeIth = m_arrayTypes[i];

                                // Render out the type.
                                exceptionRet = typeIth.render(m_contextRender,
                                    m_areaMaximal,
                                    dYCursor);

                                // Ask the parent how tall it is.
                                var dHeight = typeIth.getHeight();

                                // Move down.
                                dYCursor += dHeight;
                            }

                            // Render the scroll up region.
                            exceptionRet = m_areaScrollStubUp.generateRoundedRectPath(m_contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            m_contextRender.fillStyle = options.general.scrollStub.fillBackground;
                            m_contextRender.fill();
                            m_contextRender.strokeStyle = options.general.scrollStub.strokeBackground;
                            m_contextRender.stroke();

                            // Render the scroll down region.
                            exceptionRet = m_areaScrollStubDown.generateRoundedRectPath(m_contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            m_contextRender.fillStyle = options.general.scrollStub.fillBackground;
                            m_contextRender.fill();
                            m_contextRender.strokeStyle = options.general.scrollStub.strokeBackground;
                            m_contextRender.stroke();

                            // Restore original canvas state.
                            m_contextRender.restore();

                            // Continue the rendering.
                            m_iAnimationFrameSequence = requestAnimationFrame(m_functionRender);
                            
                            return null;
                        } catch (e) {
                            
                            alert(e.message);
                        }
                    };

                    ///////////////////////
                    // Private fields.

                    // Cookie for animation callback.
                    var m_iAnimationFrameSequence = 0;
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
                    // The whole area.
                    var m_areaMaximal = null;
                    // The area of the scroll up stub.
                    var m_areaScrollStubUp = null;
                    // The area of the scroll down stub.
                    var m_areaScrollStubDown = null;
                    // The collection of parents to render.
                    var m_arrayTypes = null;
                    // How far the tree is scrolled.
                    var m_dScrollOffset = 0;
                    // Type under cursor.
                    var m_typeCursor = null;
                    // Remember the last location of the mouse.
                    var m_pointCursor = null;
                    // Scrolling cookie, saved to kill scrolling.
                    var m_cookieScroll = null;
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
