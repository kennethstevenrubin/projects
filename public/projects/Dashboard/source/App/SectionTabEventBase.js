////////////////////////////////////////////
// Dreams And Goals section.

"use strict";

define(["App/SectionTabBase",
    "App/Flyout"],
    function (SectionTabBase,
        Flyout) {

        // Define Dreams & Goals Section constructor function.
        var functionRet = function SectionTabEventBase(optionsOverride) {

            var self = this;            // Uber-closure.

            // Inherit from base class.
            self.inherits(SectionTabBase, {

                }.inject(optionsOverride));

            /////////////////////////////////////////
            // Public events.

            // Define events raised by self component.
            self.onHorizontalDrag = null;
            self.onVerticalDrag = null;

            ///////////////////////////////////////////////////
            // Override methods.

            // Render out events.
            self.innerInnerInnerRender = function (contextRender) {

                try {

                    // Do not draw if collapsed.
                    if (self.isCollapsed()) {

                        return null;
                    }

                    // Reset the size and move region collections.
                    self.options.sizeLeftRegions = [];
                    self.options.sizeRightRegions = [];
                    self.options.moveRegions = [];

                    // Extract out rect.
                    var rectangleRender = self.options.rectangleSection;
                    self.options.lastRenderContext = contextRender;

                    // Set to know value.
                    contextRender.textBaseline = "center";
                    contextRender.textAlign = "start";

                    // Reset collection of active regions.
                    self.options.regions = [];

                    // Render all events.
                    var exceptionRet = null;
                    for (var i = 0; i < self.options.renderData.length; i++) {

                        // Get the ith event.
                        var eventIth = self.options.renderData[i];

                        // Possibly filter, if processing a foreground call.
                        if (contextRender.foreground === true) {

                            // Skip if the id is not in the related list.
                            var iEventId = eventIth.eventId;

                            if (self.options.title === "Dreams & Goals") {

                                if (contextRender.related.dreamsAndGoals.indexOf(iEventId) === -1) {

                                    continue;
                                }
                            } else {

                                if (contextRender.related.everydayLife.indexOf(iEventId) === -1) {

                                    continue;
                                }
                            }
                        }

                        // Get the left X.
                        var dLeft = self.getXFromDate(rectangleRender,
                            eventIth.startDate);

                        // Get the right X.
                        var dRight = self.getXFromDate(rectangleRender,
                            new Date(eventIth.startDate.getTime() + eventIth.msDuration));
                        var dWidth = dRight - dLeft;

                        // Get the height.
                        var dTop = self.getYFromIndex(rectangleRender,
                            self.options.renderData.length,
                            i,
                            true) + self.options.padding;
                        var dBottom = self.getYFromIndex(rectangleRender,
                            self.options.renderData.length,
                            i + 1,
                            true) - self.options.padding;
                        var dHeight = dBottom - dTop;

                        // Render the hash lines.
                        try {

                            contextRender.save();

                            contextRender.lineCap = 'round';
                            contextRender.strokeStyle = self.options.strokeStyle;
                            contextRender.beginPath();
                            contextRender.moveTo(dLeft,
                                dTop);
                            contextRender.lineTo(dLeft + dWidth,
                                dTop);
                            contextRender.lineTo(dLeft + dWidth,
                                dTop + dHeight);
                            contextRender.lineTo(dLeft,
                                dTop + dHeight);
                            contextRender.lineTo(dLeft,
                                dTop + dHeight);
                            contextRender.clip();

                            // Push onto move collection.
                            if (self.options.renderSplitterPlum) {

                                self.options.moveRegions.push({

                                    left: dLeft - 12,
                                    top: dTop,
                                    width: dWidth + 12,
                                    height: dHeight,
                                    event: eventIth
                                });
                            } else {

                                self.options.moveRegions.push({

                                    left: dLeft,
                                    top: dTop,
                                    width: dWidth,
                                    height: dHeight,
                                    event: eventIth
                                });
                            }

                            contextRender.beginPath();
                            contextRender.lineWidth = self.options.lineWidth;
                            var dX = dLeft - dHeight / 2;
                            while (dX <= dLeft + dWidth + dHeight / 2) {

                                contextRender.moveTo(dX,
                                    dTop + dHeight - 2);
                                contextRender.lineTo(dX + dHeight / 2,
                                    dTop + 2);

                                dX += self.options.hatchGap;
                            }

                            contextRender.stroke();
                        } finally {

                            contextRender.restore();
                        }

                        // Figure out how wide the title thumb is.
                        var strTitle = eventIth.name;

                        var sizeTitle = strTitle.size(self.options.eventFont);
                        var dTitleWidth = sizeTitle.width;
                        var dThumbWidth = dTitleWidth + self.options.endCapWidth + self.options.plumSpacerWidth;

                        // Calculate the distance from the left end to the left side of the region.
                        var dLeftDistance = dLeft - rectangleRender.left;

                        // Calculate the distance from the right end to the right side of the region.
                        var dRightDistance = (rectangleRender.left + rectangleRender.width) - (dLeft + dWidth);

                        // Configure render context.
                        contextRender.beginPath();
                        contextRender.fillStyle = self.options.endCapFillStyle;

                        // First, check if the event is totally to the left or right of the visible range.
                        if (dLeftDistance > rectangleRender.width) {

                            exceptionRet = self.renderOffToTheRight(contextRender,
                                rectangleRender,
                                eventIth,
                                dTop,
                                dLeft,
                                dRight,
                                dBottom,
                                dWidth,
                                dHeight,
                                strTitle,
                                sizeTitle);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        } else if (dRightDistance > rectangleRender.width ||
                            (dLeft <= rectangleRender.left && (dLeft + dWidth) >= (rectangleRender.left + rectangleRender.width))) {

                            exceptionRet = self.renderOffToTheLeft(contextRender,
                                rectangleRender,
                                eventIth,
                                dTop,
                                dLeft,
                                dRight,
                                dBottom,
                                dWidth,
                                dHeight,
                                strTitle,
                                sizeTitle,
                                (dLeft <= rectangleRender.left && (dLeft + dWidth) >= (rectangleRender.left + rectangleRender.width)));
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        } else if (dLeftDistance > 0 &&  // If there is enough room draw the title on the left.
                            (dThumbWidth < dLeftDistance ||
                            dLeftDistance > dRightDistance)) {

                            exceptionRet = self.renderLeft(contextRender,
                                rectangleRender,
                                eventIth,
                                dTop,
                                dLeft,
                                dRight,
                                dBottom,
                                dWidth,
                                dHeight,
                                strTitle,
                                sizeTitle,
                                dRightDistance);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        } else if (dRightDistance > 0) {

                            exceptionRet = self.renderRight(contextRender,
                                rectangleRender,
                                eventIth,
                                dTop,
                                dLeft,
                                dRight,
                                dBottom,
                                dWidth,
                                dHeight,
                                strTitle,
                                sizeTitle,
                                dLeftDistance);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Handle mouse event.
            self.innerMouseDown = function (e) {

                try {

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Handle mouse event.
            self.innerMouseUp = function (e) {

                try {

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Handle mouse event.
            self.innerMouseOut = function (e) {

                try {

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Handle mouse event.
            self.innerMouseMove = function (e) {

                try {

                    return null;
                } catch (e) {

                    return e;
                }
            };
        };

        // One-time Function.inherits injection.
        functionRet.inherits(SectionTabBase);

        // Return constructor.
        return functionRet;
    });
