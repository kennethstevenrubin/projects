///////////////////////////////////////
// Draws scrollable plum bar.

"use strict";

define([],
    function () {

        // Define PlumScroll constructor function.
        var functionRet = function PlumScroll(optionsOverride) {
            
            var self = this;            // Uber-closure.

            ///////////////////////////////////////
            // Public methods.

            // Save object state, load up all the plum images and wire events.
            self.create = function (context,
                rectangle,
                dashboard) {

                try {

                    // Save object state.
                    m_options.canvas = context.canvas;
                    m_options.context = m_options.canvas.getContext("2d");
                    m_options.rectangle = rectangle;

                    // Load up all images, then continue after the last image is loaded.
                    if (m_objectImages === null) {

                        // Allocate the object which is the hash of URL to Image 
                        m_objectImages = {

                        };

                        // Allocate the new goal too.  It is not draggable, but looks like it is.
                        var img = new Image();

                        // Known source.
                        img.src = prefix + "media/NewGoal.png";

                        // Store in hash object.
                        m_objectImages["NewGoal"] = img;

                        // Loop over all the rest of the image urls.
                        for (var i = 0; i < m_arrayPlums.length; i++) {

                            // Get the ith url.
                            var strURL = m_arrayPlums[i];

                            // Allocate a new image.
                            img = new Image();
                            
                            // Set the call-back which is invoked when the image is down-loaded.
                            img.onload = m_functionImageOnLoad;

                            // Set the url--thi has the effect of causing 
                            // the browser to go out and download the image.
                            img.src = prefix + "media/" +
                                strURL +
                                ".png";

                            // Store image in hash.
                            m_objectImages[strURL] = img;
                        }

                        // Wire up mouse handing events.
                        $(m_options.canvas).mousemove(m_functionOnMouseMove);
                        $(m_options.canvas).mousedown(m_functionOnMouseDown);
                        $(m_options.canvas).mouseup(m_functionOnMouseUp);
                        $(m_options.canvas).mouseout(m_functionOnMouseOut);
                    }

                    // Indicate that self object is created.
                    m_options.create = true;

                    // Save....
                    m_options.dashboard = dashboard;

                    // Update display.
                    return m_functionRender();
                } catch (e) {

                    return e;
                }
            };

            // Draw a shaded plum of the specified type 
            // and location to the specified context.
            self.renderShadedPlum = function (context,
                dLeft,
                dTop,
                strURL,
                bPathOnly,
                bSelected) {

                try {

                    // Default path only to false.
                    if (bPathOnly === undefined) {

                        bPathOnly = false;
                    }

                    // Call down to private function to render the plum.
                    // Draw the plum bigger if it is a selected plum.
                    return m_functionRenderShadedPlum(context,
                        dLeft + (bSelected ? -m_options.offsetSelected : 0),
                        dTop + (bSelected ? -m_options.offsetSelected : 0),
                        m_options.widthShadedPlum + (bSelected ? 2 * m_options.offsetSelected : 0),
                        m_options.heightShadedPlum + (bSelected ? 2 * m_options.offsetSelected : 0),
                        strURL,
                        bPathOnly);
                } catch (e) {

                    return e;
                }
            };

            // Draw a plum of the specified type 
            // and location to the specified context
            // and clear out the near surroundings.
            self.renderGappedPlum = function (context,
                fillForeground,
                fillBackground,
                dCenterX,
                dCenterY,
                dRadius,
                dBackgroundGapWidth,
                bPathOnly,
                bSelected,
                bPlus) {

                try {

                    // Draw the background plum.
                    var exceptionRet = m_functionRenderPlum(context,
                        dCenterX - dRadius - dBackgroundGapWidth + (bSelected ? -m_options.offsetSelected : 0),
                        dCenterY - dRadius - dBackgroundGapWidth + (bSelected ? -m_options.offsetSelected : 0),
                        2 * (dRadius + dBackgroundGapWidth) + (bSelected ? 2 * m_options.offsetSelected : 0),
                        2 * (dRadius + dBackgroundGapWidth) + (bSelected ? 2 * m_options.offsetSelected : 0),
                        fillBackground,
                        2,
                        false,
                        bPathOnly);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Draw the foreground plum.
                    return m_functionRenderPlum(context,
                        dCenterX - dRadius + (bSelected ? -m_options.offsetSelected : 0),
                        dCenterY - dRadius + (bSelected ? -m_options.offsetSelected : 0),
                        2 * dRadius + (bSelected ? 2 * m_options.offsetSelected : 0),
                        2 * dRadius + (bSelected ? 2 * m_options.offsetSelected : 0),
                        fillForeground,
                        2,
                        bPlus,
                        bPathOnly);
                } catch (e) {

                    return e;
                }
            };

            // Public access to force the control to render itself.
            self.forceRender = function () {

                try {

                    // Update display.
                    return m_functionRender();
                } catch (e) {

                    return e;
                }
            };

            /* 20131007
            // Clear the plum mouse down data.
            self.clearPlumMouseDownData = function () {

                m_options.plumMouseDownData = null;

                return null;
            };

            // Set the plum mouse down data.
            self.setPlumMouseDownData = function (data) {

                m_options.plumMouseDownData = data;

                return null;
            };*/

            // Set the plum mouse down data.
            self.getMouseInData = function () {

                return m_options.mouseInData;
            };

            // Return bool.
            self.isPointInEastButton = function () {

                return m_options.pointInEastButton;
            };

            // Return bool.
            self.isPointInWestButton = function () {

                return m_options.pointInWestButton;
            };

            ///////////////////////////////////////
            // Private methods.

            // Render out the whole plum scroll.
            var m_functionRender = function (bRehideRelatedAfterRender) {

                try {

                    // Clear tooltip.
                    var exceptionRet = m_options.dashboard.hideTooltip();
                    if (exceptionRet !== null) {

                        return exceptionRet;
                    }

                    // Extract local state up front.
                    var context = m_options.context;
                    var rectangle = m_options.rectangle;

                    // Fill background.
                    context.fillStyle = m_options.fillBackground;
                    context.fillRect(rectangle.left,
                        rectangle.top,
                        rectangle.width,
                        rectangle.height);

                    if (rectangle.width < 0) {

                        return null;
                    }

                    // Calculate the various regions.
                    var dWestLeft = rectangle.left + m_options.padingPlum;
                    var dWestWidth = m_options.widthWestPlum;
                    m_options.westLeft = dWestLeft;

                    var dHalfNonBody = m_options.widthWestPlum + m_options.padingPlum + m_options.padingScrollRegion;
                    var dCenterLeft = dWestLeft + dWestWidth + m_options.padingScrollRegion;
                    var dCenterWidth = rectangle.width - 2 * (dHalfNonBody);

                    var dEastLeft = dCenterLeft + dCenterWidth + m_options.padingScrollRegion;
                    var dEastWidth = m_options.widthWestPlum;
                    m_options.eastLeft = dEastLeft;

                    // Render the west plum button.
                    var dTop = rectangle.top - m_options.plumTop;

                    // Move slighly down if mouse down.
                    if (m_options.mouseDownInWestButton) {

                        dTop += m_options.offsetDown;
                    }

                    // Render bigger if the mouse cursor is in the button.
                    var exceptionRet = null;
                    if (false && m_options.pointInWestButton === true) {

                        // Render selected west plum.
                        exceptionRet = m_functionRenderPlumWest(context,
                            dWestLeft - 3,
                            dTop + (rectangle.height - m_options.heightWestPlum) / 2 - 3,
                            m_options.widthWestPlum + 6,
                            m_options.heightWestPlum + 6,
                            "rgb(235,184,185)",
                            false);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    } else {

                        // Render normal west plum.
                        exceptionRet = m_functionRenderPlumWest(context,
                            dWestLeft,
                            dTop + (rectangle.height - m_options.heightWestPlum) / 2,
                            m_options.widthWestPlum,
                            m_options.heightWestPlum,
                            "rgb(235,184,185)",
                            false);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    }

                    // Render the east plum button.
                    dTop = rectangle.top - m_options.plumTop;

                    // Slightly lower if mouse downed.
                    if (m_options.mouseDownInEastButton) {

                        dTop += m_options.offsetDown;
                    }
                
                    // Render bigger if the mouse cursor is in the button.
                    if (false && m_options.pointInEastButton === true) {

                        // Render selected east plum.
                        exceptionRet = m_functionRenderPlumEast(context,
                            dEastLeft - 3,
                            dTop + (rectangle.height - m_options.heightWestPlum) / 2 - 3,
                            m_options.widthWestPlum + 6,
                            m_options.heightWestPlum + 6,
                            "rgb(235,184,185)",
                            false);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    } else {

                        // Render normal east plum.
                        m_functionRenderPlumEast(context,
                            dEastLeft,
                            dTop + (rectangle.height - m_options.heightWestPlum) / 2,
                            m_options.widthWestPlum,
                            m_options.heightWestPlum,
                            "rgb(235,184,185)",
                            false);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    }

                    // Save the state of the context before setting clipping 
                    // region so that restore can remove the clipping region.
                    context.save();

                    if (dCenterWidth < 0) {

                        return null;
                    }

                    // Set the clipping area so that boundary plums are hidden.
                    context.beginPath();
                    context.rect(dCenterLeft,
                        rectangle.top,
                        dCenterWidth,
                        rectangle.height);
                    context.clip();

                    // Render out the shaded plums.
                    var iIndex = m_options.firstIndex;
                    var dCursor = dEastLeft + m_options.scrollOffset;

                    // Assume mouse cursor is elsewhere.
                    m_options.mouseInData = null;

                    // Loop backwards from off the end of the 
                    // scroll region until before the beginning.
                    while (dCursor + m_options.widthShadedPlumSpace > dHalfNonBody) {

                        // Make sure the image index is within the valid range.
                        while (iIndex < 0) {

                            iIndex += m_arrayPlums.length;
                        }

                        // Output plum.
                        exceptionRet = m_functionRenderShadedPlum(context,
                            dCursor,
                            rectangle.top + 2,
                            m_options.widthShadedPlum,
                            m_options.heightShadedPlum,
                            m_arrayPlums[iIndex % m_arrayPlums.length]);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Test the mouse pointer against the plum just rendered.
                        if (m_options.mousePointerCoordinates !== undefined &&
                            m_options.mousePointerCoordinates !== null &&
                            m_options.mousePointerCoordinates.x >= dCenterLeft &&
                            m_options.mousePointerCoordinates.x < dCenterLeft + dCenterWidth &&
                            context.isPointInPath(m_options.mousePointerCoordinates.x,
                                m_options.mousePointerCoordinates.y)) {

                            // Re-draw bigger.
                            exceptionRet = m_functionRenderShadedPlum(context,
                                dCursor - 4,
                                rectangle.top + 4 - 4,
                                m_options.widthShadedPlum + 8,
                                m_options.heightShadedPlum + 8,
                                m_arrayPlums[iIndex % m_arrayPlums.length]);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            //  Tooltip.
                            // OK, display tooltip.
                            exceptionRet = m_options.dashboard.moveTooltip(m_options.mousePointerCoordinates.x + 10,
                                m_options.mousePointerCoordinates.y + 20);
                            if (exceptionRet !== null) {

                                return exceptionRet;
                            }

                            // Format tooltip.
                            var strValue = m_arrayPlums[iIndex % m_arrayPlums.length];
                            strValue = strValue.replace(/([a-z])([A-Z])/g, '$1 $2').
                                replace(/([A-Z])([A-Z])/g, '$1 $2').
                                replace(/1/, '').
                                replace(/2/, '');
                            exceptionRet = m_options.dashboard.setTooltip(strValue,
                                false);
                            if (exceptionRet !== null) {

                                return exceptionRet;
                            }

                            // Set the url under the mouse--but only if not in the scroll-buttons.
                            if (m_options.pointInEastButton === false &&
                                m_options.pointInWestButton === false) {

                                m_options.mouseInData = {

                                    left: dCursor - 4,
                                    top: rectangle.top + 4 - 4,
                                    width: m_options.widthShadedPlum + 8,
                                    height: m_options.heightShadedPlum + 8,
                                    url: m_arrayPlums[iIndex % m_arrayPlums.length]
                                };
                            }
                        }

                        // Move on to the next plum.
                        iIndex++;

                        // Re-position to the left.
                        dCursor -= m_options.widthShadedPlumSpace;
                    }

                    // Restore--self resets clipping region.
                    context.restore();

                    /* Render out the drag plum.
                    if (m_options.plumMouseDownData !== undefined &&
                        m_options.plumMouseDownData !== null &&
                        m_options.plumMouseDownData.dragPoint !== undefined &&
                        m_options.plumMouseDownData.dragPoint !== null) {

                        var dDX = m_options.plumMouseDownData.dragPoint.x -
                            m_options.plumMouseDownData.downPoint.x
                        var dDY = m_options.plumMouseDownData.dragPoint.y -
                            m_options.plumMouseDownData.downPoint.y

                        exceptionRet = self.renderShadedPlum(context,
                            m_options.plumMouseDownData.left + dDX,
                            m_options.plumMouseDownData.top + dDY,
                            m_options.plumMouseDownData.url,
                            false,
                            true);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    }*/

                    // Cover up if asked to draw while main dashboard is showing related.

                    if (context.related !== undefined &&
                        context.related !== null &&
                        bRehideRelatedAfterRender === true) {

                        // Fill background.
                        context.fillStyle = "rgba(0,0,0,0.5)";
                        context.fillRect(rectangle.left,
                            rectangle.top,
                            rectangle.width,
                            rectangle.height);
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render a normal plum with a shadow behind it.
            var m_functionRenderShadedPlum = function (context,
                dLeft,
                dTop,
                dWidth,
                dHeight,
                strURL,
                bPathOnly) {

                try {

                    // Default path only to false.
                    if (bPathOnly === undefined) {

                        bPathOnly = false;
                    }

                    // Switch based on url name, set color and 
                    // possibly an x offset to fix centering.
                    var dDeltaX = 0;
                    var dDeltaY = 0;
                    var strFillStyle = "rgb(146,72,99)";
                    if (strURL === "BuyACar") {

                        strFillStyle = "rgb(193,109,143)";
                    } else if (strURL === "BuyAHouse") {

                        dDeltaX = -3;
                        strFillStyle = "rgb(193,109,143)";
                    } else if (strURL === "CollegeEducation") {

                        strFillStyle = "rgb(193,109,143)";
                    } else if (strURL === "NewCareer") {

                        dDeltaX = -2;
                    } else if (strURL === "NewGoal") {

                        strFillStyle = "rgb(235,184,185)";
                    } else if (strURL === "StartABusiness") {

                        dDeltaX = 2;
                        strFillStyle = "rgb(193,109,143)";
                    } else if (strURL === "VolunteerMyTime") {

                        dDeltaX = -4;
                        strFillStyle = "rgb(193,109,143)";
                    }

                    // Don't draw shadows when just rendering the path.
                    if (bPathOnly === false) {

                        // Draw the shadow.
                        for (var i = 0; i < 6; i++) {

                            // Move the plum down and over and layer on an alpha'd shadow.
                            var exceptionRet = m_functionRenderPlum(context,
                                dLeft + i,
                                dTop + 2 + i / 5,
                                dWidth,
                                dHeight,
                                "rgba(0,0,0,0.1)");
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }
                    }

                    // Draw the plum.
                    var exceptionRet = m_functionRenderPlum(context,
                        dLeft,
                        dTop,
                        dWidth,
                        dHeight,
                        strFillStyle,
                        2,
                        false,
                        bPathOnly);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Only draw the center image if not path only.
                    if (bPathOnly === false) {

                        // Draw the image.
                        var img = m_objectImages[strURL];

                        // Draw centeredly.
                        context.drawImage(img,
                            dLeft + (dWidth - img.width) / 2 + dDeltaX,
                            dTop + (dHeight - img.height) / 2 + dDeltaY);
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render out a normal plum.
            var m_functionRenderPlum = function (context,
                dLeft,
                dTop,
                dWidth,
                dHeight,
                strFillStyle,
                dEndGap,
                bRenderPlus,
                bPathOnly) {

                try {

                    // Default end gap to 2.
                    if (dEndGap === undefined) {

                        dEndGap = 2;
                    }
                    if (bRenderPlus === undefined) {

                        bRenderPlus = false;
                    }
                    if (bPathOnly === undefined) {

                        bPathOnly = false;
                    }

                    // Generate the path
                    var exceptionRet = m_functionGeneratePlumPath(context,
                        dLeft + dWidth / 2,
                        dTop + dHeight / 2,
                        dWidth / 2.3,
                        0.04,
                        1.4,
                        0.6,
                        strFillStyle,
                        0,
                        false);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Unless just testing the path, draw the path and possibly a plus.
                    if (bPathOnly === undefined ||
                        bPathOnly === false) {

                        // Here, the path is actually rendered.
                        context.fill();

                        // Render out a plus, if specified.
                        if (bRenderPlus === true) {

                            // Thick lines.
                            context.lineWidth = 3;

                            // Render the plus.
                            context.strokeStyle = m_options.strokePlumPlus;
                            context.beginPath();
                            context.moveTo(dLeft + dWidth / 2,
                                dTop + dHeight / 4 - 1);
                            context.lineTo(dLeft + dWidth / 2,
                                dTop + 3 * dHeight / 4 - 1);
                            context.moveTo(dLeft + dWidth / 4,
                                dTop + dHeight / 2 - 1);
                            context.lineTo(dLeft + 3 * dWidth / 4,
                                dTop + dHeight / 2 - 1);
                            context.stroke();
                            context.lineWidth = 1;
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render out the plum which points to the west.
            var m_functionRenderPlumWest = function (context,
                dLeft,
                dTop,
                dWidth,
                dHeight,
                strFillStyle,
                bJustGenerateThePath) {

                try {

                    // Roatate into the frame.
                    context.save();
                    context.translate(dLeft + dWidth / 2,
                        dTop + dHeight / 2);
                    context.rotate(Math.PI / 2);
                    context.translate(-(dLeft + dWidth / 2),
                        -(dTop + dHeight / 2));

                    // Generate the path
                    var exceptionRet = m_functionGeneratePlumPath(context,
                        dLeft + dWidth / 2,
                        dTop + dHeight / 2,
                        dWidth / 2.3,
                        0.04,
                        1.4,
                        0.6,
                        strFillStyle,
                        false);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    if (bJustGenerateThePath === false) {

                        context.fill();

                        // Draw the arrow.
                        var dArrowWidth = 9;
                        var dArrowHeight = 13;
                        var dXBuffer = (dWidth - dArrowWidth) / 2 - 2;
                        var dYBuffer = (dHeight - dArrowHeight) / 2 + 4;
                        var exceptionRet = m_functionRenderTriangle(context,
                            dLeft + dXBuffer + 2, dTop + dYBuffer - 2, dArrowHeight, dArrowWidth, "rgba(0,0,0,0.25)", "South");
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                        exceptionRet = m_functionRenderTriangle(context,
                            dLeft + dXBuffer, dTop + dYBuffer, dArrowHeight, dArrowWidth, "#FFF", "South");
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                } finally {

                    context.restore();
                }
            };

            // Render out the plum which points to the east.
            var m_functionRenderPlumEast = function (context,
                dLeft,
                dTop,
                dWidth,
                dHeight,
                strFillStyle,
                bJustGenerateThePath) {

                try {

                    // Roatate into the frame.
                    context.save();
                    context.translate(dLeft + dWidth / 2,
                        dTop + dHeight / 2);
                    context.rotate(-Math.PI / 2);
                    context.translate(-(dLeft + dWidth / 2),
                        -(dTop + dHeight / 2));

                    // Generate the path
                    var exceptionRet = m_functionGeneratePlumPath(context,
                        dLeft + dWidth / 2,
                        dTop + dHeight / 2,
                        dWidth / 2.3,
                        0.04,
                        1.4,
                        0.6,
                        strFillStyle,
                        false);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Do not render the path and arrow if only asking for the region.
                    if (bJustGenerateThePath === false) {

                        context.fill();

                        // Draw the arrow.
                        var dArrowWidth = 9;
                        var dArrowHeight = 13;
                        var dXBuffer = (dWidth - dArrowWidth) / 2 - 2;
                        var dYBuffer = (dHeight - dArrowHeight) / 2 + 4;
                        var exceptionRet = m_functionRenderTriangle(context,
                            dLeft + dXBuffer - 2, dTop + dYBuffer + 2, dArrowHeight, dArrowWidth, "rgba(0,0,0,0.25)", "South");
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                        exceptionRet = m_functionRenderTriangle(context,
                            dLeft + dXBuffer, dTop + dYBuffer, dArrowHeight, dArrowWidth, "#FFF", "South");
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                } finally {

                    context.restore();
                }
            };

            // Render triange in the bounded rectange specified with the specified orientation.
            var m_functionRenderTriangle = function (context,
                dLeft,
                dTop,
                dWidth,
                dHeight,
                strFillStyle,
                strOrientation) {

                try {

                    // Set the fill style.
                    context.fillStyle = strFillStyle;

                    // Reset the default path.
                    context.beginPath();

                    // Switch based on orientation.
                    if (strOrientation === "North") {

                        // Draw the triangle.
                        context.moveTo(dLeft + dWidth / 2,
                            dTop);
                        context.lineTo(dLeft + dWidth,
                            dTop + dHeight);
                        context.lineTo(dLeft,
                            dTop + dHeight);
                    } else if (strOrientation === "South") {

                        // Draw the triangle.
                        context.moveTo(dLeft + dWidth / 2,
                            dTop + dHeight);
                        context.lineTo(dLeft + dWidth,
                            dTop);
                        context.lineTo(dLeft,
                            dTop);
                    } else if (strOrientation === "East") {

                        // Draw the triangle.
                        context.moveTo(dLeft,
                            dTop);
                        context.lineTo(dLeft,
                            dTop + dHeight);
                        context.lineTo(dLeft + dWidth,
                            dTop + dHeight / 2);
                    } else if (strOrientation === "West") {

                        // Draw the triangle.
                        context.moveTo(dLeft + dWidth,
                            dTop);
                        context.lineTo(dLeft + dWidth,
                            dTop + dHeight);
                        context.lineTo(dLeft,
                            dTop + dHeight / 2);
                    }

                    // Complete the triangle.
                    context.closePath();

                    // Render.
                    context.fill();

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Updates scroll offset and updates display.
            var m_functionScroll = function (dScroll) {

                try {

                    // Update scroll offset.  Note: dScroll may be positive or negative.
                    m_options.scrollOffset += dScroll;

                    // Ensure in good region.
                    while (m_options.scrollOffset > m_options.widthShadedPlumSpace) {

                        // Compensate.
                        m_options.scrollOffset -= m_options.widthShadedPlumSpace;

                        // Update the images to draw.
                        m_options.firstIndex++;
                    }

                    // Ensure in good region.
                    while (m_options.scrollOffset < 0) {

                        // Compensate
                        m_options.scrollOffset += m_options.widthShadedPlumSpace;

                        // Update images to draw.
                        m_options.firstIndex--;
                    }

                    // Update display.
                    return m_functionRender();
                } catch (e) {

                    return e;
                }
            };

            // Declare a function that just draws 
            // a part of the bulb of the plum shape.
            var functionRenderArc = function (dCenterX,
                dCenterY,
                dRadius,
                dControlSegmentMagnitude,
                context,
                i) {

                try {

                    // The arc is a bezier which stretches between to 
                    // spokes of a rotated cross.  "i" indicates the
                    // index number of the fist stave.  "i + 1" indicates
                    // the target index and represents the point rotated
                    // counter-clockwise of the next stave end-point.

                    // -Math.PI / 4 is the rotated cross stave.  
                    // Math.PI / 2 * i is the iterative component.
                    var dStartTheta = -Math.PI / 4 + (Math.PI / 2) * i;
                    var dStartPointX = dCenterX + Math.cos(dStartTheta) * dRadius;
                    var dStartPointY = dCenterY - Math.sin(dStartTheta) * dRadius;

                    // The first control segment starts at the start 
                    // point and angles Math.PI / 2 before extending.
                    var dControlSegment1Theta = dStartTheta + Math.PI / 2;
                    var dControlSegment1X = dStartPointX +
                        Math.cos(dControlSegment1Theta) * dControlSegmentMagnitude;
                    var dControlSegment1Y = dStartPointY -
                        Math.sin(dControlSegment1Theta) * dControlSegmentMagnitude;

                    // The end point is the next stave of the rotated cross.
                    var dEndTheta = dStartTheta + Math.PI / 2;
                    var dEndPointX = dCenterX + Math.cos(dEndTheta) * dRadius;
                    var dEndPointY = dCenterY - Math.sin(dEndTheta) * dRadius;

                    // The second control segment starts at the end
                    // point and angles -Math.PI / 2 before extending.
                    var dControlSegment2Theta = dEndTheta - Math.PI / 2;
                    var dControlSegment2X = dEndPointX +
                        Math.cos(dControlSegment2Theta) * dControlSegmentMagnitude;
                    var dControlSegment2Y = dEndPointY -
                        Math.sin(dControlSegment2Theta) * dControlSegmentMagnitude;

                    // Draw the curve described above.
                    context.bezierCurveTo(dControlSegment1X,
                        dControlSegment1Y,
                        dControlSegment2X,
                        dControlSegment2Y,
                        dEndPointX,
                        dEndPointY);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Function renders a plum to the specifies context.
            var m_functionGeneratePlumPath = function (context,
                dCenterX,
                dCenterY,
                dRadius,
                dHalfTipGap,
                dTipDrop,
                dControlSegmentMagnitude,
                strFillStyle,
                bFill) {

                try {

                    // Parameters are actually multipliers.
                    // Calculate out here.
                    dHalfTipGap *= dRadius;
                    dTipDrop *= dRadius;
                    dControlSegmentMagnitude *= dRadius;

                    // Set the color.
                    context.fillStyle = strFillStyle;

                    // Start the shape.
                    context.beginPath();

                    // Start at the right side of the base of the ice-cream cone.
                    context.moveTo(dCenterX + dHalfTipGap,
                        dCenterY + dTipDrop);

                    // Move up the right side to the beginning of the ice-cream.
                    var dStartPointX = dCenterX + Math.cos(-Math.PI / 4) * dRadius;
                    var dStartPointY = dCenterY - Math.sin(-Math.PI / 4) * dRadius;
                    context.lineTo(dStartPointX, dStartPointY);

                    // The ice-cream bulb is broken into 3 chunks.
                    // A cross is rotated Pi/4 radians.
                    // Then bezier curves connect the staves, 
                    // attached where the cone touches the ice.
                    var exceptionRet = functionRenderArc(dCenterX,
                        dCenterY,
                        dRadius,
                        dControlSegmentMagnitude,
                        context, 0);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                    exceptionRet = functionRenderArc(dCenterX,
                        dCenterY,
                        dRadius,
                        dControlSegmentMagnitude,
                        context, 1);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                    exceptionRet = functionRenderArc(dCenterX,
                        dCenterY,
                        dRadius,
                        dControlSegmentMagnitude,
                        context, 2);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Now move back down the left hand side of the cone.
                    context.lineTo(dCenterX - dHalfTipGap, dCenterY + dTipDrop);

                    // And close the path.
                    context.lineTo(dCenterX + dHalfTipGap, dCenterY + dTipDrop);

                    // Fill solid.
                    if (bFill) {

                        context.fill();
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ///////////////////////////////////////
            // Private event handlers.

            // Invoked when the image for a plum-type is loaded.
            // Implemented to force a render to update display.
            var m_functionImageOnLoad = function () {

                try {

                    // Render now that image is loaded.
                    var exceptionRet = m_functionRender();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            // Invoked when the mouse is moved over the render canvas.
            // Implemeneted to set the point in region object state.
            var m_functionOnMouseMove = function (e) {

                try {
                	
                	var exceptionRet = m_options.dashboard.possibleFirefoxAdjustment(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Assume the worst!
                    m_options.pointInWestButton = false;
                    m_options.pointInEastButton = false;

                    // Set where the mouse is--self is used later by some callbacks.
                    m_options.mousePointerCoordinates = {

                        x: e.offsetX,
                        y: e.offsetY
                    };

                    // Do nothing unless withing the confines of self controls render rectangle.
                    if (m_options.mousePointerCoordinates.x < m_options.rectangle.left ||
                        m_options.mousePointerCoordinates.y < m_options.rectangle.top ||
                        m_options.mousePointerCoordinates.x > m_options.rectangle.left + m_options.rectangle.width ||
                        m_options.mousePointerCoordinates.y > m_options.rectangle.top + m_options.rectangle.height) {

                        return;
                    }

                    // Generate the path for west button.
                    m_functionRenderPlumWest(m_options.context,
                        m_options.westLeft,
                        m_options.rectangle.top - 10 + (m_options.rectangle.height - m_options.heightWestPlum) / 2,
                        m_options.widthWestPlum,
                        m_options.heightWestPlum,
                        "rgba(0,0,0,1)",
                        true);                  // Indicate self is a path-only render.

                    // Set the options state to the result of calling point in path on the mouse coordinates.
                    m_options.pointInWestButton = m_options.context.isPointInPath(e.offsetX,
                        e.offsetY);

                    // Generate the path for east button.
                    m_functionRenderPlumEast(m_options.context,
                        m_options.eastLeft,
                        m_options.rectangle.top - 10 + (m_options.rectangle.height - m_options.heightWestPlum) / 2,
                        m_options.widthWestPlum,
                        m_options.heightWestPlum,
                        "rgba(0,0,0,1)",
                        true);                  // Indicate self is a path-only render.

                    // Again, set the options state to the result of calling point in path on the mouse coordinates.
                    m_options.pointInEastButton = m_options.context.isPointInPath(e.offsetX,
                        e.offsetY);

                    // Update display.
                    exceptionRet = m_functionRender(true);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            // Invoked when the mouse button is depressed over the render canvas.
            // Implemented to scroll the scroll bar and start a scrolling timer.
            var m_functionOnMouseDown = function (e) {

                try {

                	var exceptionRet = m_options.dashboard.possibleFirefoxAdjustment(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // If mouse cursor over west button.
                    if (m_options.pointInWestButton) {

                        // Scroll to the west immediately.
                        var exceptionRet = m_functionScroll(-10);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Stop any timer that may be running now.
                        if (m_options.timerCookie !== undefined) {

                            // Stop timer.
                            clearInterval(m_options.timerCookie);

                            // Clear object state.
                            delete m_options.timerCookie;
                        }

                        // Start the slow scroll timer.
                        m_options.timerCookie = setInterval(m_functionWestFirst,
                            500);

                        // Set some down state.
                        m_options.mouseDownInWestButton = true;
                    } else if (m_options.pointInEastButton) {    // If mouse cursor over west button.

                        // Scroll to the east immediately.
                        var exceptionRet = m_functionScroll(10);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Stop any timer that may be running now.
                        if (m_options.timerCookie !== undefined) {

                            // Stop timer.
                            clearInterval(m_options.timerCookie);

                            // Clear object state.
                            delete m_options.timerCookie;
                        }

                        // Start the slow scroll timer.
                        m_options.timerCookie = setInterval(m_functionEastFirst,
                            500);

                        // Set some down state.
                        m_options.mouseDownInEastButton = true;
                    }

                    // Update display.
                    exceptionRet = m_functionRender();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            // Invoked just after when the west plum is first depressed.
            // Implemented to start a new, faster timer to scroll.
            var m_functionWestFirst = function () {

                try {

                    // Stop the old (slow) timer.
                    if (m_options.timerCookie !== undefined) {

                        // Stop the timer.
                        clearInterval(m_options.timerCookie);

                        // Clear out object state.
                        delete m_options.timerCookie;
                    }

                    // Start up a (fast) timer now to update the scroll position.
                    m_options.timerCookie = setInterval(m_functionWestRepeat,
                        10);
                } catch (e) {

                    alert(e);
                }
            }

            // Invoked when the west plum is continually depressed.
            // Implemented to scroll the plums across the scroll-way.
            var m_functionWestRepeat = function () {

                try {

                    // Scroll to the west.
                    var exceptionRet = m_functionScroll(-1.5);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                } catch (e) {

                    alert(e);
                }
            }

            // Invoked just after when the east plum is first depressed.
            // Implemented to start a new, faster timer to scroll.
            var m_functionEastFirst = function () {

                try {

                    // Stop the old (slow) timer.
                    if (m_options.timerCookie !== undefined) {
                        
                        // Stop the timer.
                        clearInterval(m_options.timerCookie);

                        // Clear out object state.
                        delete m_options.timerCookie;
                    }

                    // Start up a (fast) timer now to update the scroll position.
                    m_options.timerCookie = setInterval(m_functionEastRepeat,
                        10);
                } catch (e) {

                    alert(e);
                }
            }

            // Invoked when the east plum is continually depressed.
            // Implemented to scroll the plums across the scroll-way.
            var m_functionEastRepeat = function () {

                try {

                    // Scroll to the east.
                    var exceptionRet = m_functionScroll(1.5);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                } catch (e) {

                    alert(e);
                }
            }

            // Invoked when the mouse is let up from the canvas.
            // Implemented to reset mouse state and redraw control.
            var m_functionOnMouseUp = function (e) {

                try {

                	var exceptionRet = m_options.dashboard.possibleFirefoxAdjustment(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Reset mouse state.
                    m_options.mouseDownInWestButton = false;
                    m_options.mouseDownInEastButton = false;

                    // Stop timer.
                    if (m_options.timerCookie !== undefined) {

                        // Stop timer.
                        clearInterval(m_options.timerCookie);

                        // Clear object state.
                        delete m_options.timerCookie;
                    }

                    // Redraw.
                    exceptionRet = m_functionRender();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            // Invoked when the mouse leaves the canvas.
            // Implemented to reset mouse states and stop 
            // update times and re-render the control.
            var m_functionOnMouseOut = function (e) {

                try {

                	var exceptionRet = m_options.dashboard.possibleFirefoxAdjustment(e);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // No more mouse in region.
                    m_options.mousePointerCoordinates = null;

                    // Reset mouse state.
                    m_options.mouseDownInWestButton = false;
                    m_options.mouseDownInEastButton = false;
                    m_options.pointInWestButton = false;
                    m_options.pointInEastButton = false;

                    // Stop any timer that may be going (e.g. the repeat scrolling timer).
                    if (m_options.timerCookie !== undefined) {

                        // Stop the timer.
                        clearInterval(m_options.timerCookie);

                        // Reset object state.
                        delete m_options.timerCookie;
                    }

                    // Draw out the scroll.
                    exceptionRet = m_functionRender();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            ///////////////////////////////////////
            // Public fields.

            // Object state defines parameters for behavior of object.
            var m_options = {

                padingPlum: 20,
                widthShadedPlum: 90,
                heightShadedPlum: 86,
                widthShadedPlumSpace: 74,
                widthWestPlum: 40,
                heightWestPlum: 40,
                padingScrollRegion: 5,
                scrollOffset: 40,
                firstIndex: 0,
                offsetSelected: 0,
                strokePlumPlus: "#444",
                fillBackground: "#444",
                plumTop: 10,
                offsetDown: 0,
                mouseInData: null
            };

            // Allow constructor parameters to override the 
            // options object to enhance / customize behavior.
            m_options.inject(optionsOverride);

            // Collection of each of the draggable plum types.
            var m_arrayPlums = ["BePhilanthropic",
                "BuyACar",
                "GetMarried",
                "CollegeEducation",
                "NewCareer",
                "BuyAHouse",
                "Retirement",
                "StartABusiness",
                "StartAFamily1",
                "VolunteerMyTime",
                "Vacation2"];
            // Object which holds named value pair url to images.
            var m_objectImages = null;
        };

        // Return function.
        return functionRet;
    });
