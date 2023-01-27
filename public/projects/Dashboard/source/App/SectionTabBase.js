////////////////////////////////////////////
// Tab section base class draws and acts like a tab.

"use strict";

define(["App/SectionYearsBase",
    "App/Flyout"],
    function (SectionYearsBase,
        Flyout) {

        // Constructor function for another intermediate base class.
        var functionRet = function SectionTabBase(optionsOverride) {

            var self = this;            // Uber-closure.

            // Inherit from SectionsYearsBase.
            self.inherits(SectionYearsBase, {

            }.inject(optionsOverride));

            //////////////////////////////////////
            // Public events.

            // Invoked when the add plum "button" is clicked.
            self.onNewGoalClick = null;

            //////////////////////////////////////
            // Public properties.

            // Helper property returns the Y-coordinate correspinding with the specified index.
            self.getYFromIndex = function (rectangleRender,
                iNumberOfItems,
                i,
                bTop) {

                // Get the text height.
                var dBodyTop = self.options.background.tabHeight + self.options.background.tabPadding;

                // Body starts at top if not showing headers.
                if (self.showHeader() === false) {

                    dBodyTop = 0;
                }

                var dBodyHeight = rectangleRender.height - dBodyTop;

                var dUseHeight = dBodyHeight - 2 * self.options.grid.padding;

                var dHeightPerLine = dUseHeight / iNumberOfItems;
                var dStartHeight = dHeightPerLine / 2 + self.options.grid.padding;

                return rectangleRender.top + dBodyTop + dStartHeight + i * dHeightPerLine - (bTop ? dHeightPerLine / 2 : 0);
            };

            //////////////////////////////////////
            // Override methods.

            // Render out self specific data
            self.innerInnerRender = function (contextRender) {

                try {

                    // Return here if invisible.
                    if (self.isVisible() === false) {

                        return null;
                    }

                    // Save object state for asynchronous render calls.
                    m_options.context = contextRender;

                    // Extract out alias for easier access in this function.
                    var rectangle = self.options.rectangleSection;

                    // Only render guts if not foreground.
                    if (contextRender.foreground === undefined ||
                        contextRender.foreground === false) {

                        // Render tab and tab page.
                        var exceptionRet = m_functionRenderBackground(contextRender,
                            rectangle);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Render the title in the tab and the collapsed glyph.
                        if (self.showHeader() &&
                            self.showHeaderName()) {	// Jerry

                            exceptionRet = m_functionRenderTitle(contextRender,
                                rectangle);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }

                        // If not collapsed, draw the grid lines.
                        if (self.isCollapsed() === false) {

                            exceptionRet = m_functionRenderGridLines(contextRender,
                                rectangle,
                                self.options.renderData.length,
                                self.options.numberOfYears);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }
                    }

                    return self.innerInnerInnerRender(contextRender);
                } catch (e) {

                    return e;
                }
            };

            // Set object state.
            self.onMouseDown = function (e) {

                try {

                    // Check for draggability.

                    // Assume no draggable down point.
                    self.options.downPoint = null;

                    // If cusror in sizing right.
                    if (self.options.mouseInSizeRight) {

                        // Hide the flyout at the start of a drag operation.
                        var exceptionRet = m_functionCleanUpFlyout();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Save the initial duration for relative computation in the move.
                        self.options.initialDuration = self.options.mouseInSizeRightEvent.msDuration;

                        // Save the initial down point, again, for relative computation.
                        self.options.downPoint = {

                            x: e.offsetX,
                            y: e.offsetY
                        };

                        // Save off the event currently inside.
                        self.options.downEvent = self.options.mouseInSizeRightEvent;

                        // Indicate that sizing right is ocurring.
                        self.options.sizingRight = true;
                    } else if (self.options.mouseInSizeLeft) {

                        // Hide the flyout at the start of a drag operation.
                        var exceptionRet = m_functionCleanUpFlyout();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Save the initial start date and duration for relative computation in the move.
                        self.options.initialStartDate = self.options.mouseInSizeLeftEvent.startDate;
                        self.options.initialDuration = self.options.mouseInSizeLeftEvent.msDuration;

                        // Save the initial down point, again, for relative computation.
                        self.options.downPoint = {

                            x: e.offsetX,
                            y: e.offsetY
                        };

                        // Save off the event currently inside.
                        self.options.downEvent = self.options.mouseInSizeLeftEvent;

                        // Indicate that sizing left is ocurring.
                        self.options.sizingLeft = true;
                    } else if (self.options.mouseInMove) {

                        // Hide the flyout at the start of a drag operation.
                        var exceptionRet = m_functionCleanUpFlyout();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Save the initial start date for relative computation in the move.
                        self.options.initialStartDate = self.options.mouseInMoveEvent.startDate;

                        // Save the initial down point, again, for relative computation.
                        self.options.downPoint = {

                            x: e.offsetX,
                            y: e.offsetY
                        };

                        // Save off the event currently inside.
                        self.options.downEvent = self.options.mouseInMoveEvent;
                        self.options.downEvent.saveStartDate = self.options.downEvent.startDate;

                        // Indicate that moving is ocurring.
                        self.options.moving = true;
                    }

                    // If mouse in region on the down, then one step closer.
                    self.options.mouseDownRegion = null;
                    if (self.options.mouseInRegion !== undefined &&
                        self.options.mouseInRegion !== null) {

                        // Save over the region.
                        self.options.mouseDownRegion = self.options.mouseInRegion;

                        // Reset the in state, as it has been upgraded.
                        self.options.mouseInRegion = null;
                    }

                    return self.innerMouseDown(e);
                } catch (e) {

                    return e;
                }
            };

            // Handle mouse up to track the mouse clicks.
            self.onMouseUp = function (e) {

                try {

                    // Check if should raise vertical event.
                    // Set if from index is invalid.
                    if (self.options.downEventFromIndex !== undefined &&
                        self.options.downEventFromIndex !== -1) {

                        // Raise event, if attached.
                        if ($.isFunction(self.onVerticalDrag)) {

                            self.onVerticalDrag(self.options.downEvent,
                                self.options.downEventFromIndex,
                                self.options.downEventToIndex);
                        }

                        // Reset switch.
                        self.options.downEventFromIndex = -1;
                        self.options.downEventToIndex = -1;
                    }

                    // Reset state.
                    m_options.mouseDown = false;

                    // Hide the flyout at the start of a drag operation.
                    var exceptionRet = m_functionCleanUpFlyout();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Raise the event, if sizing, or moving.
                    if (self.options.sizingRight) {

                        self.options.sizingRight = false;
                        if ($.isFunction(self.onHorizontalDrag)) {

                            self.onHorizontalDrag(self.options.downEvent);
                        }
                    } else if (self.options.sizingLeft) {

                        self.options.sizingLeft = false;
                        if ($.isFunction(self.onHorizontalDrag)) {

                            self.onHorizontalDrag(self.options.downEvent);
                        }
                    } else if (self.options.moving) {

                        self.options.moving = false;
                        if ($.isFunction(self.onHorizontalDrag) &&
                            self.options.downEvent.startDate.getTime() !== self.options.downEvent.saveStartDate.getTime()) {

                            self.onHorizontalDrag(self.options.downEvent);
                        }
                    }

                    // If mouse in region
                    self.options.mouseUpRegion = null;
                    self.options.mouseInRegion = null;
                    self.options.downPoint = null;
                    self.options.sizingRight = null;
                    self.options.sizingLeft = null;
                    self.options.moving = null;
                    self.options.downEvent = null;

                    if (self.options.mouseDownRegion !== undefined &&
                        self.options.mouseDownRegion !== null) {

                        self.options.mouseUpRegion = self.options.mouseDownRegion;
                        self.options.mouseDownRegion = null;
                    }

                    return self.innerMouseUp(e);
                } catch (e) {

                    return e;
                }
            };

            // Clear state.
            self.onMouseOut = function (e) {

                try {

                    // Try going the mouse up route first....
                    self.onMouseUp(e);

                    delete m_options.lastMousePosition;

                    self.options.mouseInRegion = null;
                    self.options.mouseDownRegion = null;
                    self.options.mouseUpRegion = null;
                    self.options.downPoint = null;
                    self.options.sizingRight = null;
                    self.options.sizingLeft = null;
                    self.options.moving = null;

                    // Hide the flyout when exit.
                    var exceptionRet = m_functionCleanUpFlyout();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    return self.innerMouseOut(e);
                } catch (e) {

                    return e;
                }
            }

            // Handle mouse move to track the mouse enter.
            self.onMouseMove = function (e) {

                try {

                    // Do nothing if invisible.
                    if (self.isVisible === false) {

                        return null;
                    }

                    // Save the last position of the mouse.
                    m_options.lastMousePosition = {

                        x: e.offsetX,
                        y: e.offsetY
                    };

                    // Reset state.
                    self.options.mouseInRegion = null;
                    self.options.mouseInSizeRight = false;
                    self.options.mouseInSizeLeft = false;
                    self.options.mouseInMove = false;

                    // Test for region type.  Possibly change the cursor.
                    for (var i = 0; i < self.options.sizeRightRegions.length; i++) {

                        var regionIth = self.options.sizeRightRegions[i];
                        if (e.offsetX >= regionIth.left &&
                            e.offsetX < regionIth.left + regionIth.width &&
                            e.offsetY >= regionIth.top &&
                            e.offsetY < regionIth.top + regionIth.height) {

                            self.options.mouseInSizeRight = true;
                            self.options.mouseInSizeRightEvent = regionIth.event;
                            var exceptionRet = self.options.dashboard.setCursor("e-resize");
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }
                    }
                    for (var i = 0; i < self.options.sizeLeftRegions.length; i++) {

                        var regionIth = self.options.sizeLeftRegions[i];
                        if (e.offsetX >= regionIth.left &&
                            e.offsetX < regionIth.left + regionIth.width &&
                            e.offsetY >= regionIth.top &&
                            e.offsetY < regionIth.top + regionIth.height) {

                            self.options.mouseInSizeLeft = true;
                            self.options.mouseInSizeLeftEvent = regionIth.event;
                            var exceptionRet = self.options.dashboard.setCursor("w-resize");
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }
                    }
                    for (var i = 0; i < self.options.moveRegions.length; i++) {

                        var regionIth = self.options.moveRegions[i];
                        if (e.offsetX >= regionIth.left &&
                            e.offsetX < regionIth.left + regionIth.width &&
                            e.offsetY >= regionIth.top &&
                            e.offsetY < regionIth.top + regionIth.height) {

                            self.options.mouseInMove = true;
                            self.options.mouseInMoveEvent = regionIth.event;

                            if ((Math.abs(regionIth.event.startDate.getTime() - self.options.planCurrent.planStartDate.getTime()) < 30 * 86400 * 1000) ||
                                (Math.abs((regionIth.event.startDate.getTime() + regionIth.event.msDuration) -
                                    (self.options.planCurrent.planStartDate.getTime() + self.options.planCurrent.msDuration)) < 30 * 86400 * 1000)) {

                                var exceptionRet = self.options.dashboard.setCursor("not-allowed");
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            } else {

                                var exceptionRet = self.options.dashboard.setCursor("move");
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }
                            }
                        }
                    }

                    // Check for sizing or moving.  Update data and cause redraw--and return.
                    // Always check for draggability first.
                    if (self.options.sizingRight) {

                        // How much has the cursor moved?
                        var dDeltaX = e.offsetX - self.options.downPoint.x;

                        // How much time does the move represent?
                        var dMSDelta = self.getDurationFromWidth(dDeltaX,
                            self.options.rectangleSection.width);

                        // Add time to related event's duration.
                        self.options.downEvent.msDuration = self.options.initialDuration + dMSDelta;
                        if (self.options.downEvent.msDuration < 0) {

                            self.options.downEvent.msDuration = 0;
                        }

                        // Make sure don't push past end of plan.
                        if (self.options.downEvent.startDate.getTime() + self.options.downEvent.msDuration >
                            self.options.planCurrent.planStartDate.getTime() + self.options.planCurrent.msDuration) {

                            self.options.downEvent.msDuration = self.options.planCurrent.planStartDate.getTime() + self.options.planCurrent.msDuration - self.options.downEvent.startDate.getTime();
                        }

                        // Cause a render of this section only.
                        return self.render(self.options.lastRenderContext);
                    } else if (self.options.sizingLeft) {

                        // How much has the cursor moved?
                        var dDeltaX = e.offsetX - self.options.downPoint.x;

                        // How much time does the move represent?
                        var dMSDelta = self.getDurationFromWidth(dDeltaX,
                            self.options.rectangleSection.width);

                        // Add time to related event's duration.
                        self.options.downEvent.msDuration = self.options.initialDuration - dMSDelta;
                        if (self.options.downEvent.msDuration < 0) {

                            dMSDelta += self.options.downEvent.msDuration;
                            self.options.downEvent.msDuration = 0;
                        }

                        // Also adjust the start date.
                        self.options.downEvent.startDate = new Date(self.options.initialStartDate.getTime() + dMSDelta);

                        // Make sure don't go before today.
                        var dPlanStart = self.options.planCurrent.planStartDate.getTime();
                        var dEventStart = self.options.downEvent.startDate.getTime();
                        if (dEventStart < dPlanStart) {

                            var dDelta = dPlanStart - dEventStart;
                            // Adjust back.
                            self.options.downEvent.msDuration -= dDelta;
                            self.options.downEvent.startDate = new Date(dPlanStart);
                        }

                        // Cause a render of this section only.
                        return self.render(self.options.lastRenderContext);
                    } else if (self.options.moving) {

                        // How much has the cursor moved?
                        var dDeltaX = e.offsetX - self.options.downPoint.x;

                        // How much time does the move represent?
                        var dMSDelta = self.getDurationFromWidth(dDeltaX,
                            self.options.rectangleSection.width);

                        // Test the start date for "too close to the start to want to move away from it".
                        if (dDeltaX > 0 &&
                            Math.abs(self.options.downEvent.startDate.getTime() - self.options.planCurrent.planStartDate.getTime()) < 30 * 86400 * 1000) {

                            // Do nothing....
                        } else if (dDeltaX < 0 &&
                            Math.abs((self.options.downEvent.startDate.getTime() + self.options.downEvent.msDuration) -
                                (self.options.planCurrent.planStartDate.getTime() + self.options.planCurrent.msDuration)) < 30 * 86400 * 1000) {

                            // Do nothing....
                        } else {

                            // Adjust the start date.
                            self.options.downEvent.startDate = new Date(self.options.initialStartDate.getTime() + dMSDelta);
                        }

                        // Make sure don't push past beginning of plan.
                        if (self.options.downEvent.startDate.getTime() <
                            self.options.planCurrent.planStartDate.getTime()) {

                            self.options.downEvent.startDate = self.options.planCurrent.planStartDate;
                        }

                        // Make sure don't push past end of plan.
                        if (self.options.downEvent.startDate.getTime() + self.options.downEvent.msDuration >
                            self.options.planCurrent.planStartDate.getTime() + self.options.planCurrent.msDuration) {

                            self.options.downEvent.startDate = new Date(self.options.planCurrent.planStartDate.getTime() + self.options.planCurrent.msDuration - self.options.downEvent.msDuration);
                        }

                        // Possibly flop vertical rendering order:

                        // Calculate delta y.
                        var dDeltaY = e.offsetY - self.options.downPoint.y;

                        // if dDeltaY > rowHeight
                        if (dDeltaY < -self.options.dragDeltaY) {

                            self.options.downPoint.y -= self.options.dragDeltaY;

                            // Swap item.
                            for (var i = 1; i < self.options.renderData.length; i++) {

                                var dataIth = self.options.renderData[i];
                                if (dataIth.name === self.options.downEvent.name) {

                                    self.options.renderData[i] = self.options.renderData[i - 1];
                                    self.options.renderData[i - 1] = dataIth;

                                    // Set if from index is invalid.
                                    if (self.options.downEventFromIndex === undefined ||
                                        self.options.downEventFromIndex === -1) {

                                        self.options.downEventFromIndex = i;
                                    }

                                    // Always set the to.
                                    self.options.downEventToIndex = i - 1;

                                    // Raise event, if attached.
                                    //                                    if ($.isFunction(self.onVerticalDrag)) {
                                    //
                                    //  self.onVerticalDrag(self.options.downEvent,
                                    //    i,
                                    //  i - 1);
                                    //                                    }
                                    break;
                                }
                            }
                        } else if (dDeltaY > self.options.dragDeltaY) {

                            self.options.downPoint.y += self.options.dragDeltaY;

                            // Swap item.
                            for (var i = 0; i < self.options.renderData.length - 1; i++) {

                                var dataIth = self.options.renderData[i];
                                if (dataIth.name === self.options.downEvent.name) {

                                    self.options.renderData[i] = self.options.renderData[i + 1];
                                    self.options.renderData[i + 1] = dataIth;

                                    // Set if from index is invalid.
                                    if (self.options.downEventFromIndex === undefined ||
                                        self.options.downEventFromIndex === -1) {

                                        self.options.downEventFromIndex = i;
                                    }

                                    // Always set the to.
                                    self.options.downEventToIndex = i + 1;

                                    // Raise event, if attached.
                                    //                                    if ($.isFunction(self.onVerticalDrag)) {
                                    //
                                    //                                        self.onVerticalDrag(self.options.downEvent,
                                    //                                            i,
                                    //                                            i + 1);
                                    //                                    }
                                    break;
                                }
                            }
                        }

                        // Cause a render of this section only.
                        return self.render(self.options.lastRenderContext);
                    }

                    // Test that the cursor is within the bounds of "this" region.
                    var rectangleSection = self.options.rectangleSection;
                    if (e.offsetX < rectangleSection.left ||
                        e.offsetX >= rectangleSection.left + rectangleSection.width ||
                        e.offsetY < rectangleSection.top ||
                        e.offsetY >= rectangleSection.top + rectangleSection.height) {

                        return null;
                    }

                    // Figure out if the mouse is in a region, and if so, which.
                    for (var i = 0; i < self.options.regions.length; i++) {

                        var regionIth = self.options.regions[i];

                        if (e.offsetX >= regionIth.left &&
                            e.offsetX < regionIth.left + regionIth.width &&
                            e.offsetY >= regionIth.top &&
                            e.offsetY < regionIth.top + regionIth.height) {

                            // Set the cursor to pointer when over a link that brings up a flyout.
                            var exceptionRet = self.options.dashboard.setCursor("pointer");
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            self.options.mouseInRegion = regionIth;
                            break;
                        }
                    }

                    return self.innerMouseMove(e);
                } catch (e) {

                    return e;
                }
            };

            //////////////////////////////////////
            // Virtual methods.

            // Do nothing in base class.
            self.innerInnerInnerRender = function (contextRender) {

                return null;
            };

            // Render the end-cap of event that is completely off to the right of the visible area.
            self.renderOffToTheRight = function (contextRender,
                rectangleRender,
                eventIth,
                dTop,
                dLeft,
                dRight,
                dBottom,
                dWidth,
                dHeight,
                strTitle,
                sizeTitle) {

                try {

                    // Extract data from size.
                    var exceptionRet = null;
                    var dTitleWidth = sizeTitle.width;

                    // Draw to the right.  Start at the top of the left end.
                    contextRender.moveTo(rectangleRender.left + rectangleRender.width,
                        dTop);
                    contextRender.lineTo(rectangleRender.left + rectangleRender.width - dTitleWidth - self.options.plumSpacerWidth,
                        dTop);
                    contextRender.bezierCurveTo(rectangleRender.left + rectangleRender.width - dTitleWidth - self.options.plumSpacerWidth - self.options.endCapWidth,
                        dTop,
                        rectangleRender.left + rectangleRender.width - dTitleWidth - self.options.plumSpacerWidth - self.options.endCapWidth,
                        dTop + dHeight,
                        rectangleRender.left + rectangleRender.width - dTitleWidth - self.options.plumSpacerWidth,
                        dTop + dHeight);
                    contextRender.lineTo(rectangleRender.left + rectangleRender.width,
                        dTop + dHeight);

                    contextRender.closePath();
                    contextRender.fill();

                    // Draw the title.
                    contextRender.fillStyle = self.options.background.tabFillStyle;
                    contextRender.font = self.options.eventFont;
                    contextRender.fillText(strTitle,
                        rectangleRender.left + rectangleRender.width - dTitleWidth - self.options.plumSpacerWidth,
                        dTop + (dHeight - sizeTitle.height) / 2);

                    // Add an active region.
                    self.options.regions.push({

                        left: rectangleRender.left + rectangleRender.width - dTitleWidth - self.options.plumSpacerWidth,
                        top: dTop + (dHeight - sizeTitle.height) / 2,
                        width: sizeTitle.width,
                        height: sizeTitle.height,
                        event: eventIth,
                        pointer: true               // Indication that this
                    });

                    // If mouse up region is this region, then build flyout.
                    if (self.options.mouseUpRegion !== undefined &&
                        self.options.mouseUpRegion !== null &&
                        self.options.mouseUpRegion.event === eventIth) {

                        self.options.flyout = new Flyout({

                            type: "OffToTheRight",
                            data: eventIth.details,
                            title: ((eventIth.eventId === undefined) ? "" : "Budget for ") + eventIth.name,
                            backgroundColor: self.options.strokeStyle,
                            renderSplitterPlum: self.options.renderSplitterPlum,
                            eventTitleWidth: dTitleWidth,
                            event: eventIth,
                            assetPool: (eventIth.eventId === undefined),
                            graphOddFill: self.options.flyoutSettings.graphOddFill,
                            graphEvenFill: self.options.flyoutSettings.graphEvenFill,
                            titleFont: self.options.flyoutSettings.titleFont,
                            titleFill: self.options.flyoutSettings.titleFill,
                            commandFont: self.options.flyoutSettings.commandFont,
                            gridFont: self.options.flyoutSettings.gridFont,
                            commandFill: self.options.flyoutSettings.commandFill,
                            editFont: self.options.flyoutSettings.editFont,
                            editFill: self.options.flyoutSettings.editFill,
                            editPlumDetailsFill: self.options.flyoutSettings.editPlumDetailsFill
                        });

                        // Get the size of the flyout.
                        var sizeFlyout = self.options.flyout.getSize();

                        // Position to just below the end-cap going the other way.
                        self.options.flyout.rectangle = {

                            left: rectangleRender.left + rectangleRender.width - sizeFlyout.width,
                            top: dTop + dHeight - 1,
                            width: sizeFlyout.width,
                            height: sizeFlyout.height
                        };

                        // Register the flyout.
                        if (self.showHeaderName() === undefined ||
                            self.showHeaderName()) {

                            exceptionRet = self.options.dashboard.registerFlyout(self.options.flyout);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }

                        self.options.mouseUpRegion = null;
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            }

            // Render end-cap of event which is completely off the left of the visible area.
            self.renderOffToTheLeft = function (contextRender,
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
                bOutsideRenderingRegion) {

                try {

                    // Extract data from size.
                    var exceptionRet = null;
                    var dTitleWidth = sizeTitle.width;

                    // If outside, draw a border to separate the glyph.
                    if (bOutsideRenderingRegion) {

                        contextRender.strokeStyle = self.options.outsideRenderingRegionStyle;
                        contextRender.lineWidth = 2;
                        dTop -= 1;
                        dTitleWidth += 2;
                        dHeight += 2;
                        rectangleRender.left -= 1;
                    }

                    // Draw to the left.  Start at the top of the left end.
                    if (eventIth.eventId !== undefined) {

                        contextRender.moveTo(rectangleRender.left,
                            dTop);
                        contextRender.lineTo(rectangleRender.left + dTitleWidth + self.options.plumSpacerWidth,
                            dTop);
                        contextRender.bezierCurveTo(rectangleRender.left + dTitleWidth + self.options.plumSpacerWidth + self.options.endCapWidth,
                            dTop,
                            rectangleRender.left + dTitleWidth + self.options.plumSpacerWidth + self.options.endCapWidth,
                            dTop + dHeight,
                            rectangleRender.left + dTitleWidth + self.options.plumSpacerWidth,
                            dTop + dHeight);
                        contextRender.lineTo(rectangleRender.left,
                            dTop + dHeight);
                    } else {

                        contextRender.moveTo(rectangleRender.left,
                            dTop);
                        contextRender.lineTo(rectangleRender.left + dTitleWidth + self.options.plumSpacerWidth,
                            dTop);
                        contextRender.bezierCurveTo(rectangleRender.left + dTitleWidth + self.options.plumSpacerWidth + self.options.endCapWidth,
                            dTop,
                            rectangleRender.left + dTitleWidth + self.options.plumSpacerWidth + self.options.endCapWidth,
                            dTop + dHeight,
                            rectangleRender.left + dTitleWidth + self.options.plumSpacerWidth,
                            dTop + dHeight);
                        contextRender.lineTo(rectangleRender.left,
                            dTop + dHeight);
                    }

                    contextRender.closePath();
                    contextRender.fill();

                    // If outside, draw a border to separate the glyph.
                    if (bOutsideRenderingRegion) {

                        contextRender.stroke();
                        contextRender.lineWidth = 1;
                        dTop += 1;
                        dTitleWidth -= 2;
                        dHeight -= 2;
                        rectangleRender.left += 1;
                    }

                    // Draw the title.
                    contextRender.fillStyle = self.options.background.tabFillStyle;
                    contextRender.font = self.options.eventFont;
                    contextRender.fillText(strTitle,
                        rectangleRender.left + self.options.plumSpacerWidth,
                        dTop + (dHeight - sizeTitle.height) / 2);

                    // Add an active region.
                    self.options.regions.push({

                        left: rectangleRender.left + self.options.plumSpacerWidth,
                        top: dTop + (dHeight - sizeTitle.height) / 2,
                        width: sizeTitle.width,
                        height: sizeTitle.height,
                        event: eventIth
                    });

                    // If mouse up region is this region, then build flyout.
                    if (self.options.mouseUpRegion !== undefined &&
                        self.options.mouseUpRegion !== null &&
                        self.options.mouseUpRegion.event === eventIth) {

                        self.options.flyout = new Flyout({

                            type: "OffToTheLeft",
                            data: eventIth.details,
                            title: ((eventIth.eventId === undefined) ? "" : "Budget for ") + eventIth.name,
                            backgroundColor: self.options.strokeStyle,
                            renderSplitterPlum: self.options.renderSplitterPlum,
                            eventTitleWidth: dTitleWidth,
                            event: eventIth,
                            assetPool: (eventIth.eventId === undefined),
                            graphOddFill: self.options.flyoutSettings.graphOddFill,
                            graphEvenFill: self.options.flyoutSettings.graphEvenFill,
                            titleFont: self.options.flyoutSettings.titleFont,
                            titleFill: self.options.flyoutSettings.titleFill,
                            commandFont: self.options.flyoutSettings.commandFont,
                            gridFont: self.options.flyoutSettings.gridFont,
                            commandFill: self.options.flyoutSettings.commandFill,
                            editFont: self.options.flyoutSettings.editFont,
                            editFill: self.options.flyoutSettings.editFill,
                            editPlumDetailsFill: self.options.flyoutSettings.editPlumDetailsFill
                        });

                        // Get the size of the flyout.
                        var sizeFlyout = self.options.flyout.getSize();

                        // Position to just below the end-cap going the other way.
                        self.options.flyout.rectangle = {

                            left: rectangleRender.left,
                            top: dTop + dHeight - (eventIth.eventId === undefined ? 1 : 0),
                            width: sizeFlyout.width,
                            height: sizeFlyout.height
                        };

                        // Register the flyout.
                        if (self.showHeaderName() === undefined ||
                            self.showHeaderName()) {

                            exceptionRet = self.options.dashboard.registerFlyout(self.options.flyout);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }

                        self.options.mouseUpRegion = null;
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            }

            // Render (at least) partially visible event that has the label off to the left.
            self.renderLeft = function (contextRender,
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
                dRightDistance) {

                try {

                    // Extract data from size.
                    var exceptionRet = null;
                    var dTitleWidth = sizeTitle.width;

                    // Draw to the left.  Start at the top of the left end.
                    if (eventIth.eventId !== undefined) {

                        contextRender.moveTo(dLeft + (self.options.renderSplitterPlum ? 0 : dHeight / 2 + 3 * self.options.lineWidth / 2),
                            dTop);
                        contextRender.lineTo(dLeft - dTitleWidth - self.options.plumSpacerWidth,
                            dTop);
                        contextRender.bezierCurveTo(dLeft - dTitleWidth - self.options.plumSpacerWidth - self.options.endCapWidth,
                            dTop,
                            dLeft - dTitleWidth - self.options.plumSpacerWidth - self.options.endCapWidth,
                            dTop + dHeight,
                            dLeft - dTitleWidth - self.options.plumSpacerWidth,
                            dTop + dHeight);
                        contextRender.lineTo(dLeft + (self.options.renderSplitterPlum ? 0 : 3 * self.options.lineWidth / 2),
                            dTop + dHeight);
                    } else {

                        // Draw to the left.  Start at the top of the left end.
                        contextRender.moveTo(dLeft,
                            dTop);
                        contextRender.lineTo(dLeft - dTitleWidth - self.options.plumSpacerWidth,
                            dTop);
                        contextRender.bezierCurveTo(dLeft - dTitleWidth - self.options.plumSpacerWidth - self.options.endCapWidth,
                            dTop,
                            dLeft - dTitleWidth - self.options.plumSpacerWidth - self.options.endCapWidth,
                            dTop + dHeight,
                            dLeft - dTitleWidth - self.options.plumSpacerWidth,
                            dTop + dHeight);
                        contextRender.lineTo(dLeft,
                            dTop + dHeight);
                    }

                    contextRender.closePath();
                    contextRender.fill();

                    // Store the right path as an edge.
                    self.options.sizeLeftRegions.push({

                        left: dLeft - dTitleWidth - self.options.plumSpacerWidth - self.options.endCapWidth * 0.75,
                        top: dTop,
                        width: self.options.endCapWidth * 0.75,
                        height: dHeight,
                        event: eventIth
                    });

                    // Also draw the opposite end-cap.
                    if (dRightDistance > 0) {

                        if (eventIth.eventId !== undefined) {

                            contextRender.moveTo(dRight,
                            dTop);
                            contextRender.lineTo(dRight + self.options.plumSpacerWidth,
                                dTop);
                            contextRender.bezierCurveTo(dRight + self.options.plumSpacerWidth + self.options.endCapWidth,
                                dTop,
                                dRight + self.options.plumSpacerWidth + self.options.endCapWidth,
                                dTop + dHeight,
                                dRight + self.options.plumSpacerWidth,
                                dTop + dHeight);
                            contextRender.lineTo(dRight - dHeight / 2 - self.options.lineWidth / 2,
                                dTop + dHeight);
                        } else {

                            contextRender.moveTo(dRight,
                                dTop);
                            contextRender.lineTo(dRight + self.options.plumSpacerWidth,
                                dTop);
                            contextRender.bezierCurveTo(dRight + self.options.plumSpacerWidth + self.options.endCapWidth,
                                dTop,
                                dRight + self.options.plumSpacerWidth + self.options.endCapWidth,
                                dTop + dHeight,
                                dRight + self.options.plumSpacerWidth,
                                dTop + dHeight);
                            contextRender.lineTo(dRight,
                                dTop + dHeight);
                        }

                        contextRender.closePath();
                        contextRender.fill();

                        // Store the right path as an edge.
                        self.options.sizeRightRegions.push({

                            left: dRight + self.options.plumSpacerWidth,
                            top: dTop,
                            width: self.options.endCapWidth * 0.75,
                            height: dHeight,
                            event: eventIth
                        });
                    }

                    // Last, draw the title.
                    contextRender.fillStyle = self.options.background.tabFillStyle;
                    contextRender.font = self.options.eventFont;
                    contextRender.fillText(strTitle,
                        dLeft - dTitleWidth - self.options.plumSpacerWidth,
                        dTop + (dHeight - sizeTitle.height) / 2);

                    // If mouse up region is this region, then build flyout.
                    if (self.options.mouseUpRegion !== undefined &&
                        self.options.mouseUpRegion !== null &&
                        self.options.mouseUpRegion.event === eventIth) {

                        self.options.flyout = new Flyout({

                            type: "Left",
                            data: eventIth.details,
                            title: ((eventIth.eventId === undefined) ? "" : "Budget for ") + eventIth.name,
                            backgroundColor: self.options.strokeStyle,
                            renderSplitterPlum: self.options.renderSplitterPlum,
                            eventTitleWidth: dTitleWidth,
                            event: eventIth,
                            assetPool: (eventIth.eventId === undefined),
                            graphOddFill: self.options.flyoutSettings.graphOddFill,
                            graphEvenFill: self.options.flyoutSettings.graphEvenFill,
                            titleFont: self.options.flyoutSettings.titleFont,
                            titleFill: self.options.flyoutSettings.titleFill,
                            commandFont: self.options.flyoutSettings.commandFont,
                            gridFont: self.options.flyoutSettings.gridFont,
                            commandFill: self.options.flyoutSettings.commandFill,
                            editFont: self.options.flyoutSettings.editFont,
                            editFill: self.options.flyoutSettings.editFill,
                            editPlumDetailsFill: self.options.flyoutSettings.editPlumDetailsFill
                        });

                        // Get the size of the flyout.
                        var sizeFlyout = self.options.flyout.getSize();

                        // Test bounds to determine orientation.
                        var dPositionX = dLeft - dTitleWidth - self.options.plumSpacerWidth - self.options.endCapWidth + self.options.endCapWidth / 4;
                        if (dPositionX + sizeFlyout.width > rectangleRender.left + rectangleRender.width &&
                            dLeft - sizeFlyout.width > rectangleRender.left) {

                            // Off the end of the drawable region and flippible.

                            // Indicate flip.       // This is a little kludge, of course.
                            self.options.flyout.mergeOptions({

                                type: "LeftFlip"
                            });

                            // Position to just below the end-cap going the other way.
                            self.options.flyout.rectangle = {

                                left: dLeft - sizeFlyout.width,
                                top: dTop + dHeight - (eventIth.eventId === undefined ? 1 : 0),
                                width: sizeFlyout.width,
                                height: sizeFlyout.height
                            };
                        } else {

                            // Position to just below the end-cap.
                            self.options.flyout.rectangle = {

                                left: dPositionX,
                                top: dTop + dHeight - (eventIth.eventId === undefined ? 1 : 0),
                                width: sizeFlyout.width,
                                height: sizeFlyout.height
                            };
                        }

                        // Register the flyout.
                        if (self.showHeaderName() === undefined ||
                            self.showHeaderName()) {

                            exceptionRet = self.options.dashboard.registerFlyout(self.options.flyout);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }

                        self.options.mouseUpRegion = null;
                    }

                    // Add an active region.
                    self.options.regions.push({

                        left: dLeft - dTitleWidth - self.options.plumSpacerWidth,
                        top: dTop + (dHeight - sizeTitle.height) / 2,
                        width: sizeTitle.width,
                        height: sizeTitle.height,
                        event: eventIth
                    });

                    return null;
                } catch (e) {

                    return e;
                }
            }

            // Render (at least) partially visible event that has the label off to the right;.
            self.renderRight = function (contextRender,
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
                dLeftDistance) {

                try {

                    // Extract data from size.
                    var exceptionRet = null;
                    var dTitleWidth = sizeTitle.width;

                    // Draw to the right.  Start at the top of the left end.
                    if (eventIth.eventId !== undefined) {

                        contextRender.moveTo(dRight - self.options.lineWidth,
                            dTop);
                        contextRender.lineTo(dRight + dTitleWidth + self.options.plumSpacerWidth,
                            dTop);
                        contextRender.bezierCurveTo(dRight + dTitleWidth + self.options.plumSpacerWidth + self.options.endCapWidth,
                            dTop,
                            dRight + dTitleWidth + self.options.plumSpacerWidth + self.options.endCapWidth,
                            dTop + dHeight,
                            dRight + dTitleWidth + self.options.plumSpacerWidth,
                            dTop + dHeight);
                        contextRender.lineTo(dRight - (dHeight / 2 + 3 * self.options.lineWidth / 2),
                            dTop + dHeight);
                    } else {

                        // Draw to the right.  Start at the top of the left end.
                        contextRender.moveTo(dRight,
                            dTop);
                        contextRender.lineTo(dRight + dTitleWidth + self.options.plumSpacerWidth,
                            dTop);
                        contextRender.bezierCurveTo(dRight + dTitleWidth + self.options.plumSpacerWidth + self.options.endCapWidth,
                            dTop,
                            dRight + dTitleWidth + self.options.plumSpacerWidth + self.options.endCapWidth,
                            dTop + dHeight,
                            dRight + dTitleWidth + self.options.plumSpacerWidth,
                            dTop + dHeight);
                        contextRender.lineTo(dRight,
                            dTop + dHeight);
                    }

                    contextRender.closePath();
                    contextRender.fill();

                    // Store the right path as an edge.
                    self.options.sizeRightRegions.push({

                        left: dRight + dTitleWidth + self.options.plumSpacerWidth,
                        top: dTop,
                        width: self.options.endCapWidth * 0.75,
                        height: dHeight,
                        event: eventIth
                    });

                    // Also draw the opposite end-cap.
                    if (dLeftDistance > 0) {

                        if (eventIth.eventId !== undefined) {

                            contextRender.moveTo(dLeft + (self.options.renderSplitterPlum ? 0 : 3 * self.options.lineWidth / 2),
                                dTop + dHeight);
                            contextRender.lineTo(dLeft - self.options.plumSpacerWidth + self.options.lineWidth,
                                dTop + dHeight);
                            contextRender.bezierCurveTo(dLeft - self.options.plumSpacerWidth - self.options.endCapWidth + self.options.lineWidth,
                                dTop + dHeight,
                                dLeft - self.options.plumSpacerWidth - self.options.endCapWidth + self.options.lineWidth,
                                dTop,
                                dLeft - self.options.plumSpacerWidth + self.options.lineWidth,
                                dTop);
                            contextRender.lineTo(dLeft + (self.options.renderSplitterPlum ? 0 : dHeight / 2 + 3 * self.options.lineWidth / 2),
                                dTop);
                        } else {

                            contextRender.moveTo(dLeft,
                                dTop + dHeight);
                            contextRender.lineTo(dLeft - self.options.plumSpacerWidth,
                                dTop + dHeight);
                            contextRender.bezierCurveTo(dLeft - self.options.plumSpacerWidth - self.options.endCapWidth,
                                dTop + dHeight,
                                dLeft - self.options.plumSpacerWidth - self.options.endCapWidth,
                                dTop,
                                dLeft - self.options.plumSpacerWidth,
                                dTop);
                            contextRender.lineTo(dLeft,
                                dTop);
                        }

                        contextRender.closePath();
                        contextRender.fill();

                        // Store the right path as an edge.
                        self.options.sizeLeftRegions.push({

                            left: dLeft - self.options.plumSpacerWidth - self.options.endCapWidth * 0.75 + self.options.lineWidth,
                            top: dTop,
                            width: self.options.endCapWidth * 0.75,
                            height: dHeight,
                            event: eventIth
                        });
                    }

                    // Last, draw the title.
                    contextRender.fillStyle = self.options.background.tabFillStyle;
                    contextRender.font = self.options.eventFont;
                    contextRender.fillText(strTitle,
                        dRight + self.options.plumSpacerWidth,
                        dTop + (dHeight - sizeTitle.height) / 2);

                    // If mouse up region is this region, then build flyout.
                    if (self.options.mouseUpRegion !== undefined &&
                        self.options.mouseUpRegion !== null &&
                        self.options.mouseUpRegion.event === eventIth) {

                        self.options.flyout = new Flyout({

                            type: "Right",
                            data: eventIth.details,
                            title: ((eventIth.eventId === undefined) ? "" : "Budget for ") + eventIth.name,
                            backgroundColor: self.options.strokeStyle,
                            renderSplitterPlum: self.options.renderSplitterPlum,
                            eventTitleWidth: dTitleWidth,
                            event: eventIth,
                            assetPool: (eventIth.eventId === undefined),
                            graphOddFill: self.options.flyoutSettings.graphOddFill,
                            graphEvenFill: self.options.flyoutSettings.graphEvenFill,
                            titleFont: self.options.flyoutSettings.titleFont,
                            titleFill: self.options.flyoutSettings.titleFill,
                            commandFont: self.options.flyoutSettings.commandFont,
                            gridFont: self.options.flyoutSettings.gridFont,
                            commandFill: self.options.flyoutSettings.commandFill,
                            editFont: self.options.flyoutSettings.editFont,
                            editFill: self.options.flyoutSettings.editFill,
                            editPlumDetailsFill: self.options.flyoutSettings.editPlumDetailsFill
                        });

                        // Get the size of the flyout.
                        var sizeFlyout = self.options.flyout.getSize();

                        // Position to just below the end-cap.
                        var dFlyoutRight = dRight + self.options.plumSpacerWidth + dTitleWidth + 3 * self.options.endCapWidth / 4;
                        var dFlyoutLeft = dFlyoutRight - sizeFlyout.width;

                        // Test bounds to determine orientation.
                        if (dFlyoutLeft < dLeft &&
                            dRight + sizeFlyout.width < rectangleRender.left + rectangleRender.width) {

                            // Off the end of the drawable region and flippible.

                            // Indicate flip.       // This is a little kludge, of course.
                            self.options.flyout.mergeOptions({

                                type: "RightFlip"
                            });

                            self.options.flyout.rectangle = {

                                left: dRight,
                                top: dTop + dHeight - 1,
                                width: sizeFlyout.width,
                                height: sizeFlyout.height
                            };
                        } else {

                            self.options.flyout.rectangle = {

                                left: dFlyoutLeft,
                                top: dTop + dHeight - 1,
                                width: sizeFlyout.width,
                                height: sizeFlyout.height
                            };
                        }

                        // Register the flyout.
                        if (self.showHeaderName() === undefined ||
                            self.showHeaderName()) {

                            exceptionRet = self.options.dashboard.registerFlyout(self.options.flyout);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }

                        self.options.mouseUpRegion = null;
                    }

                    // Add an active region.
                    self.options.regions.push({

                        left: dRight + self.options.plumSpacerWidth,
                        top: dTop + (dHeight - sizeTitle.height) / 2,
                        width: sizeTitle.width,
                        height: sizeTitle.height,
                        event: eventIth
                    });
                    return null;
                } catch (e) {

                    return e;
                }
            }

            // Do nothing in base class.
            self.innerMouseDown = function (e) {

                return null;
            };

            // Do nothing in base class.
            self.innerMouseUp = function (e) {

                return null;
            };

            // Do nothing in base class.
            self.innerMouseOut = function (e) {

                return null;
            };

            // Do nothing in base class.
            self.innerMouseMove = function (e) {

                return null;
            };

            //////////////////////////////////////
            // Virtual properties.

            // Return bool indicating collapsed status of Tab.
            self.isCollapsed = function () {

                return false;
            };

            ////////////////////////////////////////////
            // Private methods.

            // Method unregisters and hides flyout.
            var m_functionCleanUpFlyout = function () {

                try {

                    // Clean up the flyout if dirty.
                    if (self.options.flyout !== null &&
                        self.options.flyout !== undefined) {

                        // Unregister the flyout on a timer.
                        var flyoutLocal = self.options.flyout;

                        setTimeout(function () {

                            var exceptionRet = self.options.dashboard.unregisterFlyout(flyoutLocal);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }, 50);
                    }
                    self.options.flyout = null;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render tab background.
            var m_functionRenderBackground = function (contextRender,
                rectangleRender) {

                try {

                    // If not showing header, just fill rect.
                    if (self.showHeader() === false) {

                        contextRender.fillStyle = self.options.background.tabFillStyle;
                        contextRender.fillRect(rectangleRender.left,
                            rectangleRender.top,
                            rectangleRender.width,
                            rectangleRender.height);

                        return null;
                    }

                    // Set font up front to get width of tab from title.
                    contextRender.font = self.options.background.textFont;
                    contextRender.textBaseline = self.options.background.textBaseline;

                    var dTitleWidth = contextRender.measureText(self.options.title).width;

                    // Compute the tab width.
                    var dTabWidth = dTitleWidth + self.options.background.tabWidthPadding;

                    // Draw the shadow with sits behind tab if drawing the tab name.
                    if (self.showHeaderName()) {

                        // Fill in a small rectangle which blocks out the year words
                        contextRender.fillStyle = self.options.backgroundFillStyle;
                        contextRender.fillRect(rectangleRender.left,
                            rectangleRender.top + self.options.background.tabPadding,
                            dTabWidth + self.options.background.tabYearBlockoutPadding,
                            self.options.background.tabHeight + self.options.background.tabPadding);

                        var exceptionRet = m_functionRenderShadow(contextRender,
                        rectangleRender,
                        dTabWidth);
                        if (exceptionRet !== null) {

                            return exceptionRet;
                        }
                    }

                    // Draw the tab.
                    contextRender.fillStyle = self.options.background.tabFillStyle;
                    contextRender.beginPath();

                    // Draw the tab part when showing the header name.
                    if (self.showHeaderName()) {

                        contextRender.moveTo(rectangleRender.left,
                            rectangleRender.top + self.options.background.tabPadding);
                        contextRender.lineTo(rectangleRender.left + dTabWidth - self.options.background.tabRadius,
                            rectangleRender.top + self.options.background.tabPadding);

                        contextRender.quadraticCurveTo(rectangleRender.left + dTabWidth,
                            rectangleRender.top + self.options.background.tabPadding,
                            rectangleRender.left + dTabWidth,
                            rectangleRender.top + self.options.background.tabPadding + self.options.background.tabRadius);

                        // Always draw the background.
                        contextRender.lineTo(rectangleRender.left + dTabWidth,
                            rectangleRender.top + self.options.background.tabHeight + self.options.background.tabPadding);
                        contextRender.lineTo(rectangleRender.left + rectangleRender.width,
                            rectangleRender.top + self.options.background.tabHeight + self.options.background.tabPadding);
                        contextRender.lineTo(rectangleRender.left + rectangleRender.width,
                            rectangleRender.top + rectangleRender.height); // Commented out because causes overwrite beyond bottom of section. + self.options.background.tabPadding);
                        contextRender.lineTo(rectangleRender.left,
                            rectangleRender.top + rectangleRender.height); // Commented out because causes overwrite beyond bottom of section. + self.options.background.tabPadding);
                        contextRender.lineTo(rectangleRender.left,
                            rectangleRender.top + self.options.background.tabPadding);

                        contextRender.fill();
                    } else {

                        contextRender.fillRect(rectangleRender.left,
                            rectangleRender.top + self.options.background.tabHeight + self.options.background.tabPadding,
                            rectangleRender.width,
                            rectangleRender.height - (self.options.background.tabHeight + self.options.background.tabPadding));
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render title.
            var m_functionRenderTitle = function (contextRender,
                rectangleRender) {

                try {

                    // Get the text height.
                    var dTextHeight = parseFloat(self.options.background.textFont);

                    // Draw the title.
                    contextRender.textBaseline = "top";
                    contextRender.textAlign = "left";
                    contextRender.fillStyle = self.options.background.textFillStyle;
                    contextRender.fillText(self.options.title,
                        rectangleRender.left + self.options.background.textXPadding,
                        rectangleRender.top + self.options.background.tabPadding + Math.floor((self.options.background.tabHeight - dTextHeight) / 2));

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render grid-lines.
            var m_functionRenderGridLines = function (contextRender,
                rectangleRender,
                iNumberOfItems,
                iNumberOfYears) {

                try {

                    // Draw the lines.
                    contextRender.strokeStyle = self.options.grid.strokeStyle;
                    for (var i = 0; i < iNumberOfItems; i++) {

                        contextRender.beginPath();

                        contextRender.moveTo(rectangleRender.left,
                            self.getYFromIndex(rectangleRender,
                                iNumberOfItems,
                                i,
                                false));
                        contextRender.lineTo(rectangleRender.left + rectangleRender.width,
                            self.getYFromIndex(rectangleRender,
                                iNumberOfItems,
                                i,
                                false));

                        contextRender.stroke();
                    }

                    // Get the text height.
                    var dBodyTop = self.options.background.tabHeight + self.options.background.tabPadding;

                    // Now draw the year lines.
                    return self.renderYearLines(contextRender,
                        rectangleRender,
                        dBodyTop);
                } catch (e) {

                    return e;
                }
            };

            // Helper method renders the shadow on the side of the tab "button".
            var m_functionRenderShadow = function (contextRender,
                rectangleRender,
                dTabWidth) {

                try {

                    // The main, closest to the tab curve, but out and down a little bit.
                    contextRender.fillStyle = self.options.background.strokeStyleTabShadow;

                    for (var i = 0; i < 5; i++) {

                        contextRender.beginPath();

                        contextRender.moveTo(rectangleRender.left + dTabWidth - self.options.background.tabRadius + i,
                            rectangleRender.top + self.options.background.tabPadding + 1);

                        contextRender.quadraticCurveTo(rectangleRender.left + dTabWidth + i,
                            rectangleRender.top + self.options.background.tabPadding + 1,
                            rectangleRender.left + dTabWidth + i,
                            rectangleRender.top + self.options.background.tabPadding + self.options.background.tabRadius + 1);

                        contextRender.lineTo(rectangleRender.left + dTabWidth + i,
                            rectangleRender.top + self.options.background.tabHeight + self.options.background.tabPadding + 1);

                        contextRender.lineTo(rectangleRender.left + dTabWidth - self.options.background.tabRadius + i,
                            rectangleRender.top + self.options.background.tabHeight + self.options.background.tabPadding + 1);

                        contextRender.closePath();
                        contextRender.fill();
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ///////////////////////////////////////////
            // Private fields.

            // Private options.
            var m_options = {

            };
        };

        // One-time injection.
        functionRet.inherits(SectionYearsBase);

        // Return constructor.
        return functionRet;
    });
