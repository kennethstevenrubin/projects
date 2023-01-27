////////////////////////////////////////////
// PlumPalette section.

"use strict";

define(["App/SectionBase",
    "App/PlumScroll"],
    function (SectionBase,
        PlumScroll) {

        // Constructor function to return.
        var functionRet = function SectionPlumPalette(optionsOverride) {

            var self = this;            // Uber-closure.

            // Inherit from SectionBase.
            self.inherits(SectionBase,
                optionsOverride);       // Pass constructor parameter to base class.

            /////////////////////////////////////////
            // Public events.

            // Define events raised by self component.
            self.onDeleteClick = null;
            self.onShareClick = null;
            self.onCopyClick = null;
            self.onPropertiesClick = null;
            self.onPrintClick = null;
            self.onAddPlanClick = null;
            //self.onNewGoalClick = null;
            self.onPlanComboSelectionChange = null;

            /////////////////////////////////////////
            // Override methods.

            // Render out self specific data
            self.innerRender = function (contextRender) {

                try {

                    // Just return immediately if not visible.
                    if (self.options.plumPalette.visible === false) {

                        return null;
                    }

                    var rectangle = self.options.rectangleSection;

                    // Save off state in case a render must be called by an event handler.
                    self.options.lastRenderContext = contextRender;

                    // Color background.
                    contextRender.fillStyle = self.options.plumPalette.backgroundFillStyle;
                    contextRender.fillRect(rectangle.left,
                        rectangle.top,
                        rectangle.width,
                        rectangle.height);

                    // Get the plan name that will fit in the space for it.
                    var strUsePlanName = self.fitStringToWidth(self.options.planName,
                        self.options.plumPalette.fontPlanCombo,
                        self.options.comboButtonLeft - 10);

                    // Render out the plan name.
                    contextRender.font = self.options.plumPalette.fontPlanCombo;
                    contextRender.textBaseline = "top";
                    contextRender.textAlign = "left";
                    contextRender.fillStyle = self.options.plumPalette.fillPlanComboText;
                    contextRender.fillText(strUsePlanName,
                        rectangle.left + self.options.plumPalette.paddingPlanComboTextLeft,
                        rectangle.top + self.options.plumPalette.paddingPlanComboTextTop);

                    // Set the right most point of the plan name.
                    self.options.leftMarginAfterPlanName = rectangle.left +
                        self.options.plumPalette.paddingPlanComboTextLeft +
                        self.options.planName.size(contextRender.font).width;

                    // Now the buttons.
                    var dXCursor = rectangle.left + self.options.plumPalette.paddingFunctionTextLeft;
                    var dY = rectangle.top + self.options.plumPalette.paddingFunctionTextTop;

                    contextRender.font = self.options.plumPalette.fontFunctions;

                    // Reset object regions.
                    m_objectCommandToRegion = {

                    };

                    contextRender.fillStyle = "#ffcccc";
                    ///////////////////////////////////////
                    // Delete.
                    var bDown = (self.options.commandDown === "Delete");

                    contextRender.font = self.options.plumPalette.fontFunctionsIn;
                    var sizeCommand = contextRender.measureText("Delete");
                    if (self.options.pointInCommand !== "Delete") {

                        contextRender.font = self.options.plumPalette.fontFunctions;
                    }
                    contextRender.fillText("Delete",
                        dXCursor,
                        dY + (bDown ? self.options.plumPalette.downDeltaY : 0));
                    m_objectCommandToRegion["Delete"] = {

                        left: dXCursor,
                        top: dY + (bDown ? self.options.plumPalette.downDeltaY : 0),
                        width: sizeCommand.width,
                        height: parseFloat(contextRender.font)
                    };
                    dXCursor += sizeCommand.width + self.options.plumPalette.paddingFunction;
                    contextRender.font = self.options.plumPalette.fontFunctions;
                    contextRender.fillText("|",
                        dXCursor,
                        dY);
                    dXCursor += contextRender.measureText("|").width + self.options.plumPalette.paddingFunction;

                    ///////////////////////////////////////
                    // Properties.
                    bDown = (self.options.commandDown === "Properties");

                    contextRender.font = self.options.plumPalette.fontFunctionsIn;
                    sizeCommand = contextRender.measureText("Properties");
                    if (self.options.pointInCommand !== "Properties") {

                        contextRender.font = self.options.plumPalette.fontFunctions;
                    }
                    contextRender.fillText("Properties",
                        dXCursor,
                        dY + (bDown ? self.options.plumPalette.downDeltaY : 0));
                    m_objectCommandToRegion["Properties"] = {

                        left: dXCursor,
                        top: dY + (bDown ? self.options.plumPalette.downDeltaY : 0),
                        width: sizeCommand.width,
                        height: parseFloat(contextRender.font)
                    };
                    dXCursor += sizeCommand.width + self.options.plumPalette.paddingFunction;
                    contextRender.font = self.options.plumPalette.fontFunctions;
                    contextRender.fillText("|",
                        dXCursor,
                        dY);
                    dXCursor += contextRender.measureText("|").width + self.options.plumPalette.paddingFunction;

                    ///////////////////////////////////////
                    // Copy.
                    var bDown = (self.options.commandDown === "Copy");

                    contextRender.font = self.options.plumPalette.fontFunctionsIn;
                    sizeCommand = contextRender.measureText("Copy");
                    if (self.options.pointInCommand !== "Copy") {

                        contextRender.font = self.options.plumPalette.fontFunctions;
                    }
                    contextRender.fillText("Copy",
                        dXCursor,
                        dY + (bDown ? self.options.plumPalette.downDeltaY : 0));
                    m_objectCommandToRegion["Copy"] = {

                        left: dXCursor,
                        top: dY + (bDown ? self.options.plumPalette.downDeltaY : 0),
                        width: sizeCommand.width,
                        height: parseFloat(contextRender.font)
                    };
                    dXCursor += sizeCommand.width + self.options.plumPalette.paddingFunction;
                    contextRender.font = self.options.plumPalette.fontFunctions;
                    contextRender.fillText("|",
                        dXCursor,
                        dY);
                    dXCursor += contextRender.measureText("|").width + self.options.plumPalette.paddingFunction;

                    ///////////////////////////////////////
                    // Share.
                    var bDown = (self.options.commandDown === "Share");

                    contextRender.font = self.options.plumPalette.fontFunctionsIn;
                    sizeCommand = contextRender.measureText("Share");
                    if (self.options.pointInCommand !== "Share") {

                        contextRender.font = self.options.plumPalette.fontFunctions;
                    }
                    contextRender.fillText("Share",
                        dXCursor,
                        dY + (bDown ? self.options.plumPalette.downDeltaY : 0));
                    m_objectCommandToRegion["Share"] = {

                        left: dXCursor,
                        top: dY + (bDown ? self.options.plumPalette.downDeltaY : 0),
                        width: sizeCommand.width,
                        height: parseFloat(contextRender.font)
                    };
                    dXCursor += sizeCommand.width + self.options.plumPalette.paddingFunction;
                    contextRender.font = self.options.plumPalette.fontFunctions;
                    contextRender.fillText("|",
                        dXCursor,
                        dY);
                    dXCursor += contextRender.measureText("|").width + self.options.plumPalette.paddingFunction;

                    ///////////////////////////////////////
                    // Print.
                    var bDown = (self.options.commandDown === "Print");

                    contextRender.font = self.options.plumPalette.fontFunctionsIn;
                    sizeCommand = contextRender.measureText("Print");
                    if (self.options.pointInCommand !== "Print") {

                        contextRender.font = self.options.plumPalette.fontFunctions;
                    }
                    contextRender.fillText("Print",
                        dXCursor,
                        dY + (bDown ? self.options.plumPalette.downDeltaY : 0));
                    m_objectCommandToRegion["Print"] = {

                        left: dXCursor,
                        top: dY + (bDown ? self.options.plumPalette.downDeltaY : 0),
                        width: sizeCommand.width,
                        height: parseFloat(contextRender.font)
                    };
                    dXCursor += contextRender.measureText("Print").width + self.options.plumPalette.paddingFunction;

                    // Create the plum scroll.
                    var exceptionRet = m_plumScroll.create(contextRender, {

                            left: self.options.plumPalette.plumScrollLeft,
                            top: self.options.plumPalette.plumScrollTop,
                            width: rectangle.width - self.options.plumPalette.plumScrollLeft,
                            height: self.options.plumPalette.plumScrollHeight
                        },
                        self.options.dashboard);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Render out the combo button.
                    exceptionRet = m_functionRenderComboButton(contextRender,
                        false);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Draw the add plan button.
                    exceptionRet = m_functionRenderAddPlanButton(contextRender,
                        false);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Render the combo--if visible
                    if (self.options.comboVisible) {

                        exceptionRet = m_functionRenderCombo(contextRender);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    }

                    return null;
                    /* Render out the new goal plum.
                    return m_plumScroll.renderShadedPlum(contextRender,
                        rectangle.width - self.options.plumPalette.plumScrollSpacer,
                        self.options.plumPalette.plumScrollTop + (self.options.newGoalDown ? self.options.plumPalette.downDeltaY : 0),
                        "NewGoal",
                        false,
                        self.options.pointInNewGoalPlum);*/
                } catch (e) {

                    return e;
                }
            };

            // Override mouse down to handle here.
            self.onMouseDown = function (e) {

                try {

                    // Hide the combo.
                    if (self.options.comboVisible) {

                        // Test if the cursor is in a combo selection.
                        if (self.options.pointInComboSelection !== null) {

                            // Has to be a change.
                            if (self.options.pointInComboSelection !== self.options.planName) {

                                // Set plan name.
                                self.options.planName = self.options.pointInComboSelection;

                                // Find the plan that matches the name.
                                var planToBroadcast = null;
                                for (var i = 0; i < self.options.plumPalette.plans.length; i++) {

                                    var planIth = self.options.plumPalette.plans[i];

                                    if (planIth.planName === self.options.planName) {

                                        planToBroadcast = planIth;
                                        break;
                                    }
                                }

                                // Raise event, if hooked.
                                if ($.isFunction(self.onPlanComboSelectionChange)) {

                                    self.onPlanComboSelectionChange(planToBroadcast);
                                }

                                // Indicate to the dashboard that the combo box handled the mouse down.
                                var exceptionRet = self.options.dashboard.comboMouseDown();
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }

                                /* Also inform the dashboard of this change.
                                exceptionRet = self.options.dashboard.updateDisplayedSegment(planToBroadcast);
                                if (exceptionRet !== null) {

                                    throw exceptionRet;
                                }*/
                            }
                        }

                        // Hide it.
                        self.options.comboVisible = false;

                        // Remember that the mouse was clicked whilst the combo was visible so 
                        // that the mouse up can ignore the up over the combo drop down button.
                        self.options.downInComboVisible = true;
                    } else {

                        // Normal mouse down.
                        self.options.downInComboVisible = false;
                    }

                    // Set state.
                    if (self.options.downInComboVisible === false) {

                        self.options.addPlanButtonDown = self.options.pointInAddPlanButton;
                        self.options.comboButtonDown = self.options.pointInComboButton;
                        self.options.commandDown = self.options.pointInCommand;
                        //self.options.newGoalDown = self.options.pointInNewGoalPlum;
                        self.options.plumMouseDownData = m_plumScroll.getMouseInData();
                        if (self.options.plumMouseDownData !== undefined &&
                            self.options.plumMouseDownData !== null &&
                            self.options.nowIn) {

                            self.options.plumMouseDownData.downPoint = {

                                x: e.offsetX,
                                y: e.offsetY
                            };
                            
                            // Just cause the whole background to be saved....
                            exceptionRet = self.options.dashboard.captureSnapshot();
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

            // Override mouse up to handle here.
            self.onMouseUp = function (e) {

                try {

                    // Possibly raise click events:
                    if (self.options.addPlanButtonDown &&
                        $.isFunction(self.onAddPlanClick)) {

                        self.onAddPlanClick(e);
                    }
/*                    if (self.options.newGoalDown &&
                        $.isFunction(self.onNewGoalClick)) {

                        e.section = "D";

                        self.onNewGoalClick(e);
                    }
  */                  if (self.options.commandDown === "Delete" &&
                        $.isFunction(self.onDeleteClick)) {

                        self.onDeleteClick(e);
                    }
                    if (self.options.commandDown === "Share" &&
                        $.isFunction(self.onShareClick)) {

                        self.onShareClick(e);
                    }
                    if (self.options.commandDown === "Copy" &&
                        $.isFunction(self.onCopyClick)) {

                        self.onCopyClick(e);
                    }
                    if (self.options.commandDown === "Properties" &&
                        $.isFunction(self.onPropertiesClick)) {

                        self.onPropertiesClick(e);
                    }
                    if (self.options.commandDown === "Print" &&
                        $.isFunction(self.onPrintClick)) {

                        self.onPrintClick(e);
                    }
                    if (self.options.comboButtonDown &&
                        self.options.downInComboVisible !== true) {

                        // Make the combo visible.
                        self.options.comboVisible = true;
                    }

                    // Render out the drag plum.
                    if (self.options.plumMouseDownData !== undefined &&
                        self.options.plumMouseDownData !== null &&
                        self.options.plumMouseDownData.dragPoint !== undefined &&
                        self.options.plumMouseDownData.dragPoint !== null) {

                        // If cursor is within dreams and goals, then raise the plum drag event.
                        if (self.options.dashboard.isMouseWithinDreamsAndGoals(e)) {

                            if ($.isFunction(self.onNewGoalClick)) {

                                // Get the date 
                                var dateX = self.options.dashboard.getDateFromX(e.offsetX);

                                e.startDate = dateX;
                                e.section = "D";
                                e.plumType = self.options.plumMouseDownData.url;

                                self.onNewGoalClick(e);
                            }
                        }
                    }

                    // Clear state.
                    self.options.addPlanButtonDown = false;
                    self.options.comboButtonDown = false;
                    self.options.commandDown = false;
                    //self.options.newGoalDown = false;
                    self.options.plumMouseDownData = null;
//                    m_plumScroll.clearPlumMouseDownData();

                    self.options.pointInComboSelection = null;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Override mouse out to handle here.
            self.onMouseOut = function (e) {

                try {

                    // Don't "really" process out until cursor is outside of canvas.
                    if (e.offsetX >= 0 &&
                        e.offsetX < self.options.dashboard.width &&
                        e.offsetY >= 0 &&
                        e.offsetY < self.options.dashboard.height) {

                        return null;
                    }

                    // Clear state.
                    self.options.addPlanButtonDown = false;
                    self.options.comboButtonDown = false;
                    self.options.commandDown = false;
                    //self.options.newGoalDown = false;
                    self.options.plumMouseDownData = null;
                    //m_plumScroll.clearPlumMouseDownData();

                    //self.options.pointInNewGoalPlum = false;
                    self.options.pointInAddPlanButton = false;
                    self.options.pointInComboButton = false;
                    self.options.pointInCommand = false;

                    self.options.pointInComboSelection = null;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Override mouse move to handle here.
            self.onMouseMove = function (e) {

                try {

                    // Do nothing if invisible.
                    if (self.isVisible === false) {

                        return null;
                    }
                    
                    var exceptionRet = null;

                    // Save the last in-out evaluation.
                    var bLastIn = true;
                    if (self.options.nowIn !== undefined &&
                        self.options.nowIn !== null) {

                        bLastIn = self.options.nowIn;
                    }

                    // Determine if the cursor is still in this section.
                    self.options.nowIn = (e.offsetX >= self.options.rectangleSection.left &&
                        e.offsetY >= self.options.rectangleSection.top &&
                        e.offsetX < self.options.rectangleSection.left + self.options.rectangleSection.width &&
                        e.offsetY < self.options.rectangleSection.top + self.options.rectangleSection.height);

                    // First, handle combo, if open.
                    self.options.pointInComboSelection = null;
                    if (self.options.comboVisible) {

                        // Find out if the mouse is over any of the regions.
                        for (var key in self.options.comboSelections) {

                            var rectangle = self.options.comboSelections[key];
                            var dX = e.offsetX;
                            var dY = e.offsetY;

                            if (dX >= rectangle.left &&
                                dX < rectangle.left + rectangle.width &&
                                dY >= rectangle.top &&
                                dY < rectangle.top + rectangle.height) {

                                self.options.pointInComboSelection = key;
                            }
                        }
                    }

                    /* Test for mouse cursor in new goal plum.
                    var bDown = self.options.newGoalDown;
                    var exceptionRet = m_plumScroll.renderShadedPlum(self.options.lastRenderContext,
                        self.options.rectangleSection.width - self.options.plumPalette.plumScrollSpacer,
                        self.options.plumPalette.plumScrollTop + (bDown ? self.options.plumPalette.downDeltaY : 0),
                        "NewGoal",
                        true);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                    self.options.pointInNewGoalPlum = self.options.lastRenderContext.isPointInPath(e.offsetX,
                        e.offsetY);*/

                    // Test for the commands.
                    self.options.pointInCommand = null;
                    for (var key in m_objectCommandToRegion) {

                        var rectangleCommand = m_objectCommandToRegion[key];
                        if (e.offsetX >= rectangleCommand.left &&
                            e.offsetX < rectangleCommand.left + rectangleCommand.width &&
                            e.offsetY >= rectangleCommand.top &&
                            e.offsetY < rectangleCommand.top + rectangleCommand.height) {

                            var exceptionRet = self.options.dashboard.setCursor("pointer");
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                            self.options.pointInCommand = key;
                        }
                    }

                    // Test for combo button.
                    exceptionRet = m_functionRenderComboButton(self.options.lastRenderContext,
                        true);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                    self.options.pointInComboButton = self.options.lastRenderContext.isPointInPath(e.offsetX,
                        e.offsetY);

                    // Draw the add plan button.
                    exceptionRet = m_functionRenderAddPlanButton(self.options.lastRenderContext,
                        true);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                    self.options.pointInAddPlanButton = self.options.lastRenderContext.isPointInPath(e.offsetX,
                        e.offsetY);

                    // Test for dragging 
                    if (self.options.plumMouseDownData !== undefined &&
                        self.options.plumMouseDownData !== null &&
                        m_plumScroll.isPointInEastButton() === false &&
                        m_plumScroll.isPointInWestButton() === false) {

                        self.options.plumMouseDownData.dragPoint = {
                                
                            x: e.offsetX,
                            y: e.offsetY
                        };
                    }

                    // Render out the drag plum.
                    if (self.options.plumMouseDownData !== undefined &&
                        self.options.plumMouseDownData !== null &&
                        self.options.plumMouseDownData.dragPoint !== undefined &&
                        self.options.plumMouseDownData.dragPoint !== null &&
                        self.options.plumMouseDownData.downPoint !== undefined &&
                        self.options.plumMouseDownData.downPoint !== null) {

                        /* Replace the background.
                        if (self.options.backgroundContext === undefined ||
                            self.options.backgroundContext === null) {

                            // Allocate first time.
                            self.options.backgroundCanavs = $("<canvas style='width:100px;height:110px'></canvas>")[0];
                            self.options.backgroundCanavs.width = 100;
                            self.options.backgroundCanavs.height = 110;
                            self.options.backgroundContext = self.options.backgroundCanavs.getContext("2d");
                        } else {

                            // Draw the saved background.
                            self.options.lastRenderContext.drawImage(self.options.backgroundCanavs,
                                0,
                                0,
                                100,
                                110,
                                self.options.dragPlumLeft - 5,
                                self.options.dragPlumTop - 5,
                                100,
                                110);
                        }*/

                        // Calculate how much the cursor has moved.
                        var dDX = self.options.plumMouseDownData.dragPoint.x -
                            self.options.plumMouseDownData.downPoint.x
                        var dDY = self.options.plumMouseDownData.dragPoint.y -
                            self.options.plumMouseDownData.downPoint.y

                        // Set this data in the plum scroll--not exactly sure why...this 
                        // tells the plum scroll when it has to render the drag-plum.
                        //m_plumScroll.setPlumMouseDownData(self.options.plumMouseDownData);

                        // Save the location.
                        self.options.dragPlumLeft = self.options.plumMouseDownData.left + dDX;
                        self.options.dragPlumTop = self.options.plumMouseDownData.top + dDY;
                        if (self.options.dragPlumLeft < 5) {

                            self.options.dragPlumLeft = 5;
                        }
                        if (self.options.dragPlumTop < 5) {

                            self.options.dragPlumTop = 5;
                        }

                        /* Copy to background canvas.
                        self.options.backgroundContext.drawImage(self.options.lastRenderContext.canvas,
                            self.options.dragPlumLeft - 5,
                            self.options.dragPlumTop - 5,
                            100,
                            110,
                            0,
                            0,
                            100,
                            110);*/
                        
                        // Just cause the whole background to be overlaid....
                        exceptionRet = self.options.dashboard.renderSnapshot();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // Render the dragging plum.
                        exceptionRet = m_plumScroll.renderShadedPlum(self.options.lastRenderContext,
                            self.options.dragPlumLeft,
                            self.options.dragPlumTop,
                            self.options.plumMouseDownData.url,
                            false,
                            true);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }

                        // If the last time was in and now out, then there is a 
                        // possibility that the last plum the cursor was over will 
                        // be deflated after the last good picture of it is taken.
                        // If that is the case, then redraw everything again without 
                        // any dragging plum and take the image again.  This will 
                        /* allow all states to be cleared out for the next mouse move.
                        if (bLastIn === true &&
                            self.options.nowIn === false) {

                            // Clear out plum.
                            exceptionRet = m_plumScroll.clearPlumMouseDownData();
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            // Cause a complete redraw.
                            exceptionRet = self.options.dashboard.forceRender();
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            // Copy to background canvas.
                            self.options.backgroundContext.drawImage(self.options.lastRenderContext.canvas,
                                self.options.dragPlumLeft - 5,
                                self.options.dragPlumTop - 5,
                                100,
                                110,
                                0,
                                0,
                                100,
                                110);

                            // Restore the mouse-down data.
                            m_plumScroll.setPlumMouseDownData(self.options.plumMouseDownData);
                        }*/
                    }

                    // Do not mess with the mouse cursor if the drop-down is visible.
                    if (self.options.comboVisible) {
 
                        exceptionRet = self.options.dashboard.setCursor();
                        if (exceptionRet !== null) {
 
                            throw exceptionRet;
                        }
                    }

                    return null;
                    
                } catch (e) {

                    return e;
                }
            };

            /////////////////////////////////////////
            // Override properties.

            // Return the height required by the section.
            self.getHeight = function () {

                // Just return 0 if invisible.
                if (self.isVisible() === false) {

                    return 0;
                }
                return self.options.plumPalette.height;
            };

            // Return bool indicating visibility of Section.
            self.isVisible = function () {

                return self.options.plumPalette.visible;
            };

            /////////////////////////////////////////
            // Private methods.

            // Draw the add plan button.
            var m_functionRenderAddPlanButton = function (contextRender,
                bPathOnly) {

                try {

                    if (bPathOnly === undefined) {

                        bPathOnly = false;
                    }

                    // Draw the add plan button.
                    var bSelected = self.options.pointInAddPlanButton;
                    var bDown = self.options.addPlanButtonDown;

                    var dAddPlanLeft = self.options.addPlanButtonLeft - (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0);
                    var dAddPlanTop = self.options.plumPalette.addPlan.top -
                        (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0) +
                        (bDown ? self.options.plumPalette.downDeltaY : 0);
                    var dAddPlanCurveWidth = self.options.plumPalette.addPlan.curveWidth + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0);
                    var dAddPlanStraightWidth = self.options.plumPalette.addPlan.straightWidth + (bSelected ? self.options.plumPalette.selectedDelta : 0);
                    var dAddPlanOverallWidth = self.options.plumPalette.addPlan.overallWidth + (bSelected ? self.options.plumPalette.selectedDelta : 0);
                    var dAddPlanHeight = self.options.plumPalette.addPlan.height + (bSelected ? self.options.plumPalette.selectedDelta : 0);

                    contextRender.fillStyle = self.options.plumPalette.addPlan.fillStyle;
                    contextRender.beginPath();
                    contextRender.moveTo(dAddPlanLeft + dAddPlanCurveWidth,
                        dAddPlanTop + dAddPlanHeight);
                    contextRender.bezierCurveTo(dAddPlanLeft,
                        dAddPlanTop + dAddPlanHeight,
                        dAddPlanLeft,
                        dAddPlanTop,
                        dAddPlanLeft + dAddPlanCurveWidth,
                        dAddPlanTop);
                    contextRender.lineTo(dAddPlanLeft + dAddPlanStraightWidth,
                        dAddPlanTop);
                    contextRender.bezierCurveTo(dAddPlanLeft + dAddPlanOverallWidth,
                        dAddPlanTop,
                        dAddPlanLeft + dAddPlanOverallWidth,
                        dAddPlanTop + dAddPlanHeight,
                        dAddPlanLeft + dAddPlanStraightWidth,
                        dAddPlanTop + dAddPlanHeight);
                    contextRender.lineTo(dAddPlanLeft + dAddPlanCurveWidth,
                        dAddPlanTop + dAddPlanHeight);
                    contextRender.closePath();

                    if (bPathOnly === false) {

                        contextRender.fill();

                        // Now draw the plus.
                        contextRender.lineWidth = self.options.plumPalette.addPlan.plus.lineWidth;
                        contextRender.strokeStyle = self.options.plumPalette.addPlan.plus.strokeStyle;
                        contextRender.beginPath();
                        contextRender.moveTo(dAddPlanLeft + self.options.plumPalette.addPlan.plus.middleAcross + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0),
                            dAddPlanTop + self.options.plumPalette.addPlan.plus.nearDown + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0));
                        contextRender.lineTo(dAddPlanLeft + self.options.plumPalette.addPlan.plus.middleAcross + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0),
                            dAddPlanTop + self.options.plumPalette.addPlan.plus.farDown + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0));
                        contextRender.moveTo(dAddPlanLeft + self.options.plumPalette.addPlan.plus.nearAcross + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0),
                            dAddPlanTop + self.options.plumPalette.addPlan.plus.middleDown + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0));
                        contextRender.lineTo(dAddPlanLeft + self.options.plumPalette.addPlan.plus.farAcross + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0),
                            dAddPlanTop + self.options.plumPalette.addPlan.plus.middleDown + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0));
                        contextRender.stroke();

                        // Reset.
                        contextRender.lineWidth = 1;
                    }
                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Draw combo button.
            var m_functionRenderComboButton = function (contextRender,
                bPathOnly,
                bSquareBottomRight) {

                try {

                    // Condition input.
                    if (bSquareBottomRight === undefined) {

                        bSquareBottomRight = false;
                    }

                    // Draw the combo button.
                    var bSelected = self.options.pointInComboButton;
                    var bDown = self.options.comboButtonDown;

                    var dComboButtonLeft = self.options.comboButtonLeft -
                        (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0);
                    var dComboButtonTop = self.options.plumPalette.comboButton.top -
                        (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0) +
                        (bDown ? self.options.plumPalette.downDeltaY : 0);
                    var dComboButtonStraightWidth = self.options.plumPalette.comboButton.straightWidth +
                        (bSelected ? self.options.plumPalette.selectedDelta : 0);
                    var dComboButtonOverallWidth = self.options.plumPalette.comboButton.overallWidth +
                        (bSelected ? self.options.plumPalette.selectedDelta : 0);
                    var dComboButtonHeight = self.options.plumPalette.comboButton.height +
                        (bSelected ? self.options.plumPalette.selectedDelta : 0);

                    contextRender.fillStyle = self.options.plumPalette.comboButton.fillStyle;
                    contextRender.beginPath();
                    contextRender.moveTo(dComboButtonLeft,
                        dComboButtonTop);
                    contextRender.lineTo(dComboButtonLeft + dComboButtonStraightWidth,
                        dComboButtonTop);

                    if (bSquareBottomRight === false) {

                        contextRender.bezierCurveTo(dComboButtonLeft + dComboButtonOverallWidth,
                            dComboButtonTop,
                            dComboButtonLeft + dComboButtonOverallWidth,
                            dComboButtonTop + dComboButtonHeight,
                            dComboButtonLeft + dComboButtonStraightWidth,
                            dComboButtonTop + dComboButtonHeight);
                    } else {

                        contextRender.bezierCurveTo(dComboButtonLeft +
                                dComboButtonOverallWidth -
                                self.options.plumPalette.comboButton.squareBottomRightAdjustment,
                            dComboButtonTop,
                            dComboButtonLeft +
                                dComboButtonOverallWidth -
                                self.options.plumPalette.comboButton.squareBottomRightAdjustment,
                            dComboButtonTop +
                                dComboButtonHeight / self.options.plumPalette.comboButton.squareBottomRightAdjustment,
                            dComboButtonLeft +
                                dComboButtonOverallWidth -
                                self.options.plumPalette.comboButton.squareBottomRightAdjustment,
                            dComboButtonTop +
                                dComboButtonHeight);
                    }

                    contextRender.lineTo(dComboButtonLeft,
                        dComboButtonTop + dComboButtonHeight);
                    contextRender.closePath();

                    // Only draw stuff if not path only.
                    if (bPathOnly === false) {

                        contextRender.fill();

                        // Now draw the white down arrow.
                        // Also switch on squareness.  self time implying drop-down open.
                        if (bSquareBottomRight === false) {

                            // Closed.
                            contextRender.fillStyle = self.options.plumPalette.comboButton.downArrow.strokeStyle;
                            contextRender.beginPath();
                            contextRender.moveTo(dComboButtonLeft + self.options.plumPalette.comboButton.downArrow.nearAcross + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0),
                                dComboButtonTop + self.options.plumPalette.comboButton.downArrow.nearDown + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0));
                            contextRender.lineTo(dComboButtonLeft + self.options.plumPalette.comboButton.downArrow.farAcross + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0),
                                dComboButtonTop + self.options.plumPalette.comboButton.downArrow.nearDown + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0));
                            contextRender.lineTo(dComboButtonLeft + self.options.plumPalette.comboButton.downArrow.middleAcross + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0),
                                dComboButtonTop + self.options.plumPalette.comboButton.downArrow.farDown + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0));
                            contextRender.closePath();
                            contextRender.fill();
                        } else {

                            // Open.
                            contextRender.fillStyle = self.options.plumPalette.comboButton.downArrow.strokeStyle;
                            contextRender.beginPath();
                            contextRender.moveTo(dComboButtonLeft + self.options.plumPalette.comboButton.downArrow.nearAcross + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0),
                                dComboButtonTop + self.options.plumPalette.comboButton.downArrow.farDown + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0));
                            contextRender.lineTo(dComboButtonLeft + self.options.plumPalette.comboButton.downArrow.farAcross + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0),
                                dComboButtonTop + self.options.plumPalette.comboButton.downArrow.farDown + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0));
                            contextRender.lineTo(dComboButtonLeft + self.options.plumPalette.comboButton.downArrow.middleAcross + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0),
                                dComboButtonTop + self.options.plumPalette.comboButton.downArrow.nearDown + (bSelected ? self.options.plumPalette.selectedDeltaHalf : 0));
                            contextRender.closePath();
                            contextRender.fill();
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Draw combo button.
            var m_functionRenderCombo = function (contextRender) {

                try {

                    // Draw the combo:

                    // First the text cell.
                    var rectangleText = {

                        left: self.options.rectangleSection.left + self.options.plumPalette.combo.textAdjustment.left,
                        top: self.options.rectangleSection.top + self.options.plumPalette.paddingPlanComboTextTop + self.options.plumPalette.combo.textAdjustment.top,
                        width: self.options.comboButtonLeft - self.options.rectangleSection.left - self.options.plumPalette.combo.textAdjustment.width,
                        height: self.options.plumPalette.combo.textAdjustment.height
                    };

                    var context = self.options.lastRenderContext;
                    context.lineWidth = self.options.plumPalette.combo.lineWidth;
                    context.strokeStyle = self.options.plumPalette.combo.strokeDropDown;
                    context.fillStyle = self.options.plumPalette.combo.fillDropDown;
                    context.beginPath();

                    context.moveTo(rectangleText.left,
                        rectangleText.top + rectangleText.height);
                    context.lineTo(rectangleText.left,
                        rectangleText.top);
                    context.lineTo(rectangleText.left + rectangleText.width,
                        rectangleText.top);
                    context.lineTo(rectangleText.left + rectangleText.width,
                        rectangleText.top + rectangleText.height);
                    context.stroke();
                    context.closePath();
                    context.fill();

                    // Get the text to use for the plan name.
                    var strUsePlanName = self.fitStringToWidth(self.options.planName,
                        self.options.plumPalette.combo.fontSelectedText,
                        rectangleText.width - 20);

                    // 6,10  Render out the text.
                    context.fillStyle = self.options.plumPalette.combo.fillSelectedText;
                    context.font = self.options.plumPalette.combo.fontSelectedText;
                    context.textBaseline = self.options.plumPalette.combo.baselineSelectedText;
                    context.fillText(strUsePlanName,
                        rectangleText.left + self.options.plumPalette.combo.marginLeftSelectedText,
                        rectangleText.top + self.options.plumPalette.combo.marginTopSelectedText);

                    // Build the list of plan names.
                    var arrayPlanNames = [];
                    for (var i = 0; i < self.options.plumPalette.plans.length; i++) {

                        // Get the ith plan
                        var planIth = self.options.plumPalette.plans[i];
                        arrayPlanNames.push(planIth.planName);
                    }

                    // Always show in sorted order.
                    arrayPlanNames.sort();

                    // Calculate the width of the dropdown.
                    var dDropDownWidth = self.options.plumPalette.combo.dropDown.width;
                    // Test each plan.
                    for (var i = 0; i < arrayPlanNames.length; i++) {

                        var strPlanNameIth = arrayPlanNames[i];
                        var dPlanWidth = strPlanNameIth.size(self.options.plumPalette.combo.dropDown.fontText).width + 2 * self.options.plumPalette.combo.marginLeftSelectedText;
                        if (dPlanWidth > dDropDownWidth) {

                            dDropDownWidth = dPlanWidth;
                        }
                    }

                    // Then the drop-down.
                    var rectangleDropDown = {

                        left: self.options.rectangleSection.left +
                            self.options.plumPalette.combo.dropDown.adjustmentLeft,
                        top: rectangleText.top + rectangleText.height,
                        width: dDropDownWidth,
                        height: self.options.plumPalette.plans.length * self.options.plumPalette.combo.dropDown.heightRow +
                            self.options.plumPalette.combo.dropDown.paddingHeight
                    };

                    context.strokeStyle = self.options.plumPalette.combo.strokeDropDown;
                    context.fillStyle = self.options.plumPalette.combo.fillDropDown;
                    context.beginPath();

                    context.moveTo(rectangleDropDown.left,
                        rectangleDropDown.top);
                    context.lineTo(rectangleDropDown.left,
                        rectangleDropDown.top + rectangleDropDown.height);
                    context.lineTo(rectangleDropDown.left + rectangleDropDown.width,
                        rectangleDropDown.top + rectangleDropDown.height);
                    context.lineTo(rectangleDropDown.left + rectangleDropDown.width,
                        rectangleDropDown.top);
                    context.lineTo(rectangleDropDown.left + rectangleText.width,
                        rectangleDropDown.top);
                    context.stroke();
                    context.closePath();
                    context.fill();

                    // Reset line width.
                    context.lineWidth = 1;

                    // Each of the plans.  Highlight the selected plan.
                    context.fillStyle = self.options.plumPalette.combo.dropDown.fillText;
                    context.font = self.options.plumPalette.combo.dropDown.fontText;
                    for (var i = 0; i < arrayPlanNames.length; i++) {

                        // Get the ith plan
                        var strPlan = arrayPlanNames[i];

                        if (strPlan === self.options.planName) {

                            context.fillStyle = self.options.plumPalette.combo.dropDown.fillSelection;
                            context.fillRect(rectangleDropDown.left,
                                rectangleDropDown.top + self.options.plumPalette.combo.dropDown.adjustmentLeft +
                                    i * self.options.plumPalette.combo.dropDown.heightRow,
                                rectangleDropDown.width,
                                self.options.plumPalette.combo.dropDown.heightRow);
                            context.fillStyle = self.options.plumPalette.combo.dropDown.fillText;
                        }
                        if (strPlan === self.options.pointInComboSelection) {

                            context.fillStyle = self.options.plumPalette.combo.dropDown.fillHover;
                            context.fillRect(rectangleDropDown.left,
                                rectangleDropDown.top + self.options.plumPalette.combo.dropDown.adjustmentLeft +
                                    i * self.options.plumPalette.combo.dropDown.heightRow,
                                rectangleDropDown.width,
                                self.options.plumPalette.combo.dropDown.heightRow);
                            context.fillStyle = self.options.plumPalette.combo.dropDown.fillText;
                        }

                        context.fillText(strPlan,
                            rectangleDropDown.left + self.options.plumPalette.combo.marginLeftSelectedText,
                            rectangleDropDown.top + self.options.plumPalette.combo.marginTopSelectedText +
                                i * self.options.plumPalette.combo.dropDown.heightRow);

                        // Associate rects with the text.
                        self.options.comboSelections[strPlan] = {

                            left: rectangleDropDown.left +
                                self.options.plumPalette.combo.dropDown.paddingRegions.left,
                            top: rectangleDropDown.top +
                                self.options.plumPalette.combo.dropDown.paddingRegions.top +
                                i * self.options.plumPalette.combo.dropDown.heightRow,
                            width: rectangleDropDown.width -
                                self.options.plumPalette.combo.dropDown.paddingRegions.width,
                            height: self.options.plumPalette.combo.dropDown.paddingRegions.height
                        };
                    }

                    // And the new combo-button.
                    return m_functionRenderComboButton(contextRender,
                        false,
                        true);
                } catch (e) {

                    return e;
                }
            };

            /////////////////////////////////////////
            // Private fields.

            // The scrolling plum scroll.
            var m_plumScroll = new PlumScroll();
            // Hash holds command to its hover region.
            var m_objectCommandToRegion = {

            };
        };

        // One-time injection.
        functionRet.inherits(SectionBase);

        // Return constructor.
        return functionRet;
    });
