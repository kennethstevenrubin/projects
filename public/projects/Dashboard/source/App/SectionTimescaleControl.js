////////////////////////////////////////////
// PlumPalette section.

"use strict";

define(["App/SectionBase"],
    function (SectionBase) {

        // Define construtor.
        var functionRet = function SectionTimescaleControl(optionsOverride) {

            var self = this;            // Uber-closure.

            // Inherit from SectionBase.
            self.inherits(SectionBase, {

            }.inject(optionsOverride));

            //////////////////////////////////////
            // Public events.

            // Invoked when the mouse button is let up after changing the thumb.
            self.onChange = null;

            ///////////////////////////////////////////////
            // Override methods.

            // Render out self specific data
            self.innerRender = function (contextRender) {

                try {

                    // Just return immediately if not visible.
                    if (self.options.timescaleControl.visible === false) {

                        return null;
                    }

                    var rectangle = self.options.rectangleSection;

                    // Store the context and rectangle for use later (in mouse handlers, perhaps).
                    self.options.rectangle = rectangle;
                    self.options.context = contextRender;

                    // Set text drawing alignment.
                    contextRender.textAlign = "start";

                    // Draw the time scale.

                    // Calculate where Start is.
                    var dStartX = rectangle.left + self.options.timescaleControl.paddingThumb;

                    // Calculate how much is left to the right of Start.
                    var dUseableWidth = (rectangle.left + rectangle.width - self.options.timescaleControl.paddingThumb) - dStartX;

                    // Calculate how many MS from Start to the end of the plan.
                    var dateNow = self.options.startDate;
                    dateNow = new Date(dateNow.getFullYear(), dateNow.getMonth(), dateNow.getDate());
                    var dateEndOfPlan = self.options.endDate();
                    var dMSNow = dateNow.getTime();
                    var dMSEndOfPlan = dateEndOfPlan.getTime();
                    var dMSToEnd = dMSEndOfPlan - dMSNow;

                    // Calculate the pixels per MS.
                    var dPixelsPerMS = dUseableWidth / dMSToEnd;

                    // Save in object state for use later in mouse handlers, et al.
                    self.options.pixelsPerMS = dPixelsPerMS;

                    // Calculate the X of the start of the current decade.
                    var dNowYear = dateNow.getFullYear();
                    var dStartOfDecadeYear = Math.floor(dNowYear / 10) * 10;
                    var dateStartOfDecade = new Date(dStartOfDecadeYear, 0, 1);
                    var dMSStartOfDecade = dateStartOfDecade.getTime();
                    var dMSFromStartOfDecadeToStart = dMSNow - dMSStartOfDecade;
                    var dPixelsFromStartOfDecadeToStart = dPixelsPerMS * dMSFromStartOfDecadeToStart;
                    var dStartOfTheDecadeX = dStartX - dPixelsFromStartOfDecadeToStart;

                    // Extract plan and info from plan.
                    var planCurrent = self.options.planCurrent;
                    var dateWindow = planCurrent.windowStart;
                    var msWindow = planCurrent.windowDuration;
                    var dMSWindowDate = dateWindow.getTime();

                    // Calculate the X of the start of the window.
                    var dWindowStartX = rectangle.left + self.options.timescaleControl.paddingThumb + dPixelsPerMS * (dMSWindowDate - dMSNow);
                    var dWindowEndX = dWindowStartX + dPixelsPerMS * msWindow;

                    // Loop over each year from Start's till the end of the plan's.
                    contextRender.strokeStyle = self.options.timescaleControl.strokeStyleScale;
                    contextRender.lineWidth = 0.5;
                    contextRender.beginPath();
                    var bFirstYear = true;
                    for (var dYear = dNowYear; dYear < self.options.endDate().getFullYear() + 1; dYear++) {

                        // Loop over each month.
                        for (var dMonth = (bFirstYear ? dateNow.getMonth() : 0) ; dMonth < 12; dMonth++) {

                            // Get the date here.
                            var dateHere = new Date(dYear, dMonth, 1);
                            var dMSHere = dateHere.getTime();

                            // Get the pixels from the start.
                            var dMSDelta = dMSHere - dMSNow;
                            var dPixelsFromStart = dMSDelta * dPixelsPerMS;

                            // Get the X here.
                            var dX = dStartX + dPixelsFromStart;

                            // Get the radius.
                            var dRadius = (dMonth === 0) ? self.options.timescaleControl.lengthScaleLong : self.options.timescaleControl.lengthScaleShort;

                            // Render the line.
                            contextRender.moveTo(dX,
                                rectangle.top + self.options.timescaleControl.centerScale - dRadius);
                            contextRender.lineTo(dX,
                                rectangle.top + self.options.timescaleControl.centerScale + dRadius);
                        }
                        bFirstYear = false;
                    }
                    contextRender.stroke();
                    contextRender.lineWidth = 1.0;

                    // Fill in every other decade just underneight the middle line.
                    var dDecadeScanYear = dStartOfDecadeYear + 10;
                    var bFill = true;
                    contextRender.font = self.options.timescaleControl.fontDecadeLabel;
                    while (dDecadeScanYear < self.options.endDate().getFullYear()) {

                        // Build the scan date.
                        var dateScanDecade = new Date(dDecadeScanYear, 0, 1);
                        var dMSScanDecade = dateScanDecade.getTime();

                        // Get the scan X.
                        var dMSDelta = dMSScanDecade - dMSStartOfDecade;
                        var dPixelsFromStart = dMSDelta * dPixelsPerMS;
                        var dXScan = dStartOfTheDecadeX + dPixelsFromStart;

                        // If self is the fill alternate, then fill it.
                        if (bFill) {

                            // Build the next date.
                            var dateNextDecade = new Date(dDecadeScanYear + 10, 0, 1);
                            if (dateNextDecade > dateEndOfPlan) {

                                dateNextDecade = dateEndOfPlan;
                            }
                            var dMSNextDecade = dateNextDecade.getTime();

                            // Get the next X.
                            dMSDelta = dMSNextDecade - dMSStartOfDecade;
                            dPixelsFromStart = dMSDelta * dPixelsPerMS;
                            var dXNext = dStartOfTheDecadeX + dPixelsFromStart;

                            contextRender.fillStyle = self.options.timescaleControl.fillStyleAlternateDecade;
                            contextRender.fillRect(dXScan,
                                rectangle.top + self.options.timescaleControl.paddingAlternateDecadeTop,
                                dXNext - dXScan,
                                self.options.timescaleControl.heightAlternateDecade);

                            bFill = false;
                        } else {

                            bFill = true;
                        }

                        // Draw the Decade text.
                        var strDecade = dDecadeScanYear.toString();
                        var dDecadeWidth = contextRender.measureText(strDecade).width;

                        contextRender.fillStyle = self.options.timescaleControl.fillStyleDecadeText;
                        contextRender.textBaseline = "top";
                        contextRender.fillText(strDecade,
                            dXScan - dDecadeWidth / 2,
                            rectangle.top + self.options.timescaleControl.paddingDecadeTextTop);

                        dDecadeScanYear += 10;
                    }

                    // Fill in every other year just above the middle line.
                    var dScanYear = dNowYear;
                    bFill = true;
                    contextRender.fillStyle = self.options.timescaleControl.fillStyleAlternateYear;
                    while (dScanYear < self.options.endDate().getFullYear()) {

                        if (bFill) {

                            // Build the two dates:
                            var dateScan = new Date(dScanYear, (dScanYear === dNowYear ? dateNow.getMonth() : 0), 1);
                            var dateNext = new Date(dScanYear + 1, 0, 1);
                            var dMSScan = dateScan.getTime();
                            var dMSNext = dateNext.getTime();

                            // Get the X here.
                            var dMSDelta = dMSScan - dMSNow;
                            var dPixelsFromStart = dMSDelta * dPixelsPerMS;
                            var dXScan = dStartX + dPixelsFromStart;
                            dMSDelta = dMSNext - dMSNow;
                            dPixelsFromStart = dMSDelta * dPixelsPerMS;
                            var dXNext = dStartX + dPixelsFromStart;

                            contextRender.fillRect(dXScan,
                                rectangle.top + self.options.timescaleControl.paddingAlternateYearTop,
                                dXNext - dXScan,
                                self.options.timescaleControl.heightAlternateYear);

                            bFill = false;
                        } else {

                            bFill = true;
                        }
                        dScanYear += 1;
                    }

                    // Render the connector bar.
                    contextRender.fillStyle = self.options.timescaleControl.thumbFill;
                    contextRender.strokeStyle = self.options.timescaleControl.thumbFill;
                    contextRender.strokeRect(dWindowStartX + m_options.boxGap,
                        rectangle.top + m_options.thumbY - m_options.thumbHeight / 2,
                        dWindowEndX - dWindowStartX - 2 * m_options.boxGap,
                        m_options.thumbHeight);

                    // Draw the thumbs.
                    var exceptionRet = m_functionGenerateLeftThumbPath(contextRender,
                        dWindowStartX - m_options.bezierGap,
                        rectangle.top + m_options.thumbY);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                    contextRender.fill();

                    exceptionRet = m_functionGenerateRightThumbPath(contextRender,
                        dWindowEndX + m_options.bezierGap,
                        rectangle.top + m_options.thumbY);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                    contextRender.fill();

                    // Render the strokes.
                    contextRender.lineWidth = 1;
                    contextRender.strokeStyle = self.options.timescaleControl.thumbStroke;
                    contextRender.beginPath();

                    contextRender.moveTo(dWindowStartX + m_options.stroke1X,
                        rectangle.top + m_options.thumbY - m_options.stroke1DY);
                    contextRender.lineTo(dWindowStartX + m_options.stroke1X,
                        rectangle.top + m_options.thumbY + m_options.stroke1DY);

                    contextRender.moveTo(dWindowStartX + m_options.stroke2X,
                        rectangle.top + m_options.thumbY - m_options.stroke2DY);
                    contextRender.lineTo(dWindowStartX + m_options.stroke2X,
                        rectangle.top + m_options.thumbY + m_options.stroke2DY);

                    contextRender.moveTo(dWindowStartX + m_options.stroke3X,
                        rectangle.top + m_options.thumbY - m_options.stroke3DY);
                    contextRender.lineTo(dWindowStartX + m_options.stroke3X,
                        rectangle.top + m_options.thumbY + m_options.stroke3DY);

                    contextRender.moveTo(dWindowEndX - m_options.stroke3X,
                        rectangle.top + m_options.thumbY - m_options.stroke3DY);
                    contextRender.lineTo(dWindowEndX - m_options.stroke3X,
                        rectangle.top + m_options.thumbY + m_options.stroke3DY);

                    contextRender.moveTo(dWindowEndX - m_options.stroke2X,
                        rectangle.top + m_options.thumbY - m_options.stroke2DY);
                    contextRender.lineTo(dWindowEndX - m_options.stroke2X,
                        rectangle.top + m_options.thumbY + m_options.stroke2DY);

                    contextRender.moveTo(dWindowEndX - m_options.stroke1X,
                        rectangle.top + m_options.thumbY - m_options.stroke1DY);
                    contextRender.lineTo(dWindowEndX - m_options.stroke1X,
                        rectangle.top + m_options.thumbY + m_options.stroke1DY);

                    contextRender.stroke();
                    contextRender.lineWidth = 1;

                    // Save the x's for use in the mouse handler.
                    self.options.windowStartX = dWindowStartX;
                    self.options.windowEndX = dWindowEndX;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Override mouse down to handle here.
            self.onMouseDown = function (e) {

                try {

                    // If not mouse in, then just return.
                    self.options.mouseDown = undefined;
                    if (self.options.mouseIn === undefined) {

                        return null;
                    }

                    // Set state.
                    self.options.mouseDown = self.options.mouseIn;
                    self.options.mouseIn = null;

                    // Save initial values.
                    self.options.initialWindowStartX = self.options.windowStartX;
                    self.options.initialWindowStartY = self.options.windowStartY;
                    self.initialX = e.offsetX;

                    var planCurrent = self.options.planCurrent;
                    self.initialWindowStart = planCurrent.windowStart;
                    self.initialWindowDuration = planCurrent.windowDuration;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Override mouse up to handle here.
            self.onMouseUp = function (e) {

                try {

                    return self.onMouseOut(e);
                } catch (e) {

                    return e;
                }
            };

            // Override mouse out to handle here.
            self.onMouseOut = function (e) {

                try {

                    var bWasDefined = (self.options.mouseDown !== undefined);

                    // Reset state.
                    self.options.mouseIn = undefined;
                    self.options.mouseDown = undefined;

                    // Raise event if dragging occured.
                    if (bWasDefined) {

                        if ($.isFunction(self.onChange)) {

                            self.onChange(self.options.planCurrent);
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Override mouse move to handle here.
            self.onMouseMove = function (e) {

                try {

                    var exceptionRet = null;

                    // Reset on move.
                    self.options.mouseIn = undefined;

                    // If down, then process move, else...
                    if (self.options.mouseDown === undefined) {

                        // Test Y against rect or drop out immediately.
                        if (e.offsetY < self.options.rectangle.top + 10  ||
                            e.offsetY > self.options.rectangle.top + 38) {

                            return null;
                        }

                        var planCurrent = self.options.planCurrent;

                        // Now, just need to check x for < start - 10, in start, in connector bar, in end, > end + 10:
                        if (e.offsetX < self.options.windowStartX) {

                        } else if (e.offsetX < self.options.windowStartX + m_options.thumbHeight) {

                            self.options.mouseIn = "start";

                            exceptionRet = self.options.dashboard.setCursor(self.options.timescaleControl.cursorMotile);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        } else if (e.offsetX < self.options.windowEndX - m_options.thumbHeight) {

                            self.options.mouseIn = "connectionbar";

                            if (planCurrent.windowDuration === planCurrent.msDuration) {

                                exceptionRet = self.options.dashboard.setCursor(self.options.timescaleControl.cursorSessile);
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            } else {

                                exceptionRet = self.options.dashboard.setCursor(self.options.timescaleControl.cursorMotile);
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            }
                        } else if (e.offsetX < self.options.windowEndX) {

                            self.options.mouseIn = "end";

                            exceptionRet = self.options.dashboard.setCursor(self.options.timescaleControl.cursorMotile);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }
                    } else {

                        // Update....
                        var dDX = e.offsetX - self.initialX;
                        var dDMS = dDX / self.options.pixelsPerMS;

                        var planCurrent = self.options.planCurrent;
                        var dateWindow = planCurrent.windowStart;
                        var msWindow = planCurrent.windowDuration;

                        // Set the cursor when dragging too.
                        if (planCurrent.windowDuration === planCurrent.msDuration) {

                            exceptionRet = self.options.dashboard.setCursor(self.options.timescaleControl.cursorSessile);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        } else {

                            exceptionRet = self.options.dashboard.setCursor(self.options.timescaleControl.cursorMotile);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }

                        // Handle moving various places on the control.
                        if (self.options.mouseDown === "start") {

                            planCurrent.windowStart = new Date(self.initialWindowStart.getTime() + dDMS);
                            planCurrent.windowDuration = self.initialWindowDuration - dDMS;
                            if (planCurrent.windowDuration < 10 * 1000 * 24 * 3600 * 365) {

                                var dDiff = 10 * 1000 * 24 * 3600 * 365 - planCurrent.windowDuration;
                                planCurrent.windowStart = new Date(planCurrent.windowStart.getTime() - dDiff);
                                planCurrent.windowDuration = 10 * 1000 * 24 * 3600 * 365;
                            }
                        } else if (self.options.mouseDown === "end") {

                            planCurrent.windowDuration = self.initialWindowDuration + dDMS;
                            if (planCurrent.windowDuration < 10 * 1000 * 24 * 3600 * 365) {

                                planCurrent.windowDuration = 10 * 1000 * 24 * 3600 * 365;
                            }
                        } else {

                            if (planCurrent.windowStart.getTime() + planCurrent.windowDuration < planCurrent.planStartDate.getTime() + planCurrent.msDuration ||
                                dDMS < 0) {

                                planCurrent.windowStart = new Date(self.initialWindowStart.getTime() + dDMS);
                            }
                        }

                        // Check bounds.
                        if (planCurrent.windowStart < planCurrent.planStartDate) {

                            planCurrent.windowStart = planCurrent.planStartDate;
                        }
                        if (planCurrent.windowStart.getTime() + planCurrent.windowDuration > planCurrent.planStartDate.getTime() + planCurrent.msDuration) {

                            planCurrent.windowDuration = planCurrent.planStartDate.getTime() + planCurrent.msDuration - planCurrent.windowStart.getTime();
                        }
                        if (planCurrent.windowDuration < 1000 * 24 * 3600 * 365) {

                            planCurrent.windowDuration = 1000 * 24 * 3600 * 365;
                        }

                        // Update stats.
                        exceptionRet = self.options.dashboard.updateDisplayedSegment(planCurrent);
                        if (exceptionRet !== null) {

                            return exceptionRet;
                        }

                        return self.options.dashboard.forceRender();
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ///////////////////////////////////////////////
            // Override properties

            // Return the height required by the section.
            self.getHeight = function () {

                // Just return 0 if invisible.
                if (self.isVisible() === false) {

                    return 0;
                }
                return self.options.timescaleControl.height;
            };

            // Return bool indicating visibility of Section.
            self.isVisible = function () {

                return self.options.timescaleControl.visible;
            };

            ///////////////////////////////////////////////
            // Private methods.

            // Draw right thumb.
            var m_functionGenerateLeftThumbPath = function (contextRender,
                dX,
                dY) {

                try {

                    var dHalfHeight = m_options.thumbHeight / 2;

                    contextRender.beginPath();
                    contextRender.moveTo(dX + 1.5 * dHalfHeight,
                        dY + dHalfHeight);
                    contextRender.bezierCurveTo(dX,
                        dY + dHalfHeight,
                        dX,
                        dY - dHalfHeight,
                        dX + 1.5 * dHalfHeight,
                        dY - dHalfHeight);
                    contextRender.lineTo(dX + m_options.thumbHeight + 1.5 * dHalfHeight,
                        dY - dHalfHeight);
                    contextRender.bezierCurveTo(dX + m_options.thumbHeight,
                        dY - dHalfHeight,
                        dX + m_options.thumbHeight,
                        dY + dHalfHeight,
                        dX + m_options.thumbHeight + 1.5 * dHalfHeight,
                        dY + dHalfHeight);
                    contextRender.lineTo(dX + 1.5 * dHalfHeight,
                        dY + dHalfHeight);

                    contextRender.closePath();

                    return null;
                } catch (e) {

                    return e;
                }
            }

            // Draw right thumb.
            var m_functionGenerateRightThumbPath = function (contextRender,
                dX,
                dY) {

                try {

                    var dHalfHeight = m_options.thumbHeight / 2;

                    contextRender.beginPath();
                    contextRender.moveTo(dX - 1.5 * dHalfHeight,
                        dY + dHalfHeight);
                    contextRender.bezierCurveTo(dX,
                        dY + dHalfHeight,
                        dX,
                        dY - dHalfHeight,
                        dX - 1.5 * dHalfHeight,
                        dY - dHalfHeight);
                    contextRender.lineTo(dX - m_options.thumbHeight - 1.5 * dHalfHeight,
                        dY - dHalfHeight);
                    contextRender.bezierCurveTo(dX - m_options.thumbHeight,
                        dY - dHalfHeight,
                        dX - m_options.thumbHeight,
                        dY + dHalfHeight,
                        dX - m_options.thumbHeight - 1.5 * dHalfHeight,
                        dY + dHalfHeight);
                    contextRender.lineTo(dX + 1.5 * dHalfHeight,
                        dY + dHalfHeight);

                    contextRender.closePath();

                    return null;
                } catch (e) {

                    return e;
                }
            }

            ///////////////////////////////////////////
            // Private fields.

            // Private options.
            var m_options = {

                stroke1X: 15,
                stroke1DY: 7,
                stroke2X: 20,
                stroke2DY: 8,
                stroke3X: 25,
                stroke3DY: 9,
                thumbHeight: 30,
                thumbY: 24,
                boxGap: 15,
                bezierGap: 4
            };
        };

        // One-time Function.inherits injections.
        functionRet.inherits(SectionBase);

        // Return constructor.
        return functionRet;
    });
