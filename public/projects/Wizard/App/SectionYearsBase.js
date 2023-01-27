////////////////////////////////////////////
// Years base class draws a year strip on the section.

"use strict";

define(["App/SectionBase"],
    function (SectionBase) {

        // Define years constructor function.
        var functionRet = function SectionYearsBase(optionsOverride) {

            var self = this;            // Uber-closure.

            // Inherit from SectionBase.
            self.inherits(SectionBase,
                optionsOverride);       // Pass constructor argument to base class.

            //////////////////////////////////////
            // Public methods.

            // Render years lines across the section.
            self.renderYearLines = function (contextRender,
                rectangleRender,
                dPaddingBody) {

                try {

                    // Set up the context.
                    contextRender.font = self.options.years.font;
                    contextRender.strokeStyle = self.options.grid.strokeStyleYearLines;

                    // Calculate how many MS from start to the end of the display.
                    var dateEnd = new Date(self.options.startDate.getTime() + self.options.displayWindowMS);
                    var dMSStartToEnd = dateEnd.getTime() - self.options.startDate.getTime();

                    var dUseableWidth = rectangleRender.width;

                    // Calculate the pixels per MS.
                    var dPixelsPerMS = dUseableWidth / dMSStartToEnd;

                    // Calculate the number of MS to the beginning of the start date's year.
                    var dMSNow = self.options.startDate.getTime();
                    var dateStartOfYear = new Date(self.options.startDate.getFullYear(), 0, 1);
                    var dMSStartOfYear = dateStartOfYear.getTime();
                    var dMSToStartOfYear = dMSNow - dMSStartOfYear;

                    // Calculate where the start of the year is in pixel space.
                    var dPixelsToStartOfYear = dPixelsPerMS * dMSToStartOfYear;

                    var dStartLeft = rectangleRender.left - dPixelsToStartOfYear;

                    // Draw the labels.
                    var iYear = self.options.startDate.getFullYear();
                    contextRender.beginPath();
                    while (iYear <= dateEnd.getFullYear() + 1) {

                        // Get the pixels over from the start.
                        var dateYear = new Date(iYear, 0, 1);
                        var dMSFromStartToYear = dateYear.getTime() - dMSStartOfYear;
                        var dPixels = dMSFromStartToYear * dPixelsPerMS;

                        var strYear = iYear.toString();

                        if (strYear[3] === "0") {

                            // Render out all so far.
                            contextRender.stroke();

                            // Set for highlight.
                            contextRender.strokeStyle = self.options.grid.strokeHighlight;
                            contextRender.lineWidth = 2;

                            // Render line.
                            contextRender.dashedLine(dStartLeft + dPixels,
                                rectangleRender.top + dPaddingBody,
                                dStartLeft + dPixels,
                                rectangleRender.top + rectangleRender.height,
                                4);

                            // Stoke path.
                            contextRender.stroke();

                            // Begin path.
                            contextRender.beginPath();

                            // Reset stroke color.
                            contextRender.lineWidth = 1;
                            contextRender.strokeStyle = self.options.grid.strokeStyleYearLines;
                        } else {

                            // Render out the year line.
                            contextRender.moveTo(dStartLeft + dPixels,
                                rectangleRender.top + dPaddingBody);
                            contextRender.lineTo(dStartLeft + dPixels,
                                rectangleRender.top + rectangleRender.height);
                        }

                        iYear++;
                    }
                    contextRender.stroke();

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////////////////////
            // Override methods.

            // Render years strip.
            self.innerRender = function (contextRender) {

                try {

                    // Return here if invisible.
                    if (self.isVisible() === false) {

                        return null;
                    }

                    var rectangle = self.options.rectangleSection;

                    // Only render years if not in foreground.
                    if (contextRender.foreground === undefined ||
                        contextRender.foreground === false) {

                        // Render the years strip.
                        if (self.showHeader()) {

                            var exceptionRet = m_functionRenderYears(contextRender,
                                rectangle,
                                self.getAntiPadding());
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }
                    }

                    // Call down to derived class.
                    return self.innerInnerRender(contextRender);
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////////////////////
            // Virtual methods.

            // Render for next level in hierarchy.
            self.innerInnerRender = function (contextRender) {

                return null;
            };

            //////////////////////////////////////
            // Public properties.

            // Return the duration in MS associated with the width, or span, in pixels.
            self.getDurationFromWidth = function (dWidth,
                dRectangleWidth) {

                // Return the total number of ms, multiplied by the percent 
                // of the total width represented by the specified width.
                return self.options.displayWindowMS * (dWidth / dRectangleWidth);
            }

            // Helper property returns the X-coordinate corresponding with the specified date.
            self.getXFromDate = function (rectangleRender,
                date) {

                // Calculate how many MS from start to the end of the display.
                var dateEnd = new Date(self.options.startDate.getTime() + self.options.displayWindowMS);
                var dMSStartToEnd = dateEnd.getTime() - self.options.startDate.getTime();

                var dUseableWidth = rectangleRender.width;

                // Calculate the pixels per MS.
                var dPixelsPerMS = dUseableWidth / dMSStartToEnd;

                var dMSStartToDate = date.getTime() - self.options.startDate.getTime();

                // Get pixels to date.
                return dMSStartToDate * dPixelsPerMS;
            };

            // Helper property returns the X-coordinate corresponding with the specified date.
            self.getDateFromX = function (rectangleRender,
                dX) {

                // Calculate how many MS from start to the end of the display.
                var dateEnd = new Date(self.options.startDate.getTime() + self.options.displayWindowMS);
                var dMSStartToEnd = dateEnd.getTime() - self.options.startDate.getTime();

                var dUseableWidth = rectangleRender.width;

                // Calculate the pixels per MS.
                var dPixelsPerMS = dUseableWidth / dMSStartToEnd;

                // calculate how may pixels from the left to the specified.
                var dPixels = dX - rectangleRender.left;

                // Calculate the ms from the start date to the ms at the x.
                var dMS = self.options.startDate.getTime() + dPixels / dPixelsPerMS;

                // Get pixels to date.
                return new Date(dMS);
            };

            ////////////////////////////////////////////
            // Virtual properties.

            // Return padding for years strip.
            self.getAntiPadding = function () {

                return 0;
            };

            // Return bool indicating visiblility of header.
            self.showHeader = function () {

                return false;
            };

            ////////////////////////////////////////////
            // Private methods.

            // Render years horizontally across the top of the section.
            var m_functionRenderYears = function (contextRender,
                rectangleRender,
                iAntiPadding) {

                try {

                    // Possibly fix up the input parameter.
                    if (iAntiPadding === undefined) {

                        iAntiPadding = 0;
                    }

                    // Set up the context.
                    contextRender.font = self.options.years.font;
                    contextRender.fillStyle = self.options.years.textFillStyle;
                    contextRender.strokeStyle = self.options.years.strokeDecadeLineTip;
                    contextRender.textBaseline = "top";
                    contextRender.textAlign = "center";

                    // Calculate how many MS from start to the end of the display.
                    var dateEnd = new Date(self.options.startDate.getTime() + self.options.displayWindowMS);
                    var dMSStartToEnd = dateEnd.getTime() - self.options.startDate.getTime();

                    var dUseableWidth = rectangleRender.width;

                    // Calculate the pixels per MS.
                    var dPixelsPerMS = dUseableWidth / dMSStartToEnd;

                    // Calculate the number of MS to the beginning of the start date's year.
                    var dMSNow = self.options.startDate.getTime();
                    var dateStartOfYear = new Date(self.options.startDate.getFullYear(), 0, 1);
                    var dMSStartOfYear = dateStartOfYear.getTime();
                    var dMSToStartOfYear = dMSNow - dMSStartOfYear;

                    // Calculate where the start of the year is in pixel space.
                    var dPixelsToStartOfYear = dPixelsPerMS * dMSToStartOfYear;

                    var dStartLeft = rectangleRender.left - dPixelsToStartOfYear;

                    // Calculate the distance between two years
                    var dateYear0 = new Date(self.options.startDate.getFullYear() + 1, 0, 1);
                    var dMSFromStartToYear0 = dateYear0.getTime() - dMSStartOfYear;
                    var dPixels0 = dMSFromStartToYear0 * dPixelsPerMS;
                    var dateYear1 = new Date(self.options.startDate.getFullYear() + 2, 0, 1);
                    var dMSFromStartToYear1 = dateYear1.getTime() - dMSStartOfYear;
                    var dPixels1 = dMSFromStartToYear1 * dPixelsPerMS;
                    var dPixelsPerYear = dPixels1 - dPixels0;

                    // Calculate how wide a year is:
                    var strTestYear = "2222";
                    var dPixelsForAYear = strTestYear.size(self.options.years.font).width + 10;
                    var iStep = 1;
                    while (dPixelsPerYear * iStep < dPixelsForAYear) {

                        iStep++;
                    }

                    // Draw the labels.
                    var iYear = self.options.startDate.getFullYear();
                    while (iYear <= dateEnd.getFullYear() + 1) {

                        // As a string.
                        var strYear = iYear.toString();

                        // Get the pixels over from the start.
                        var dateYear = new Date(iYear, 0, 1);
                        var dMSFromStartToYear = dateYear.getTime() - dMSStartOfYear;
                        var dPixels = dMSFromStartToYear * dPixelsPerMS;

                        // Render out the year label.
                        if (strYear[3] === "0") {

                            // If indicated, render out a small end-tip to the decade line.
                            contextRender.lineWidth = 2;
                            contextRender.beginPath();
                            if (self.options.years.showDecadeLineTip) {

                                contextRender.dashedLine(dStartLeft + dPixels,
                                    rectangleRender.top + 4,
                                    dStartLeft + dPixels,
                                    rectangleRender.top + self.options.years.decadeLineTopHeight,
                                    4);
                            } else {

                                if (self.options.years.showDecadeBehindYear) {

                                    contextRender.dashedLine(dStartLeft + dPixels,
                                        rectangleRender.top + 4,
                                        dStartLeft + dPixels,
                                        rectangleRender.top + self.options.years.paddingTop + 30,
                                        4);
                                }
                            }
                            contextRender.stroke();
                            contextRender.lineWidth = 1;

                            // Fill as decade.                            
                            contextRender.fillStyle = self.options.years.fillHighlight;
                            contextRender.fillText(strYear,
                                dStartLeft + dPixels,
                                rectangleRender.top + self.options.years.paddingTop - iAntiPadding);
                            contextRender.fillStyle = self.options.years.textFillStyle;
                        } else {

                            // Fill normally.
                            contextRender.fillText(strYear,
                                dStartLeft + dPixels,
                                rectangleRender.top + self.options.years.paddingTop - iAntiPadding);
                        }

                        iYear += iStep;
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };
        };

        // One time injection.
        functionRet.inherits(SectionBase);

        return functionRet;
    });
