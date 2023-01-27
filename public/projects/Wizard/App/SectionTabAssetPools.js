////////////////////////////////////////////
// Asset Pools section.

"use strict";

define(["App/SectionTabBase",
    "App/Flyout",
    "App/DebugLog"],
    function (SectionTabBase,
        Flyout, debugLog) {

        // Define Asset Pools Section constructor function.
        var functionRet = function SectionAssetPools(optionsOverride) {

            var self = this;            // Uber-closure.

            // Inherit from SectionTabBase.
            self.inherits(SectionTabBase,
                optionsOverride);       // Pass constructor argument to base class.

            // Augment the options object.
            self.options.title = "Asset Pools";

            /////////////////////////////////////////
            // Public methods.

            // Invoked to force all asset pools to recalculate their pixel coordinates.
            self.resetRenderState = function () {

                try {

                    // Loop over asset pools, reset state.
                    for (var i = 0; i < self.options.renderData.length; i++) {

                        // Get the ith ap.
                        var apIth = self.options.renderData[i];

                        // Reset render state.
                        apIth.dataProcessed = false;
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            }

            /////////////////////////////////////////
            // Public events.

            // Define events raised by self component.
            self.onHorizontalDrag = null;
            self.onVerticalDrag = null;

            ///////////////////////////////////////////////////
            // Override methods.

            // Render out the pools.
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

                    // Set to known value.
                    contextRender.textBaseline = "center";
                    contextRender.textAlign = "start";

                    // Reset collection of active regions.
                    self.options.regions = [];

                    // Possibly render the two Donut charts.
                    if (self.options.renderData.length === 1) {

                        // A candidate for rendering. Look for a donut div named Target or Current.
                        var targetCanvas = document.getElementById("Target");
                        var currentCanvas = document.getElementById("Current");
                        if (targetCanvas !== null && currentCanvas !== null) {

                            // The canvases are square so we don't need both height and width.
                            var cHeight = targetCanvas.height;
                            var middle = Math.floor(cHeight / 2);
                            var radius = Math.floor(cHeight / 2) - 15;

                            // OK. We can use self.options.renderData[0].donutData to create the 2 donuts.
                            var ctx;
                            var lastend = 0;
                            var incr;

                            // Once for Target
                            ctx = targetCanvas.getContext("2d");

                            for (var i = 0; i < self.options.renderData[0].donutData.length; i++) {

                                var ddIth = self.options.renderData[0].donutData[i];
                                ctx.fillStyle = ddIth.color;
                                ctx.beginPath();
                                ctx.moveTo(middle, middle);
                                incr = Math.PI * 2 * (ddIth.target / 100.0);
                                ctx.arc(middle, middle, radius, lastend, lastend + incr, false);
                                ctx.lineTo(middle, middle);
                                ctx.fill();
                                lastend += incr;
                            }
                            // Convert pie chart to a donut chart by drawing an inner circle.
                            ctx.fillStyle = "#4F574A";
                            ctx.beginPath();
                            ctx.moveTo(middle, middle);
                            ctx.arc(middle, middle, Math.floor(radius / 2), 0, 2.0 * Math.PI, false);
                            ctx.fill();
                            // And now write the word "Target" in the circle.
                            ctx.textBaseline = "middle";
                            ctx.textAlign = "center";
                            ctx.lineWidth = 2;
                            ctx.fillStyle = "#FFFFFF";
                            ctx.font = "16px sans-serif";
                            ctx.fillText('Target',
                                    middle,
                                    middle);

                            // And again for Current.
                            lastend = 0;
                            ctx = currentCanvas.getContext("2d");

                            for (var i = 0; i < self.options.renderData[0].donutData.length; i++) {

                                var ddIth = self.options.renderData[0].donutData[i];
                                ctx.fillStyle = ddIth.color;
                                ctx.beginPath();
                                ctx.moveTo(middle, middle);
                                incr = Math.PI * 2 * (ddIth.current / 100.0);
                                ctx.arc(middle, middle, radius, lastend, lastend + incr, false);
                                ctx.lineTo(middle, middle);
                                ctx.fill();
                                lastend += incr;
                            }
                            // Convert pie chart to a donut chart.
                            ctx.fillStyle = "#4F4F4F";
                            ctx.beginPath();
                            ctx.moveTo(middle, middle);
                            ctx.arc(middle, middle, Math.floor(radius / 2), 0, 2.0 * Math.PI, false);
                            ctx.fill();
                            // And now write the word "Current" in the circle.
                            ctx.textBaseline = "middle";
                            ctx.textAlign = "center";
                            ctx.lineWidth = 2;
                            ctx.fillStyle = "#FFFFFF";
                            ctx.font = "16px sans-serif";
                            ctx.fillText('Current',
                                    middle,
                                    middle);
                        }
                    }

                    // Render all pools.
                    var exceptionRet = null;
                    for (var i = 0; i < self.options.renderData.length; i++) {

                        // Get the ith ap.
                        var apIth = self.options.renderData[i];

                        // Possibly filter, if processing a foreground call.
                        if (contextRender.foreground === true) {

                            // Skip if the id is not in the related list.
                            var iAssetPoolId = apIth.assetPoolId;
                            if (contextRender.related.assetPools.indexOf(iAssetPoolId) === -1) {

                                continue;
                            }
                        }

                        // Get the left X.
                        var dLeft = self.getXFromDate(rectangleRender,
                            apIth.startDate);

                        // Get the right X.
                        var dRight = self.getXFromDate(rectangleRender,
                            new Date(apIth.startDate.getTime() + apIth.msDuration));
                        var dWidth = dRight - dLeft;

                        // Get the height.
                        var dTop = self.getYFromIndex(rectangleRender,
                            self.options.renderData.length + (self.options.showPlusPlum ? 1 : 0),
                            i,
                            true) + self.options.padding;
                        var dBottom = self.getYFromIndex(rectangleRender,
                            self.options.renderData.length + (self.options.showPlusPlum ? 1 : 0),
                            i + 1,
                            true) - self.options.padding;
                        var dHeight = dBottom - dTop;
                        var dMiddle = dTop + dHeight / 2;

                        // Push onto move collection.
                        self.options.moveRegions.push({

                            left: dLeft,
                            top: dTop,
                            width: dWidth,
                            height: dHeight,
                            event: apIth
                        });

                        // Pre-process data from detail into positive and negative chunks.
                        // Also keep track of max and min values which determine the scale.
                        if (apIth.dataProcessed === undefined ||
                            apIth.dataProcessed === false) {

                            apIth.maximumPositive = -Infinity;
                            apIth.minimumNegative = Infinity;
                            apIth.renderChunks = [];
                            var chunkCurrent = {

                                points: []
                            };

                            var pointLast = null;
                            for (var j = 0; j < apIth.detail.length; j++) {

                                // Get the ith detail.
                                var point = apIth.detail[j];

                                // Get the X.
                                var dX = self.getXFromDate(rectangleRender,
                                    point.date);

                                // Store X back in point.
                                point.x = dX;

                                // Determine if the current point is positive.
                                var bPositive = point.value >= 0;

                                // Test for maxima.
                                if (bPositive) {

                                    if (point.value > apIth.maximumPositive) {

                                        apIth.maximumPositive = point.value;
                                    }
                                } else {

                                    if (point.value < apIth.minimumNegative) {

                                        apIth.minimumNegative = point.value;
                                    }
                                }

                                // Ensure the current chunk has a side.
                                if (chunkCurrent.side === undefined) {

                                    chunkCurrent.side = bPositive;
                                }

                                if (bPositive === chunkCurrent.side) {

                                    // Add point to current chunk.
                                    chunkCurrent.points.push(point);

                                } else {

                                    // Compute the x-intercept from the current and previous points.
                                    var dDeltaY = point.value - pointLast.value;
                                    var dDeltaX = point.x - pointLast.x;
                                    var dM = dDeltaY / dDeltaX;
                                    var dB = point.value - dM * point.x;
                                    var dXIntercept = -dB / dM;

                                    var pointIntercept = {

                                        value: 0,
                                        x: dXIntercept
                                    };

                                    // Add a point at the x-intercept to the previous and next chunks.
                                    chunkCurrent.points.push(pointIntercept);

                                    // Complete the chunk and start a new one.
                                    apIth.renderChunks.push(chunkCurrent);

                                    chunkCurrent = {

                                        points: [pointIntercept,
                                            point]
                                    };
                                }

                                pointLast = point;
                            }

                            // Add the final chunk.
                            // Complete the chunk and start a new one.
                            if (chunkCurrent.points.length > 0) {

                                apIth.renderChunks.push(chunkCurrent);
                            }

                            apIth.dataProcessed = true;
                        }

                        // Remember the maximal magnitude.
                        var dMagnitude = apIth.maximumPositive;
                        if (apIth.maximumPositive < -apIth.minimumNegative) {

                            dMagnitude = -apIth.minimumNegative;
                        }

                        // Render the strip chart chunks.
                        for (var k = 0; k < apIth.renderChunks.length; k++) {

                            // Get the ith chunk.
                            var chunkIth = apIth.renderChunks[k];

                            if (chunkIth.side) {

                                // Render positive chunk.
                                contextRender.fillStyle = "#7eaf61";
                                contextRender.strokeStyle = "#7eaf61";
                                contextRender.beginPath();

                                contextRender.moveTo(rectangleRender.left + chunkIth.points[0].x,
                                    dMiddle);

                                for (var j = 0; j < chunkIth.points.length; j++) {

                                    // Get the ith point.
                                    var pointIth = chunkIth.points[j];
                                    contextRender.lineTo(rectangleRender.left + pointIth.x,
                                        dMiddle - (pointIth.value / dMagnitude * (dHeight / 2 - 5)));
                                }

                                contextRender.lineTo(rectangleRender.left + chunkIth.points[chunkIth.points.length - 1].x,
                                    dMiddle);

                                contextRender.closePath();
                                contextRender.stroke();
                                contextRender.fill();
                            } else {

                                // Render negative chunk.
                                contextRender.fillStyle = "#ef6f07";
                                contextRender.strokeStyle = "#ef6f07";
                                contextRender.beginPath();

                                contextRender.moveTo(rectangleRender.left + chunkIth.points[0].x,
                                    dMiddle);

                                for (var j = 0; j < chunkIth.points.length; j++) {

                                    // Get the ith point.
                                    var pointIth = chunkIth.points[j];
                                    contextRender.lineTo(rectangleRender.left + pointIth.x,
                                        dMiddle + (-pointIth.value / dMagnitude * (dHeight / 2 - 5)));
                                }

                                contextRender.lineTo(rectangleRender.left + chunkIth.points[chunkIth.points.length - 1].x,
                                    dMiddle);

                                contextRender.closePath();
                                contextRender.fill();
                                contextRender.stroke();
                            }
                        }

                        // Adjust the end-cap heights.
                        var dEndCapRowHeight = self.options.assetPools.endCapRowHeight;
                        dTop += (dHeight - dEndCapRowHeight) / 2;
                        dBottom -= (dHeight - dEndCapRowHeight) / 2;
                        dHeight = dEndCapRowHeight;

                        // Figure out how wide the title thumb is.
                        var strTitle = apIth.name;

                        // Figure out if there is also a note blurb and account for its width if so.
                        var iAlertCount = 0;
                        var iAlertLevel = 0;
                        var iAlertWidth = 0;
                        if (apIth.alerts.length > 0) {

                            for (var k = 0; k < apIth.alerts.length; k++) {

                                // Get the kth alert.
                                var alertKth = apIth.alerts[k];

                                if (alertKth.level > iAlertLevel) {

                                    iAlertLevel = alertKth.level;
                                }
                            }
                            iAlertCount = apIth.alerts.length;
                            iAlertWidth = self.options.paddingAlert + 2 * self.options.widthAlert;
                        }

                        var sizeTitle = strTitle.size(self.options.eventFont);
                        var dTitleWidth = sizeTitle.width;
                        var dThumbWidth = dTitleWidth + self.options.endCapWidth + self.options.plumSpacerWidth + iAlertWidth;

                        // Calculate the distance from the left end to the left side of the region.
                        var dLeftDistance = dLeft - rectangleRender.left;

                        // Calculate the distance from the right end to the right side of the region.
                        var dRightDistance = (rectangleRender.left + rectangleRender.width) - (dLeft + dWidth);

                        // Configure render context.
                        contextRender.beginPath();
                        contextRender.fillStyle = self.options.endCapFillStyle;

                        // Make some space between the end caps and the graph.
                        dRight += self.options.endCapSpacer;
                        dLeft -= self.options.endCapSpacer;

                        // First, check if the event is totally to the left or right of the visible range.
                        if (dLeftDistance > rectangleRender.width) {

                            exceptionRet = self.renderOffToTheRight(contextRender,
                                rectangleRender,
                                apIth,
                                dTop,
                                dLeft,
                                dRight,
                                dBottom,
                                dWidth,
                                dHeight,
                                strTitle,
                                sizeTitle,
                                iAlertCount,
                                iAlertLevel);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        } else if (dRightDistance > rectangleRender.width ||
                            (dLeft <= rectangleRender.left && (dLeft + dWidth) >= (rectangleRender.left + rectangleRender.width))) {

                            exceptionRet = self.renderOffToTheLeft(contextRender,
                                rectangleRender,
                                apIth,
                                dTop,
                                dLeft,
                                dRight,
                                dBottom,
                                dWidth,
                                dHeight,
                                strTitle,
                                sizeTitle,
                                iAlertCount,
                                iAlertLevel,
                                (dLeft <= rectangleRender.left && (dLeft + dWidth) >= (rectangleRender.left + rectangleRender.width)));
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        } else if (dLeftDistance > 0 &&  // If there is enough room draw the title on the left.
                            (dThumbWidth < dLeftDistance ||
                            dLeftDistance > dRightDistance)) {

                            exceptionRet = self.renderLeft(contextRender,
                                rectangleRender,
                                apIth,
                                dTop,
                                dLeft,
                                dRight,
                                dBottom,
                                dWidth,
                                dHeight,
                                strTitle,
                                sizeTitle,
                                iAlertCount,
                                iAlertLevel,
                                dRightDistance);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        } else if (dRightDistance > 0) {

                            exceptionRet = self.renderRight(contextRender,
                                rectangleRender,
                                apIth,
                                dTop,
                                dLeft,
                                dRight,
                                dBottom,
                                dWidth,
                                dHeight,
                                strTitle,
                                sizeTitle,
                                iAlertCount,
                                iAlertLevel,
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
            self.innerMouseMove = function (e) {

                try {

                    // Reset.
                    self.options.inGraph = null;

                    // Clear tooltip.
                    var exceptionRet = self.options.dashboard.hideTooltip();
                    if (exceptionRet !== null) {

                        return exceptionRet;
                    }

                    // Compose mouse position object for rendering.
                    self.options.mousePosition = {

                        x: e.offsetX,
                        y: e.offsetY
                    };

                    // First test that the cursor is within the bounds of "this" region.
                    var rectangleSection = self.options.rectangleSection;
                    if (e.offsetX < rectangleSection.left ||
                        e.offsetX >= rectangleSection.left + rectangleSection.width ||
                        e.offsetY < rectangleSection.top ||
                        e.offsetY >= rectangleSection.top + rectangleSection.height) {

                        return null;
                    }

                    // Figure out over which asset pool graph, set state so render shows the number.
                    for (var i = 0; i < self.options.renderData.length; i++) {

                        // Get the ith ap.
                        var apIth = self.options.renderData[i];

                        // Get the left X.
                        var dLeft = self.getXFromDate(self.options.rectangleSection,
                            apIth.startDate);

                        // Get the right X.
                        var dRight = self.getXFromDate(self.options.rectangleSection,
                            new Date(apIth.startDate.getTime() + apIth.msDuration));
                        var dWidth = dRight - dLeft;

                        // Get the height.
                        var dTop = self.getYFromIndex(self.options.rectangleSection,
                            self.options.renderData.length + (self.options.showPlusPlum ? 1 : 0),
                            i,
                            true) + self.options.padding;
                        var dBottom = self.getYFromIndex(self.options.rectangleSection,
                            self.options.renderData.length + (self.options.showPlusPlum ? 1 : 0),
                            i + 1,
                            true) - self.options.padding;
                        var dHeight = dBottom - dTop;

                        // Test for inclusion.
                        if (e.offsetX >= dLeft &&
                            e.offsetX < dLeft + dWidth &&
                            e.offsetY >= dTop &&
                            e.offsetY < dTop + dHeight) {

                            // Get the date at the cursor.
                            var dateCursor = self.getDateFromX(self.options.rectangleSection,
                                e.offsetX);

                            // Get the detail too.
                            var pointIn = null;
                            if (apIth.dataProcessed !== undefined ||
                                apIth.dataProcessed !== false) {

                                for (var j = apIth.detail.length - 1; j >= 0; j--) {

                                    // Get the ith detail.
                                    var point = apIth.detail[j];

                                    // Skip processing on (obviously) bad data.
                                    if (point.date === undefined ||
                                        point.date === null) {

                                        continue;
                                    }

                                    if (dateCursor >= point.date) {

                                        // OK, display tooltip.
                                        exceptionRet = self.options.dashboard.moveTooltip(e.offsetX + 10,
                                            e.offsetY - 20);
                                        if (exceptionRet !== null) {

                                            return exceptionRet;
                                        }

                                        // Format tooltip.
                                        var strValue = point.value.toFixed(0);
                                        var regexGroup = new RegExp("(-?[0-9]+)([0-9]{3})");
                                        while (regexGroup.test(strValue)) {
                                            strValue = strValue.replace(regexGroup, "$1,$2");
                                        }
                                        exceptionRet = self.options.dashboard.setTooltip(strValue);
                                        if (exceptionRet !== null) {

                                            return exceptionRet;
                                        }

                                        return null;
                                    }
                                }
                            }

                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Overridden to hide tool-tip.
            self.innerMouseOut = function (e) {

                try {

                    // Clear tooltip.
                    return self.options.dashboard.hideTooltip();
                } catch (e) {

                    return e;
                }
            };

            // Toggle collapsed state.
            self.toggleCollapsed = function () {

                try {

                    self.options.assetPools.collapsed = (self.options.assetPools.collapsed ? false : true);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Give the derived classes an opportunity to handle the resize.
            self.onResize = function () {

                try {

                    // Cause data to be re-calculated on resize.
                    for (var i = 0; i < self.options.renderData.length; i++) {

                        self.options.renderData[i].dataProcessed = false;
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ///////////////////////////////////////////////////
            // Override properties

            // Return the height required by the section.
            self.getHeight = function () {

                // Just return 0 if invisible.
                if (self.isVisible() === false) {

                    return 0;
                }

                // Just return header height if invisible.
                if (self.isCollapsed()) {

                    return self.options.assetPools.headerHeight + 1;
                }

                // Else, calculate the whole height.
                return self.options.assetPools.rowHeight * (self.options.renderData.length + (self.options.showPlusPlum ? 1 : 0)) +
                    ((self.showHeader()) ? self.options.assetPools.headerHeight : 0) +
                    self.options.assetPools.paddingHeight;
            };

            // Return bool indicating visibility of SectionTab.
            self.isVisible = function () {

                return self.options.assetPools.visible;
            };

            // Return bool indicating collapsed status of SectionTab.
            self.isCollapsed = function () {

                return self.options.assetPools.collapsed;
            };

            // Return bool indicating the visibility of the header.
            self.showHeader = function () {

                return self.options.assetPools.showHeader;
            };

            // Return bool indicating the visibility of the headerName.	Jerry
            self.showHeaderName = function () {

                return self.options.assetPools.showHeaderName;
            };
        };

        // One-time Function.inherits injection.
        functionRet.inherits(SectionTabBase);

        // Return constructor.
        return functionRet;
    });
