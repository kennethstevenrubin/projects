///////////////////////////////////////
// CodeArea module.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["./prototypes",
    "./Area",
    "./Point",
    "./Size",
    "./Triangle",
    "./Method",
    "./options"],
    function (prototypes, Area, Point, Size, Triangle, Method, options) {

        try {

            // Constructor function.
        	var functionRet = function CodeArea() {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public methods.

                    // Attach instance to DOM and initialize state.
                    self.create = function (method) {

                        try {

                            // Can only create an uncreated instance.
                            if (m_bCreated) {

                                throw { message: "Instance already created!" };
                            }

                            // Stow parameter.
                            m_method = method;

                            // Get the parent references.
                            m_jqParent = $(options.host.selector);
                            if (m_jqParent.length === 0) {

                                throw { message: "Failed to select parent element: " + options.host.selector };
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

                            // Cancel mouse timer.
                            if (m_cookieMouseAnimation) {

                                clearInterval(m_cookieMouseAnimation);
                            }

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

                            // Possibly adjust offset for firefox.
                            var exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                            if (exceptionRet !== null) {

                                return exceptionRet;
                            }

                            // Possibly change the cursor.
                            var strCursor = null;

                            // Convert event to point.
                            var point = new Point(e.offsetX,
                                e.offsetY);

                            // Cancel mouse timer.
                            if (m_cookieMouseAnimation) {

                                clearInterval(m_cookieMouseAnimation);
                            }

                            // Test against known regions.
                            m_strMouseInRegion = null;
                            if (m_triangleParametersScrollUp.pointInTriangle(m_contextRender, 
                                    point)) {

                                m_strMouseInRegion = "ParametersScrollUp";
                                strCursor = "hand";
                            } else if (m_triangleParametersScrollDown.pointInTriangle(m_contextRender, 
                                    point)) {

                                m_strMouseInRegion = "ParametersScrollDown";
                                strCursor = "hand";
                            } else if (m_triangleStatementsScrollUp.pointInTriangle(m_contextRender, 
                                    point)) {

                                m_strMouseInRegion = "StatementsScrollUp";
                                strCursor = "hand";
                            } else if (m_triangleStatementsScrollDown.pointInTriangle(m_contextRender, 
                                    point)) {

                                m_strMouseInRegion = "StatementsScrollDown";
                                strCursor = "hand";
                            } else if (m_areaStatements.pointInArea(m_contextRender, 
                                    point)) {

                                m_strMouseInRegion = "Statements";
                                strCursor = "cross";
                            } else if (m_areaParameters.pointInArea(m_contextRender, 
                                    point)) {

                                m_strMouseInRegion = "Parameters";
                                strCursor = "cross";
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

                            // Cancel mouse timer.
                            if (m_cookieMouseAnimation) {

                                clearInterval(m_cookieMouseAnimation);
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };
               
                    // Invoked when the mouse is moved away from the canvas.
                    // Implemented to pass on to managed regions.
                    var m_functionMouseOut = function (e) {

                        try {

                            // Reset mouse timer on out.
                            if (m_cookieMouseAnimation) {

                                clearInterval(m_cookieMouseAnimation);
                            }
                            m_strMouseInRegion = null;
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when the mouse is pressed down over the canvas.
                    // Implemented to pass on to managed regions.
                    var m_functionMouseDown = function (e) {

                        try {

                            // Scroll the parameters section.
                            if (m_strMouseInRegion === "ParametersScrollUp" ) {

                                // Define a callback method which scrolls up.
                                var functionCallback = function () {

                                    if (m_dParametersScrollOffset > 0) {

                                        m_dParametersScrollOffset--;
                                    }
                                };

                                // Start the interval of scrolling at the specified delay.
                                m_cookieMouseAnimation = setInterval(functionCallback,
                                    options.mouseRepeatDelay);
                            } else if (m_strMouseInRegion === "ParametersScrollDown" ) {

                                // Define a callback method which scrolls up.
                                var functionCallback = function () {

                                    if (m_dParametersScrollOffset < (m_method.parameters.length * options.textHeight - m_areaParameters.extent.height)) {

                                        m_dParametersScrollOffset++;
                                    }
                                };

                                // Start the interval of scrolling at the specified delay.
                                m_cookieMouseAnimation = setInterval(functionCallback,
                                    options.mouseRepeatDelay);
                            }
                            // Scroll the statements section.
                            else if (m_strMouseInRegion === "StatementsScrollUp" ) {

                                // Define a callback method which scrolls up.
                                var functionCallback = function () {

                                    if (m_dStatementsScrollOffset > 0) {

                                        m_dStatementsScrollOffset--;
                                    }
                                };

                                // Start the interval of scrolling at the specified delay.
                                m_cookieMouseAnimation = setInterval(functionCallback,
                                    options.mouseRepeatDelay);
                            } else if (m_strMouseInRegion === "StatementsScrollDown" ) {

                                // Define a callback method which scrolls up.
                                var functionCallback = function () {

                                    if (m_dStatementsScrollOffset < (m_method.behavior.getHeight() - m_areaStatements.extent.height)) {

                                        m_dStatementsScrollOffset++;
                                    }
                                };

                                // Start the interval of scrolling at the specified delay.
                                m_cookieMouseAnimation = setInterval(functionCallback,
                                    options.mouseRepeatDelay);
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Invoked when the mouse wheel is scrolled over the canvas.
                    var m_functionMouseWheel = function (e) {

                        try {

                            // Scroll the parameters section.
                            if (m_strMouseInRegion === "Parameters" ) {

                                // Do nothing if nothing to scroll.
                                if (m_method.parameters.length * options.textHeight < m_areaParameters.extent.height) {

                                    return null;
                                }

                                // Calculate distance.
                                var dAmount = -e.deltaY * e.deltaFactor;

                                // Scroll up if negative, else, down.
                                if (dAmount < 0) {

                                    // Move it.
                                    if (m_dParametersScrollOffset > 0) {

                                        m_dParametersScrollOffset += dAmount;
                                    }
                                    // Pin to bounds.
                                    if (m_dParametersScrollOffset < 0) {

                                        m_dParametersScrollOffset = 0;
                                    }

                                } else {

                                    // Move it.
                                    if (m_dParametersScrollOffset < (m_method.parameters.length * options.textHeight - m_areaParameters.extent.height)) {

                                        m_dParametersScrollOffset += dAmount;
                                    }
                                    // Pin to bounds.
                                    if (m_dParametersScrollOffset > (m_method.parameters.length * options.textHeight - m_areaParameters.extent.height)) {

                                        m_dParametersScrollOffset = (m_method.parameters.length * options.textHeight - m_areaParameters.extent.height);
                                    }
                                }
                            }                            
                            // Scroll the statements section.
                            else if (m_strMouseInRegion === "Statements" ) {

                                // Do nothing if nothing to scroll.
                                if (m_method.behavior.getHeight() < m_areaStatements.extent.height) {

                                    return null;
                                }

                                // Calculate distance.
                                var dAmount = -e.deltaY * e.deltaFactor;

                                // Scroll up if negative, else, down.
                                if (dAmount < 0) {

                                    // Move it.
                                    if (m_dStatementsScrollOffset > 0) {

                                        m_dStatementsScrollOffset += dAmount;
                                    }
                                    // Pin to bounds.
                                    if (m_dStatementsScrollOffset < 0) {

                                        m_dStatementsScrollOffset = 0;
                                    }

                                } else {

                                    // Move it.
                                    if (m_dStatementsScrollOffset < (m_method.behavior.getHeight() - m_areaStatements.extent.height)) {

                                        m_dStatementsScrollOffset += dAmount;
                                    }
                                    // Pin to bounds.
                                    if (m_dStatementsScrollOffset > (m_method.behavior.getHeight() - m_areaStatements.extent.height)) {

                                        m_dStatementsScrollOffset = (m_method.behavior.getHeight() - m_areaStatements.extent.height);
                                    }
                                }
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

                                m_dWidth = options.defaultWidth;
                            }
                            m_dHeight = m_jqParent.height();
                            if (m_dHeight === undefined || 
                                m_dHeight === 0) {

                                m_dHeight = options.defaultHeight;
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

                            // Place all regions.

                            // Row 1: Name.
                            var dYCursor = options.borderPadding;
                            m_areaNameText = new Area(new Point(options.borderPadding, dYCursor), 
                                new Size(options.nameTextWidth, options.textHeight));
                            m_areaName = new Area(new Point(2 * options.borderPadding + options.nameTextWidth, options.borderPadding), 
                                new Size((m_dWidth - options.nameTextWidth) - 3 * options.borderPadding, options.textHeight));

                            // Row 2: Parameters.
                            dYCursor += (options.textHeight + options.borderPadding);
                            m_areaParametersOpen = new Area(new Point(options.borderPadding, dYCursor), 
                                new Size(options.parametersOpenTextWidth, options.textHeight));
                            m_areaParameters = new Area(new Point(2 * options.borderPadding + m_areaParametersOpen.extent.width, dYCursor), 
                                new Size(m_dWidth - 5 * options.borderPadding - m_areaParametersOpen.extent.width - options.parametersCloseTextWidth - options.scrollGlyphWidth, options.textHeight * options.parametersLines));
                            m_areaParametersClose = new Area(new Point(m_dWidth - (options.borderPadding + options.parametersCloseTextWidth), dYCursor + (options.parametersLines - 1) * options.textHeight), 
                                new Size(options.parametersCloseTextWidth, options.textHeight));
                            m_triangleParametersScrollUp = new Triangle(new Point(m_dWidth - (options.borderPadding + options.parametersCloseTextWidth) - (options.borderPadding + options.scrollGlyphWidth) + options.scrollGlyphWidth / 2, dYCursor), 
                                new Point(m_dWidth - (options.borderPadding + options.parametersCloseTextWidth) - (options.borderPadding + options.scrollGlyphWidth), dYCursor + options.scrollGlyphHeight), 
                                new Point(m_dWidth - (options.borderPadding + options.parametersCloseTextWidth) - (options.borderPadding + options.scrollGlyphWidth) + options.scrollGlyphWidth, dYCursor + options.scrollGlyphHeight));
                            m_triangleParametersScrollDown = new Triangle(new Point(m_dWidth - (options.borderPadding + options.parametersCloseTextWidth) - (options.borderPadding + options.scrollGlyphWidth) + options.scrollGlyphWidth / 2, dYCursor + options.parametersLines * options.textHeight), 
                                new Point(m_dWidth - (options.borderPadding + options.parametersCloseTextWidth) - (options.borderPadding + options.scrollGlyphWidth), dYCursor + options.parametersLines * options.textHeight - options.scrollGlyphHeight), 
                                new Point(m_dWidth - (options.borderPadding + options.parametersCloseTextWidth) - (options.borderPadding + options.scrollGlyphWidth) + options.scrollGlyphWidth, dYCursor + options.parametersLines * options.textHeight - options.scrollGlyphHeight));

                            // Row 3: Statements.
                            dYCursor += (options.parametersLines * options.textHeight + options.borderPadding);
                            m_areaStatementsOpen = new Area(new Point(options.borderPadding, dYCursor), 
                                new Size(options.statementsOpenTextWidth, options.textHeight));
                            m_areaStatements = new Area(new Point(2 * options.borderPadding + m_areaStatementsOpen.extent.width, dYCursor), 
                                new Size(m_dWidth - 5 * options.borderPadding - m_areaStatementsOpen.extent.width - options.statementsCloseTextWidth - options.scrollGlyphWidth, m_dHeight - options.borderPadding - dYCursor));
                            m_areaStatementsClose = new Area(new Point(m_dWidth - (options.borderPadding + options.statementsCloseTextWidth), m_dHeight - options.borderPadding - options.textHeight), 
                                new Size(options.statementsCloseTextWidth, options.textHeight));
                            m_triangleStatementsScrollUp = new Triangle(new Point(m_dWidth - (options.borderPadding + options.parametersCloseTextWidth) - (options.borderPadding + options.scrollGlyphWidth) + options.scrollGlyphWidth / 2, dYCursor), 
                                new Point(m_dWidth - (options.borderPadding + options.parametersCloseTextWidth) - (options.borderPadding + options.scrollGlyphWidth), dYCursor + options.scrollGlyphHeight), 
                                new Point(m_dWidth - (options.borderPadding + options.parametersCloseTextWidth) - (options.borderPadding + options.scrollGlyphWidth) + options.scrollGlyphWidth, dYCursor + options.scrollGlyphHeight));
                            m_triangleStatementsScrollDown = new Triangle(new Point(m_dWidth - (options.borderPadding + options.parametersCloseTextWidth) - (options.borderPadding + options.scrollGlyphWidth) + options.scrollGlyphWidth / 2, m_dHeight - options.borderPadding), 
                                new Point(m_dWidth - (options.borderPadding + options.parametersCloseTextWidth) - (options.borderPadding + options.scrollGlyphWidth), m_dHeight - options.borderPadding - options.scrollGlyphHeight), 
                                new Point(m_dWidth - (options.borderPadding + options.parametersCloseTextWidth) - (options.borderPadding + options.scrollGlyphWidth) + options.scrollGlyphWidth, m_dHeight - options.borderPadding - options.scrollGlyphHeight));

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

                            // Render body.
                            exceptionRet = m_functionRenderBackground(iMS);
                            if (exceptionRet !== null) {
                                
                                throw exceptionRet;
                            }

                            // Render block.
                            exceptionRet = m_functionRenderMethod(iMS);
                            if (exceptionRet !== null) {
                                
                                throw exceptionRet;
                            }

                            // Continue the rendering.
                            m_iAnimationFrameSequence = requestAnimationFrame(m_functionRender);
                            
                            return null;
                        } catch (e) {
                            
                            alert(e.message);
                        }
                    };

                    // Render out the background area.
                    var m_functionRenderBackground = function (iMS) {
                        
                        try {

                            // Clear background.
                            m_contextRender.clearRect(m_areaMaximal.location.x,
                                m_areaMaximal.location.y,
                                m_areaMaximal.extent.width,
                                m_areaMaximal.extent.height);

                            // Draw the rounded body background.
                            var exceptionRet = m_areaMaximal.generateRoundedRectPath(m_contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            m_contextRender.fillStyle = options.backgroundFill;
                            m_contextRender.fill();

                            return null;
                        } catch (e) {
                            
                            return e;
                        }
                    };

                    // Render out the blocks.
                    var m_functionRenderMethod = function (iMS) {
                        
                        try {

                            // Row 1: The Name.
                            // Draw the name text.
                            m_contextRender.fillStyle = options.textFill;
                            m_contextRender.font = options.textFont;
                            m_contextRender.fillText("Name",
                                m_areaNameText.location.x,
                                m_areaNameText.location.y,
                                m_areaNameText.extent.width);

                            // Draw the name.
                            var exceptionRet = m_areaName.generateRoundedRectPath(m_contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            m_contextRender.fillStyle = options.nameFill;
                            m_contextRender.fill();
                            m_contextRender.strokeStyle = options.nameStroke;
                            m_contextRender.stroke();

                            // Draw the actual method name.
                            m_contextRender.save();
                            m_contextRender.clip();
                                m_contextRender.fillStyle = options.textDataFill;
                                m_contextRender.font = options.textDataFont;
                                m_contextRender.fillText(m_method.name,
                                    m_areaName.location.x + options.textDataBorder.width,
                                    m_areaName.location.y + options.textDataBorder.height,
                                    m_areaName.extent.width);
                            m_contextRender.restore();

                            // Row 2: The Parameters.
                            // Draw the opening parameter glyph.
                            m_contextRender.fillStyle = options.textFill;
                            m_contextRender.font = options.textFont;
                            m_contextRender.fillText("(",
                                m_areaParametersOpen.location.x,
                                m_areaParametersOpen.location.y,
                                m_areaParametersOpen.extent.width);

                            // Draw the parameters area.
                            var exceptionRet = m_areaParameters.generateRoundedRectPath(m_contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            m_contextRender.fillStyle = options.parametersFill;
                            m_contextRender.fill();
                            m_contextRender.strokeStyle = options.parametersStroke;
                            m_contextRender.stroke();

                            // Draw the actual parameters.
                            m_contextRender.save();
                            m_contextRender.clip();
                                m_contextRender.fillStyle = options.textDataFill;
                                m_contextRender.font = options.textDataFont;

                                for (var i = 0; i < m_method.parameters.length; i++) {

                                    // Get the parameter.
                                    var strParameter = m_method.parameters[i];
                                    m_contextRender.fillText(strParameter,
                                        m_areaParameters.location.x + options.textDataBorder.width,
                                        m_areaParameters.location.y + options.textHeight * i + options.textDataBorder.height - m_dParametersScrollOffset,
                                        m_areaParameters.extent.width);
                                }
                            m_contextRender.restore();

                            // Draw the closing parameter glyph.
                            m_contextRender.fillStyle = options.textFill;
                            m_contextRender.font = options.textFont;
                            m_contextRender.fillText(")",
                                m_areaParametersClose.location.x,
                                m_areaParametersClose.location.y,
                                m_areaParametersClose.extent.width);

                            // Draw the parameters scroll up glyph.
                            var exceptionRet = m_triangleParametersScrollUp.generateTriangularPath(m_contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            m_contextRender.fillStyle = options.scrollGlyphFill;
                            m_contextRender.fill();
                            m_contextRender.strokeStyle = options.scrollGlyphStroke;
                            m_contextRender.stroke();

                            // Draw the parameters scroll down glyph.
                            var exceptionRet = m_triangleParametersScrollDown.generateTriangularPath(m_contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            m_contextRender.fillStyle = options.scrollGlyphFill;
                            m_contextRender.fill();
                            m_contextRender.strokeStyle = options.scrollGlyphStroke;
                            m_contextRender.stroke();

                            // Row 3: The Statements.
                            // Draw the opening statement glyph.
                            m_contextRender.fillStyle = options.textFill;
                            m_contextRender.font = options.textFont;
                            m_contextRender.fillText("{",
                                m_areaStatementsOpen.location.x,
                                m_areaStatementsOpen.location.y,
                                m_areaStatementsOpen.extent.width);

                            // Draw the statements area.
                            var exceptionRet = m_areaStatements.generateRoundedRectPath(m_contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            m_contextRender.fillStyle = options.statementsFill;
                            m_contextRender.fill();
                            m_contextRender.strokeStyle = options.statementsStroke;
                            m_contextRender.stroke();

                            // Draw the actual statements block or statement detail.
                            m_contextRender.save();
                            m_contextRender.clip();

                                // Render the display object, be it a block or a statement.
                                exceptionRet = m_method.behavior.render(iMS,
                                    m_contextRender,
                                    m_areaStatements,
                                    m_dStatementsScrollOffset);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }
                            m_contextRender.restore();

                            // Draw the closing staetment glyph.
                            m_contextRender.fillStyle = options.textFill;
                            m_contextRender.font = options.textFont;
                            m_contextRender.fillText("}",
                                m_areaStatementsClose.location.x,
                                m_areaStatementsClose.location.y,
                                m_areaStatementsClose.extent.width);

                            // Draw the statements scroll up glyph.
                            var exceptionRet = m_triangleStatementsScrollUp.generateTriangularPath(m_contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            m_contextRender.fillStyle = options.scrollGlyphFill;
                            m_contextRender.fill();
                            m_contextRender.strokeStyle = options.scrollGlyphStroke;
                            m_contextRender.stroke();

                            // Draw the statements scroll down glyph.
                            var exceptionRet = m_triangleStatementsScrollDown.generateTriangularPath(m_contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            m_contextRender.fillStyle = options.scrollGlyphFill;
                            m_contextRender.fill();
                            m_contextRender.strokeStyle = options.scrollGlyphStroke;
                            m_contextRender.stroke();

                            return null;
                        } catch (e) {
                            
                            return e;
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
                    // Method to render.
                    var m_method = null;
                    // The whole area.
                    var m_areaMaximal = null;
                    // Location to render name.
                    var m_areaName = null;
                    // Location to render name text.
                    var m_areaNameText = null;
                    // Location to render Parameters open.
                    var m_areaParametersOpen = null;
                    // Location to render Parameters close.
                    var m_areaParametersClose = null;
                    // Location to render Parameters scroll up.
                    var m_triangleParametersScrollUp = null;
                    // Location to render Parameters scroll down.
                    var m_triangleParametersScrollDown = null;
                    // Location to render Parameters.
                    var m_areaParameters = null;
                    // Location to render Statements open.
                    var m_areaStatementsOpen = null;
                    // Location to render Statements close.
                    var m_areaStatementsClose = null;
                    // Location to render Statements scroll up.
                    var m_triangleStatementsScrollUp = null;
                    // Location to render Statements scroll down.
                    var m_triangleStatementsScrollDown = null;
                    // Location to render Statements.
                    var m_areaStatements = null;
                    // If non-null, indicates the region over 
                    // which the mouse pointer is located.
                    var m_strMouseInRegion = null;
                    // Keep track of how far the parameters have been scrolled.
                    var m_dParametersScrollOffset = 0;
                    // Cookie allows mouse animations to be cancelled.
                    var m_cookieMouseAnimation = null;
                    // Keep track of how far the statements have been scrolled.
                    var m_dStatementsScrollOffset = 0;
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });

                            /*m_jqCanvas.bind("keydown",
                                m_functionKeyDown);
                            m_jqCanvas.bind("keypress",
                                m_functionKeyPress);
                            m_jqCanvas.bind("keyup",
                                m_functionKeyUp);

                            m_jqCanvas.unbind("keydown",
                                m_functionOnKeyDown);
                            m_jqCanvas.unbind("keypress",
                                m_functionOnKeyPress);
                            m_jqCanvas.unbind("keyup",
                                m_functionOnKeyUp);

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
                    };*/
               

