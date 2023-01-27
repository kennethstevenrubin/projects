///////////////////////////////////////
// Draws a flyout dialog in one of twelve ways.

"use strict";

define([],
    function () {

        // Define flyout constructor function.
        var functionRet = function Flyout(optionsOverride) {

            var self = this;            // Uber-closure.

            ///////////////////////////////////////
            // Public events.

            self.onEditPlum = null;
            self.onDeletePlum = null;
            self.onRenamePlum = null;
            self.onHorizontalDrag = null;
            self.onVerticalDrag = null;

            ///////////////////////////////////////
            // Public properties.

            self.dashboard = null;

            ///////////////////////////////////////
            // Public methods.

            // Public access to render flyout.
            self.render = function (contextRender) {

                try {

                    m_options.regions = [];

                    // Render background.
                    var exceptionRet = m_functionRenderBackground(contextRender);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Output grid.
                    exceptionRet = m_functionRenderGrid(contextRender);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Render out the title.
                    contextRender.font = m_options.titleFont;
                    contextRender.textBaseline = "middle";
                    contextRender.textAlign = "left";
                    contextRender.fillStyle = m_options.titleFill;
                    contextRender.fillText(m_options.title,
                        self.rectangle.left + m_options.gapWidth,
                        self.rectangle.top + m_options.dropHeight + m_options.gapHeight + m_options.titleHeight / 2);

                    var sizeDelete = "Delete".size(m_options.commandFont);
                    var sizeSeparator = "|".size(m_options.commandFont);
                    var sizeRename = "Rename".size(m_options.commandFont);

                    // Render out the delete, rename and linked sections.
                    var dX = self.rectangle.left + m_options.gapWidth + m_options.editPlumDetailsWidth + m_options.commandGapWidth;
                    var dY = self.rectangle.top +
                        m_options.dropHeight +
                        m_options.gapHeight +
                        m_options.titleHeight +
                        m_options.titleGridGapHeight +
                        m_options.listHeight() +
                        m_options.halfGapHeight / 1.5;
                    contextRender.font = m_options.commandFont;
                    contextRender.fillStyle = m_options.commandFill;
                    contextRender.textBaseline = "top";
                    contextRender.fillText("Delete",
                        dX,
                        dY);
                    m_options.regions.push({

                        left: dX,
                        top: dY,
                        width: sizeDelete.width,
                        height: sizeDelete.height,
                        type: "Delete"
                    });

                    // The separator.
                    dX += sizeDelete.width + 6;
                    contextRender.fillText("|",
                        dX,
                        dY);

                    // Rename.
                    dX += sizeSeparator.width + 6;
                    contextRender.fillText("Rename",
                        dX,
                        dY);
                    m_options.regions.push({

                        left: dX,
                        top: dY,
                        width: sizeRename.width,
                        height: sizeRename.height,
                        type: "Rename"
                    });

                    // Related.
                    var strRelated = "Show related Asset Pools";
                    if (m_options.event === undefined ||
                        m_options.event.eventId == undefined) {

                        strRelated = "Show related Plums";
                    }

                    var sizeRelated = strRelated.size(contextRender.font);
                    var dX = self.rectangle.left + m_options.gapWidth + m_options.editPlumDetailsWidth + m_options.commandGapWidth;
                    dY += m_options.controlsHeight / 2 + 4;
                    contextRender.fillText(strRelated,
                        dX,
                        dY);
                    m_options.regions.push({

                        left: dX,
                        top: dY,
                        width: sizeRelated.width,
                        height: sizeRelated.height,
                        type: "Related"
                    });

                    // And the Edit plum details button.
                    dX = self.rectangle.left +
                        m_options.gapWidth;
                    dY = self.rectangle.top +
                        m_options.dropHeight +
                        m_options.gapHeight +
                        m_options.titleHeight +
                        m_options.titleGridGapHeight +
                        m_options.listHeight() +
                        m_options.halfGapHeight / 1.5;

                    // Background.
                    contextRender.fillStyle = m_options.editPlumDetailsFill;
                    contextRender.beginPath();

                    contextRender.moveTo(dX + m_options.editPlumDetailsCornerRadius,
                        dY);
                    contextRender.arcTo(dX + m_options.editPlumDetailsWidth,
                        dY,
                        dX + m_options.editPlumDetailsWidth,
                        dY + m_options.editPlumDetailsCornerRadius,
                        m_options.editPlumDetailsCornerRadius);

                    contextRender.lineTo(dX + m_options.editPlumDetailsWidth,
                        dY + m_options.controlsHeight - m_options.editPlumDetailsCornerRadius);
                    contextRender.arcTo(dX + m_options.editPlumDetailsWidth,
                        dY + m_options.controlsHeight + 4,
                        dX + m_options.editPlumDetailsWidth - m_options.editPlumDetailsCornerRadius,
                        dY + m_options.controlsHeight + 4,
                        m_options.editPlumDetailsCornerRadius);

                    contextRender.lineTo(dX + m_options.editPlumDetailsCornerRadius,
                        dY + m_options.controlsHeight + 4);
                    contextRender.arcTo(dX,
                        dY + m_options.controlsHeight + 4,
                        dX,
                        dY + m_options.controlsHeight + 4 - m_options.editPlumDetailsCornerRadius,
                        m_options.editPlumDetailsCornerRadius);

                    contextRender.lineTo(dX,
                        dY + m_options.editPlumDetailsCornerRadius);
                    contextRender.arcTo(dX,
                        dY,
                        dX + m_options.editPlumDetailsCornerRadius,
                        dY,
                        m_options.editPlumDetailsCornerRadius);

                    contextRender.closePath();
                    contextRender.fill();

                    // Render out EPD title.
                    var dX = self.rectangle.left + m_options.gapWidth + m_options.editPlanDataGapWidth;
                    var dY = self.rectangle.top +
                        m_options.dropHeight +
                        m_options.gapHeight +
                        m_options.titleHeight +
                        m_options.titleGridGapHeight +
                        m_options.listHeight() +
                        m_options.halfGapHeight / 1.5 +
                        m_options.controlsHeight / 2 +
                        m_options.editPlanDataGapHeight + 2;
                    contextRender.font = m_options.editFont;
                    var strText = "Edit Plum";
                    var dDX = 20;
                    if (m_options.assetPool === true) {

                        strText = "Edit Asset Pool";
                        dDX = 4;
                    }
                    var sizeEPD = strText.size(contextRender.font);
                    contextRender.fillStyle = m_options.editFill;
                    contextRender.textBaseline = "middle";
                    contextRender.fillText(strText,
                        dX + dDX,
                        dY);
                    m_options.regions.push({

                        left: dX + dDX,
                        top: dY - sizeEPD.height / 2,
                        width: sizeEPD.width,
                        height: sizeEPD.height,
                        type: "Edit"
                    });

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Return required size.
            self.getSize = function () {

                try {

                    // Width:

                    // Count 2 gaps and a grid width, or 2 gaps and a title width and title gap; whichever is bigger.
                    var dGap = m_options.gapWidth * 2;
                    var dGridly = dGap + m_options.gridWidth;
                    var dTitlely = dGap + m_options.eventTitleWidth + m_options.eventTitleGapWidth;

                    var dWidth = dGridly;
                    if (dGridly < dTitlely) {

                        dWidth = dTitlely;
                    }

                    // Height:

                    // Height is more fixed.
                    var dHeight = m_options.dropHeight +
                        m_options.gapHeight +
                        m_options.titleGridGapHeight +
                        m_options.titleHeight +
                        m_options.listHeight() +
                        2 * m_options.halfGapHeight +
                        m_options.controlsHeight;

                    return {

                        width: dWidth,
                        height: dHeight
                    };
                } catch (e) {

                    return e;
                }
            };

            // Handle mouse up to see if any button is pressed.
            self.onMouseUp = function (e) {

                // Test against render rect.
                if (e.offsetX < self.rectangle.left ||
                    e.offsetX > self.rectangle.left + self.rectangle.width ||
                    e.offsetY < self.rectangle.top ||
                    e.offsetY > self.rectangle.top + self.rectangle.height) {

                    return false;
                }

                // Test for each region.
                for (var i = 0; i < m_options.regions.length; i++) {

                    var regionIth = m_options.regions[i];

                    if (e.offsetX >= regionIth.left &&
                        e.offsetX < regionIth.left + regionIth.width &&
                        e.offsetY >= regionIth.top &&
                        e.offsetY < regionIth.top + regionIth.height) {

                        // Get type.
                        var strType = regionIth.type;
                        if (strType === "Edit") {

                            if ($.isFunction(self.onEditPlum)) {

                                // Call the "event", pass the event.
                                self.onEditPlum(m_options.event);
                            }
                        } else if (strType === "Delete") {

                            if ($.isFunction(self.onDeletePlum)) {

                                // Call the "event", pass the event.
                                self.onDeletePlum(m_options.event);
                            }
                        } else if (strType === "Related") {

                            // Register this flyout.
                            var exceptionRet = self.dashboard.registerRelated(m_options.event.related);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        } else {

                            if ($.isFunction(self.onRenamePlum)) {

                                // Call the "event", pass the event.
                                self.onRenamePlum(m_options.event);
                            }
                        }

                        return true;
                    }
                }

                return true;
            };

            // Handle mouse move to set cursor if over command.
            self.onMouseMove = function (e) {

                // Test against render rect.
                if (e.offsetX < self.rectangle.left ||
                    e.offsetX > self.rectangle.left + self.rectangle.width ||
                    e.offsetY < self.rectangle.top ||
                    e.offsetY > self.rectangle.top + self.rectangle.height) {

                    return false;
                }

                // Test for each region.
                for (var i = 0; i < m_options.regions.length; i++) {

                    var regionIth = m_options.regions[i];

                    if (e.offsetX >= regionIth.left &&
                        e.offsetX < regionIth.left + regionIth.width &&
                        e.offsetY >= regionIth.top &&
                        e.offsetY < regionIth.top + regionIth.height) {

                        // Get type.
                        var strType = regionIth.type;
                        if (strType === "Delete") {

                            var exceptionRet = self.dashboard.setCursor("pointer");
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        } else if (strType === "Related") {

                            var exceptionRet = self.dashboard.setCursor("pointer");
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        } else {

                            var exceptionRet = self.dashboard.setCursor("pointer");
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }

                        return true;
                    }
                }

                return true;
            };

            // Called to merge parameter into options object.
            self.mergeOptions = function (optionsOverrideParameter) {

                try {

                    // Allow constructor parameters to override the 
                    // options object to enhance / customize behavior.
                    m_options.inject(optionsOverrideParameter);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ///////////////////////////////////////
            // Private methods.

            // Render grid.
            var m_functionRenderGrid = function (context) {

                try {

                    // Extract local state up front.
                    var rectangle = self.rectangle;

                    // Calculate coordinates of grid.
                    var rectangleGrid = {

                        left: rectangle.left + m_options.gapWidth,
                        top: rectangle.top + m_options.gapHeight + m_options.titleHeight + m_options.titleGridGapHeight,
                        width: m_options.gridWidth,
                        height: m_options.listHeight()
                    };

                    // Loop over each data row.
                    if (m_options.assetPool === true) {

                        // Loop for Asset Pools.
                        for (var i = 0; i < m_options.data.length; i++) {

                            var detailIth = m_options.data[i];

                            var strName = detailIth.name;
                            var mAmount = detailIth.amount;

                            var dX = rectangleGrid.left;
                            var dY = rectangleGrid.top + m_options.rowHeight * i;
                            var dHeight = m_options.rowHeight - m_options.rowGapHeight;

                            ///////////////////////////
                            // Draw the name column.

                            // First the background--set the color based on the oddness of row index.
                            if (i % 2 === 0) {

                                context.fillStyle = m_options.graphEvenFill;
                            } else {

                                context.fillStyle = m_options.graphOddFill;
                            }

                            // Fill background of cell.
                            context.fillRect(dX,
                                dY,
                                m_options.assetPoolIdWidth,
                                dHeight);

                            // Draw cell text.
                            context.font = m_options.gridFont;
                            context.textBaseline = "top";
                            context.textAlign = "start";
                            context.fillStyle = m_options.commandFill;

                            // Ensure text fits in cell; apply ... if not.
                            var strUse = strName;
                            if (strName.size(context.font).width > m_options.assetPoolIdWidth - 2 * m_options.cellPadding) {

                                strName = strName.substring(0, strName.length - 1);
                                strUse = strName + "...";
                                while (strUse.size(context.font).width > m_options.assetPoolIdWidth - 2 * m_options.cellPadding) {

                                    strName = strName.substring(0, strName.length - 1);
                                    strUse = strName + "...";
                                }
                            }

                            context.fillText(strUse,
                                dX + m_options.cellPadding,
                                dY + m_options.cellPadding);

                            ////////////////////////////
                            // Draw the amount column.

                            // First the background--set the color based on the oddness of row index.
                            if (i % 2 === 0) {

                                context.fillStyle = m_options.graphEvenFill;
                            } else {

                                context.fillStyle = m_options.graphOddFill;
                            }

                            // Fill background of cell.
                            dX += m_options.assetPoolIdWidth + m_options.cellGapWidth;
                            context.fillRect(dX,
                                dY,
                                m_options.amountWidth,
                                dHeight);

                            var strValue = mAmount.toFixed(0);
                            var regexGroup = new RegExp("(-?[0-9]+)([0-9]{3})");
                            while (regexGroup.test(strValue)) {
                                strValue = strValue.replace(regexGroup, "$1,$2");
                            }
                            if (strValue[0] === "-") {

                                strValue = "- $ " + strValue.substring(1);
                            } else {

                                strValue = "+ $ " + strValue;
                            }

                            // Draw cell text.
                            context.textAlign = "end";
                            context.fillStyle = m_options.commandFill;
                            context.fillText(strValue,
                                dX + m_options.amountWidth - m_options.cellPadding,
                                dY + m_options.cellPadding);

                        }
                    } else {

                        // Loop for Plums.
                        for (var i = 0; i < m_options.data.length; i++) {

                            var detailIth = m_options.data[i];

                            var strName = detailIth.name;
                            var mAmount = detailIth.amount;
                            var strDescription = detailIth.description;

                            var dX = rectangleGrid.left;
                            var dY = rectangleGrid.top + m_options.rowHeight * i;
                            var dHeight = m_options.rowHeight - m_options.rowGapHeight;

                            ///////////////////////////
                            // Draw the name column.

                            // First the background--set the color based on the oddness of row index.
                            if (i % 2 === 0) {

                                context.fillStyle = m_options.graphEvenFill;
                            } else {

                                context.fillStyle = m_options.graphOddFill;
                            }

                            // Fill background of cell.
                            context.fillRect(dX,
                                dY,
                                m_options.idWidth,
                                dHeight);

                            // Draw cell text.
                            context.font = m_options.gridFont;
                            context.textBaseline = "top";
                            context.textAlign = "start";
                            context.fillStyle = m_options.commandFill;
                            context.fillText(strName,
                                dX + m_options.cellPadding,
                                dY + m_options.cellPadding);

                            ////////////////////////////
                            // Draw the amount column.

                            // First the background--set the color based on the oddness of row index.
                            if (i % 2 === 0) {

                                context.fillStyle = m_options.graphEvenFill;
                            } else {

                                context.fillStyle = m_options.graphOddFill;
                            }

                            // Fill background of cell.
                            dX += m_options.idWidth + m_options.cellGapWidth;
                            context.fillRect(dX,
                                dY,
                                m_options.amountWidth,
                                dHeight);

                            var strValue = mAmount.toFixed(0);
                            var regexGroup = new RegExp("(-?[0-9]+)([0-9]{3})");
                            while (regexGroup.test(strValue)) {
                                strValue = strValue.replace(regexGroup, "$1,$2");
                            }
                            if (strValue[0] === "-") {

                                strValue = "- $ " + strValue.substring(1);
                            } else {

                                strValue = "+ $ " + strValue;
                            }

                            // Draw cell text.
                            context.textAlign = "end";
                            context.fillStyle = m_options.commandFill;
                            context.fillText(strValue,
                                dX + m_options.amountWidth - m_options.cellPadding,
                                dY + m_options.cellPadding);

                            //////////////////////////////
                            // Draw the description column.

                            // First the background--set the color based on the oddness of row index.
                            if (i % 2 === 0) {

                                context.fillStyle = m_options.graphEvenFill;
                            } else {

                                context.fillStyle = m_options.graphOddFill;
                            }

                            // Fill background of cell.
                            dX += m_options.amountWidth + m_options.cellGapWidth;
                            context.fillRect(dX,
                                dY,
                                m_options.descriptionWidth,
                                dHeight);

                            // Draw cell text.
                            context.textAlign = "start";
                            context.fillStyle = m_options.commandFill;

                            var strUse = strDescription;
                            if (strDescription.size(context.font).width > m_options.descriptionWidth - 2 * m_options.cellPadding) {

                                strDescription = strDescription.substring(0, strDescription.length - 1);
                                strUse = strDescription + "...";
                                while (strUse.size(context.font).width > m_options.descriptionWidth - 2 * m_options.cellPadding) {

                                    strDescription = strDescription.substring(0, strDescription.length - 1);
                                    strUse = strDescription + "...";
                                }
                            }

                            context.fillText(strUse,
                                dX + m_options.cellPadding,
                                dY + m_options.cellPadding);
                        }
                    }
                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render out the background.
            var m_functionRenderBackground = function (context) {

                try {

                    // Extract local state up front.
                    var rectangle = self.rectangle;

                    // Figure out which of the 12 possible types to render based on the ansers to the following questions:
                    // Hanging, Left, Centered and Clipped.

                    // Load the path for the background into the context.

                    // Hanging down or propped up?
                    var exceptionRet = null;
                    var strType = m_options.type;

                    var functionRenderer = null;
                    if (strType === "Left") {

                        functionRenderer = m_functionRenderLeft;
                    } else if (strType === "LeftFlip") {

                        functionRenderer = m_functionRenderLeftFlip;
                    } else if (strType === "Right") {

                        functionRenderer = m_functionRenderRight;
                    } else if (strType === "RightFlip") {

                        functionRenderer = m_functionRenderRightFlip;
                    } else if (strType === "OffToTheLeft") {

                        functionRenderer = m_functionRenderOffToTheLeft;
                    } else if (strType === "OffToTheRight") {

                        functionRenderer = m_functionRenderOffToTheRight;
                    }

                    // Draw the shadow.
                    context.fillStyle = "rgba(0,0,0,0.2)";
                    for (var i = 0; i < 6; i++) {

                        exceptionRet = functionRenderer(context,
                            rectangle,
                            i,
                            2 + i / 5);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        context.fill();
                    }

                    // Render out the dialog.
                    context.fillStyle = m_options.backgroundColor;
                    exceptionRet = functionRenderer(context,
                        rectangle,
                        0,
                        0);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    context.fill();

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render flyout attached to parent with the label on the left end-cap.
            var m_functionRenderLeft = function (context,
                rectangle,
                dOffsetX,
                dOffsetY) {

                try {

                    // Potentially shift over while rendering shadows.
                    rectangle.left += dOffsetX;
                    rectangle.top += dOffsetY;

                    context.beginPath();

                    // Start the shape.
                    context.moveTo(rectangle.left,
                        rectangle.top);

                    // Move up to do the outer curve filling merge.

                    // Only draw the little tab if not drawing a shadow.
                    if (dOffsetY === 0) {

                        context.lineTo(rectangle.left,
                            rectangle.top - m_options.halfEventHeight);

                        // Cut back down, but stay attached so there is no gap along the bottom of the title.
                        context.lineTo(rectangle.left + m_options.halfEventHeight,
                            rectangle.top);
                    }

                    // Draw for events one way, and...
                    if (m_options.assetPool === undefined ||
                        m_options.assetPool === false) {

                        context.lineTo(rectangle.left + m_options.eventTitleWidth + m_options.endCapWidth + m_options.plumSpacerWidth + (m_options.renderSplitterPlum ? 0 : 10),
                            rectangle.top);

                        // Drop down so now separate from the hash lines.
                        context.lineTo(rectangle.left + m_options.eventTitleWidth + m_options.endCapWidth + m_options.plumSpacerWidth + (m_options.renderSplitterPlum ? 0 : 10),
                            rectangle.top + m_options.dropHeight);
                    } else {

                        var dShift = 0;
                        if (dOffsetY !== 0) {

                            dShift = -1;
                        }

                        // Another way for confirmed asset pools.
                        context.lineTo(rectangle.left + m_options.eventTitleWidth + m_options.endCapWidth + m_options.plumSpacerWidth - 0.5 - dShift,
                            rectangle.top + 0.5);

                        context.lineTo(rectangle.left + m_options.eventTitleWidth + m_options.endCapWidth + m_options.plumSpacerWidth - 0.5 - dShift,
                            rectangle.top - m_options.endCapHeight + 0.5);

                        context.arcTo(rectangle.left + m_options.eventTitleWidth + m_options.endCapWidth + m_options.plumSpacerWidth + 2 * m_options.cornerRadius - dShift,
                            rectangle.top - m_options.endCapHeight + 0.5,
                            rectangle.left + m_options.eventTitleWidth + m_options.endCapWidth + m_options.plumSpacerWidth + 2 * m_options.cornerRadius - dShift,
                            rectangle.top - m_options.cornerRadius,
                            m_options.cornerRadius);

                        context.lineTo(rectangle.left + m_options.eventTitleWidth + m_options.endCapWidth + m_options.plumSpacerWidth + 2 * m_options.cornerRadius - dShift,
                            rectangle.top - m_options.cornerRadius);

                        context.arcTo(rectangle.left + m_options.eventTitleWidth + m_options.endCapWidth + m_options.plumSpacerWidth + 2 * m_options.cornerRadius - dShift,
                            rectangle.top,
                            rectangle.left + m_options.eventTitleWidth + m_options.endCapWidth + m_options.plumSpacerWidth + 4 * m_options.cornerRadius - dShift,
                            rectangle.top,
                            m_options.cornerRadius);
                    }

                    // Draw over to just before the upper right corner.
                    context.lineTo(rectangle.left + rectangle.width - 2 * m_options.cornerRadius,
                        rectangle.top + m_options.dropHeight);

                    // Now draw the upper right corner.
                    context.arcTo(rectangle.left + rectangle.width,
                        rectangle.top + m_options.dropHeight,
                        rectangle.left + rectangle.width,
                        rectangle.top + 2 * m_options.cornerRadius,
                        m_options.cornerRadius);

                    // Draw down to the lower right corner.
                    context.lineTo(rectangle.left + rectangle.width,
                        rectangle.top + rectangle.height - 2 * m_options.cornerRadius);

                    // Draw the lower right corner.
                    context.arcTo(rectangle.left + rectangle.width,
                        rectangle.top + rectangle.height,
                        rectangle.left + rectangle.width - 2 * m_options.cornerRadius,
                        rectangle.top + rectangle.height,
                        m_options.cornerRadius);

                    // Move over to the lower left hand corner.
                    context.lineTo(rectangle.left + 2 * m_options.cornerRadius,
                        rectangle.top + rectangle.height);

                    // Draw the lower left corner.
                    context.arcTo(rectangle.left,
                        rectangle.top + rectangle.height,
                        rectangle.left,
                        rectangle.top + rectangle.height - 2 * m_options.cornerRadius,
                        m_options.cornerRadius);

                    // Now, just close the path.
                    context.closePath();

                    return null;
                } catch (e) {

                    return e;
                } finally {

                    rectangle.left -= dOffsetX;
                    rectangle.top -= dOffsetY;
                }
            }

            // Render flyout attached to parent with the label on the left, but where there is 
            // not enough room to fit the flyout on the screen and so it is flipped horizontally.
            var m_functionRenderLeftFlip = function (context,
                rectangle,
                dOffsetX,
                dOffsetY) {

                try {

                    rectangle.left += dOffsetX;
                    rectangle.top += dOffsetY;

                    context.beginPath();

                    // Start the shape.
                    context.moveTo(rectangle.left + m_options.cornerRadius,
                        rectangle.top);

                    // Calculate the width of the tab.
                    var dEndCapWidth = m_options.eventTitleWidth + m_options.endCapWidth + m_options.plumSpacerWidth + (m_options.renderSplitterPlum ? 0 : 10);

                    // Only draw the little tab if not drawing a shadow.
                    if (dOffsetY === 0) {

                        context.arcTo(rectangle.left + rectangle.width - dEndCapWidth - 3,
                            rectangle.top,
                            rectangle.left + rectangle.width - dEndCapWidth - 3,
                            rectangle.top - 2 * m_options.cornerRadius,
                            m_options.cornerRadius);

                        context.lineTo(rectangle.left + rectangle.width - dEndCapWidth + m_options.cornerRadius,
                            rectangle.top);
                    }

                    // Draw over to just before the upper right corner.
                    context.lineTo(rectangle.left + rectangle.width - 4,
                        rectangle.top);

                    if (m_options.assetPool === undefined ||
                        m_options.assetPool === false) {

                        context.lineTo(rectangle.left + rectangle.width,
                            rectangle.top + 3);
                    } else {

                        context.lineTo(rectangle.left + rectangle.width,
                            rectangle.top);
                    }

                    // Draw down to the lower right corner.
                    context.lineTo(rectangle.left + rectangle.width,
                        rectangle.top + rectangle.height - 2 * m_options.cornerRadius);

                    // Draw the lower right corner.
                    context.arcTo(rectangle.left + rectangle.width,
                        rectangle.top + rectangle.height,
                        rectangle.left + rectangle.width - 2 * m_options.cornerRadius,
                        rectangle.top + rectangle.height,
                        m_options.cornerRadius);

                    // Move over to the lower left hand corner.
                    context.lineTo(rectangle.left + 2 * m_options.cornerRadius,
                        rectangle.top + rectangle.height);

                    // Draw the lower left corner.
                    context.arcTo(rectangle.left,
                        rectangle.top + rectangle.height,
                        rectangle.left,
                        rectangle.top + rectangle.height - 2 * m_options.cornerRadius,
                        m_options.cornerRadius);

                    // Draw the lower left corner.
                    context.arcTo(rectangle.left,
                        rectangle.top,
                        rectangle.left + 2 * m_options.cornerRadius,
                        rectangle.top,
                        m_options.cornerRadius);

                    // Now, just close the path.
                    context.closePath();

                    return null;
                } catch (e) {

                    return e;
                } finally {

                    rectangle.left -= dOffsetX;
                    rectangle.top -= dOffsetY;
                }
            }

            // Render flyout attached to parent with the label on the right end-cap.
            var m_functionRenderRight = function (context,
                rectangle,
                dOffsetX,
                dOffsetY) {

                try {

                    rectangle.left += dOffsetX;
                    rectangle.top += dOffsetY;

                    context.beginPath();

                    // Start the shape.
                    context.moveTo(rectangle.left + rectangle.width,
                        rectangle.top);

                    // Move up to do the outer curve filling merge.

                    // Only draw the little tab if not drawing a shadow.
                    context.lineTo(rectangle.left + rectangle.width,
                        rectangle.top - m_options.halfEventHeight);

                    // Cut back down, but stay attached so there is no gap along the bottom of the title.
                    context.lineTo(rectangle.left + rectangle.width - m_options.halfEventHeight,
                        rectangle.top);

                    if (m_options.assetPool === undefined ||
                        m_options.assetPool === false) {

                        context.lineTo(rectangle.left + rectangle.width - m_options.eventTitleWidth - m_options.endCapWidth - 2 * m_options.plumSpacerWidth,
                            rectangle.top);

                        // Drop down so now separate from the hash lines.
                        context.lineTo(rectangle.left + rectangle.width - m_options.eventTitleWidth - m_options.endCapWidth - 2 * m_options.plumSpacerWidth,
                            rectangle.top + m_options.dropHeight);
                    } else if (dOffsetY === 0) {

                        context.lineTo(rectangle.left + rectangle.width - m_options.eventTitleWidth - m_options.endCapWidth - m_options.plumSpacerWidth,
                            rectangle.top);

                        context.lineTo(rectangle.left + rectangle.width - m_options.eventTitleWidth - m_options.endCapWidth - m_options.plumSpacerWidth,
                            rectangle.top - m_options.endCapHeight + 0.5);

                        context.arcTo(rectangle.left + rectangle.width - m_options.eventTitleWidth - m_options.endCapWidth - m_options.plumSpacerWidth - 2 * m_options.cornerRadius,
                            rectangle.top - m_options.endCapHeight + 0.5,
                            rectangle.left + rectangle.width - m_options.eventTitleWidth - m_options.endCapWidth - m_options.plumSpacerWidth - 2 * m_options.cornerRadius,
                            rectangle.top - m_options.cornerRadius,
                            m_options.cornerRadius);

                        context.lineTo(rectangle.left + rectangle.width - m_options.eventTitleWidth - m_options.endCapWidth - m_options.plumSpacerWidth - 2 * m_options.cornerRadius,
                            rectangle.top - m_options.cornerRadius);

                        context.arcTo(rectangle.left + rectangle.width - m_options.eventTitleWidth - m_options.endCapWidth - m_options.plumSpacerWidth - 2 * m_options.cornerRadius,
                            rectangle.top,
                            rectangle.left + rectangle.width - m_options.eventTitleWidth - m_options.endCapWidth - m_options.plumSpacerWidth - 4 * m_options.cornerRadius,
                            rectangle.top,
                            m_options.cornerRadius);
                    }

                    // Draw over to just before the upper left corner.
                    context.lineTo(rectangle.left + 2 * m_options.cornerRadius,
                        rectangle.top + m_options.dropHeight);

                    // Now draw the upper left corner.
                    context.arcTo(rectangle.left,
                        rectangle.top,
                        rectangle.left,
                        rectangle.top + 2 * m_options.cornerRadius,
                        m_options.cornerRadius);

                    // Draw down to the lower right corner.
                    context.lineTo(rectangle.left,
                        rectangle.top + rectangle.height - 2 * m_options.cornerRadius);

                    // Draw the lower right corner.
                    context.arcTo(rectangle.left,
                        rectangle.top + rectangle.height,
                        rectangle.left + 2 * m_options.cornerRadius,
                        rectangle.top + rectangle.height,
                        m_options.cornerRadius);

                    // Move over to the lower left hand corner.
                    context.lineTo(rectangle.left + 2 * m_options.cornerRadius,
                        rectangle.top + rectangle.height);

                    // Draw the lower left corner.
                    context.arcTo(rectangle.left + rectangle.width,
                        rectangle.top + rectangle.height,
                        rectangle.left + rectangle.width,
                        rectangle.top + rectangle.height - 2 * m_options.cornerRadius,
                        m_options.cornerRadius);

                    // Now, just close the path.
                    context.closePath();

                    return null;
                } catch (e) {

                    return e;
                } finally {

                    rectangle.left -= dOffsetX;
                    rectangle.top -= dOffsetY;
                }
            }

            // Render flyout attached to parent with the label on the right, but where there is 
            // not enough room to fit the flyout on the screen and so it is flipped horizontally.
            var m_functionRenderRightFlip = function (context,
                rectangle,
                dOffsetX,
                dOffsetY) {

                try {

                    rectangle.left += dOffsetX;
                    rectangle.top += dOffsetY;

                    context.beginPath();

                    // Start the shape.
                    context.moveTo(rectangle.left,
                        rectangle.top);

                    // Calculate the width of the tab.
                    var dEndCapWidth = m_options.eventTitleWidth + m_options.endCapWidth + m_options.plumSpacerWidth;

                    // Only draw the little tab if not drawing a shadow.
                    if (dOffsetX === 0) {

                        context.arcTo(rectangle.left + dEndCapWidth,
                            rectangle.top,
                            rectangle.left + dEndCapWidth + 4,
                            rectangle.top - m_options.halfEventHeight,
                            m_options.cornerRadius);

                        context.lineTo(rectangle.left + dEndCapWidth + 3,
                            rectangle.top - m_options.halfEventHeight);
                        context.arcTo(rectangle.left + dEndCapWidth + 3,
                            rectangle.top,
                            rectangle.left + dEndCapWidth + 2 * m_options.cornerRadius + 3,
                            rectangle.top,
                            m_options.cornerRadius);
                    }

                    // Draw over to just before the upper right corner.
                    context.lineTo(rectangle.left + rectangle.width - 4,
                        rectangle.top);
                    context.lineTo(rectangle.left + rectangle.width,
                        rectangle.top + 3);

                    // Draw down to the lower right corner.
                    context.lineTo(rectangle.left + rectangle.width,
                        rectangle.top + rectangle.height - 2 * m_options.cornerRadius);

                    // Draw the lower right corner.
                    context.arcTo(rectangle.left + rectangle.width,
                        rectangle.top + rectangle.height,
                        rectangle.left + rectangle.width - 2 * m_options.cornerRadius,
                        rectangle.top + rectangle.height,
                        m_options.cornerRadius);

                    // Move over to the lower left hand corner.
                    context.lineTo(rectangle.left + 2 * m_options.cornerRadius,
                        rectangle.top + rectangle.height);

                    // Draw the lower left corner.
                    context.arcTo(rectangle.left,
                        rectangle.top + rectangle.height,
                        rectangle.left,
                        rectangle.top + rectangle.height - 2 * m_options.cornerRadius,
                        m_options.cornerRadius);

                    // Draw the lower left corner.
                    context.lineTo(rectangle.left,
                        rectangle.top);

                    // Now, just close the path.
                    context.closePath();

                    return null;
                } catch (e) {

                    return e;
                } finally {

                    rectangle.left -= dOffsetX;
                    rectangle.top -= dOffsetY;
                }
            }

            // Render flyout for parent that is fully off to the left of the visible window.
            var m_functionRenderOffToTheLeft = function (context,
                rectangle,
                dOffsetX,
                dOffsetY) {

                try {

                    rectangle.left += dOffsetX;
                    rectangle.top += dOffsetY;

                    context.beginPath();

                    // Start the shape.
                    context.moveTo(rectangle.left,
                        rectangle.top);

                    var dTabWidth = m_options.eventTitleWidth + m_options.endCapWidth + m_options.plumSpacerWidth
                    if (dOffsetX === 0) {

                        context.lineTo(rectangle.left + dTabWidth - 2 * m_options.cornerRadius + 3,
                            rectangle.top);

                        context.lineTo(rectangle.left + dTabWidth + 3,
                            rectangle.top - m_options.halfEventHeight);

                        context.arcTo(rectangle.left + dTabWidth + 3,
                            rectangle.top,
                            rectangle.left + dTabWidth + m_options.halfEventHeight + 3,
                            rectangle.top,
                            m_options.cornerRadius);
                    }
                    context.lineTo(rectangle.left + rectangle.width - 2 * m_options.cornerRadius,
                        rectangle.top);

                    context.arcTo(rectangle.left + rectangle.width,
                        rectangle.top,
                        rectangle.left + rectangle.width,
                        rectangle.top + 2 * m_options.cornerRadius,
                        m_options.cornerRadius);

                    // Move over to the lower left hand corner.
                    context.lineTo(rectangle.left + rectangle.width,
                        rectangle.top + rectangle.height - 2 * m_options.cornerRadius);

                    // Draw the lower left corner.
                    context.arcTo(rectangle.left + rectangle.width,
                        rectangle.top + rectangle.height,
                        rectangle.left + rectangle.width - 2 * m_options.cornerRadius,
                        rectangle.top + rectangle.height,
                        m_options.cornerRadius);

                    context.lineTo(rectangle.left,
                        rectangle.top + rectangle.height);

                    // Now, just close the path.
                    context.closePath();

                    return null;
                } catch (e) {

                    return e;
                } finally {

                    rectangle.left -= dOffsetX;
                    rectangle.top -= dOffsetY;
                }
            }

            // Render flyout for parent that is fully off to the right of the visible window.
            var m_functionRenderOffToTheRight = function (context,
                rectangle,
                dOffsetX,
                dOffsetY) {

                try {

                    rectangle.left += dOffsetX;
                    rectangle.top += dOffsetY;

                    context.beginPath();

                    // Start the shape.
                    context.moveTo(rectangle.left + m_options.cornerRadius,
                        rectangle.top);

                    var dTabWidth = m_options.eventTitleWidth + m_options.endCapWidth + m_options.plumSpacerWidth
                    if (dOffsetX === 0) {

                        context.arcTo(rectangle.left + rectangle.width - dTabWidth - 3,
                            rectangle.top,
                            rectangle.left + rectangle.width - dTabWidth - 3,
                            rectangle.top - m_options.cornerRadius,
                            m_options.cornerRadius);

                        // Cut back down, but stay attached so there is no gap along the bottom of the title.
                        context.lineTo(rectangle.left + rectangle.width - dTabWidth + m_options.cornerRadius - 3,
                            rectangle.top);
                    }
                    context.lineTo(rectangle.left + rectangle.width,
                        rectangle.top);

                    // Drop down so now separate from the hash lines.
                    context.lineTo(rectangle.left + rectangle.width,
                        rectangle.top + rectangle.height);

                    // Move over to the lower left hand corner.
                    context.lineTo(rectangle.left + 2 * m_options.cornerRadius,
                        rectangle.top + rectangle.height);

                    // Draw the lower left corner.
                    context.arcTo(rectangle.left,
                        rectangle.top + rectangle.height,
                        rectangle.left,
                        rectangle.top + rectangle.height - 2 * m_options.cornerRadius,
                        m_options.cornerRadius);

                    context.lineTo(rectangle.left,
                        rectangle.top + 2 * m_options.cornerRadius);

                    // Draw the upper left corner.
                    context.arcTo(rectangle.left,
                        rectangle.top,
                        rectangle.left + 2 * m_options.cornerRadius,
                        rectangle.top,
                        m_options.cornerRadius);

                    // Now, just close the path.
                    context.closePath();

                    return null;
                } catch (e) {

                    return e;
                } finally {

                    rectangle.left -= dOffsetX;
                    rectangle.top -= dOffsetY;
                }
            }

            ///////////////////////////////////////
            // Private fields.

            // Object state defines parameters for behavior of object.
            var m_options = {

                type: "Left",
                context: null,
                halfEventHeight: 13,
                dropHeight: 1,
                gapHeight: 15,
                titleHeight: 22,
                titleGridGapHeight: 10,
                rowHeight: 26,
                rowGapHeight: 2,
                data: [],
                listHeight: function () { return m_options.rowHeight * m_options.data.length; },
                halfGapHeight: 11,
                controlsHeight: 22,
                gapWidth: 14,
                gridWidth: 380,
                idWidth: 78,
                assetPoolIdWidth: 278,
                cellGapWidth: 2,
                cellPadding: 4,
                graphOddFill: "rgb(240,204,204)",
                graphEvenFill: "rgb(246,232,232)",
                amountWidth: 98,
                descriptionWidth: 200,
                eventTitleWidth: 80,
                endCapHeight: 20,
                eventTitleGapWidth: 20,
                cornerRadius: 10,
                backgroundColor: "#edbaba",
                endCapWidth: 12,
                plumSpacerWidth: 20,
                title: "",
                titleFont: "22px Helvetica",
                titleFill: "#333333",
                commandFont: "11px Arial",
                gridFont: "13px Helvetica",
                commandFill: "#666666",
                editPlumDetailsWidth: 110,
                editPlanDataGapWidth: 7,
                editPlanDataGapHeight: 0,
                editFont: "13px Helvetica",
                editFill: "#DDDDDD",
                editPlumDetailsFill: "rgb(146,72,99)",
                editPlumDetailsCornerRadius: 11,
                commandGapWidth: 10,
                regions: []                             // Collection of action regions set in render, checked against in mouseup.
            };

            // Allow constructor parameters to override the 
            // options object to enhance / customize behavior.
            m_options.inject(optionsOverride);
        };

        // Return function.
        return functionRet;
    });
