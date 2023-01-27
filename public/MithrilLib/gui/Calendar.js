///////////////////////////////////////
// Calendar GUI module.
//
// Returns constructor function.
//
// Theme object interface:
// strokeSeparatorLine
// strokeArrow
// fillBackground
// fillText
// fillValue
// fillWeekendText
// fillHolidayText
// fillDisabledText
// font
// lineWidthArrow
// centerText.

"use strict";

define(["/MithrilLib/system/prototypes.js"],
    function (prototypes) {

        // Define canvas consuming Calendar drop-down constructor function.
        var functionRet = function Calendar(strParentSelector,
            objectTheme) {

            var self = this;            // Uber-closure.

            // Hold on to mediator.
            self.mediator = null;

            //////////////////////////////////////
            // Public events.

            // Event raised when the user selects a new value date.
            self.onChange = null;
            // Double-click event.
            self.onDoubleClick = null;
            // Cell render stub.
            self.onCellRender = null;
            // Invoked when a month page is loaded.
            self.onShowMonth = null;

            //////////////////////////////////////
            // Public methods.

            // Render to specified context.
            self.render = function () {

                try {

                    // Only wire events et al once.                    
                    if (m_options.setEventHandlers === undefined ||
                        m_options.setEventHandlers === false) {

                        // Get the parent object.
                        var jParent = $(strParentSelector);
                        if (jParent.length === 0) {

                            throw {

                                message: "Invalid parent selector specified."
                            };
                        }
                        var canvas = jParent[0];
                        m_options.context = canvas.getContext("2d");

                        // Override defaults:
                        if (objectTheme) {

                            // Set all the values.
                            var arrayKeys = Object.keys(objectTheme);
                            for (var i = 0; i < arrayKeys.length; i++) {

                                var strKey = arrayKeys[i];
                                if (strKey === "onChange" ||
                                    strKey === "onDoubleClick" ||
                                    strKey === "onCellRender" ||
                                    strKey === "onShowMonth") {

                                    self[strKey] = objectTheme[strKey];
                                } else {

                                    m_options[strKey] = objectTheme[strKey];
                                }
                            }
                        }

                        // Wire up events to process user input.
                        $(canvas).mousedown(m_functionMouseDown);
                        $(canvas).mouseup(m_functionMouseUp);
                        $(canvas).mouseout(m_functionMouseUp);
                        $(canvas).dblclick(m_functionDoubleClick);

                        // Note that event handlers are wired.
                        m_options.setEventHandlers = true;

                        return self.setValue(new Date());
                    }

                    // Render to context.
                    return m_functionRender();
                } catch (e) {

                    return e;
                }
            };

            // Set displayed value to the specified.
            self.setValue = function (dateValue) {

                try {

                    // Ensure value has a value.
                    if (dateValue === null) {

                        dateValue = new Date();
                    }

                    // Set value.
                    m_options.value = dateValue;

                    // Update the object state.
                    m_options.displayMonth = dateValue.getMonth();
                    m_options.displayYear = dateValue.getFullYear();

                    // Raise the change event.
                    if ($.isFunction(self.onShowMonth)) {

                        self.onShowMonth(m_options.displayMonth,
                            m_options.displayYear);
                    }

                    // Render to context.
                    return m_functionRender();
                } catch (e) {

                    return e;
                }
            };

            // Return current value.
            self.getValue = function () {

                return m_options.value;
            };

            //////////////////////////////////////
            // Public fields.

            // Collections of hollidays and weekend days.
            self.holidays = {
    
            };
            self.holidays[(new Date(2013, 12 - 1, 25)).formatDateForDisplay()] = true;

            self.weekends = [0, 6];

            //////////////////////////////////////
            // Private methods.

            // Output display of calendar to render context.
            var m_functionRender = function () {

                try {

                    // Get dimensions.
                    var dWidth = m_options.context.canvas.width;
                    var dHeight = m_options.context.canvas.height;

                    // Clear background.
                    m_options.context.fillStyle = m_options.fillBackground;
                    m_options.context.fillRect(0,
                        0,
                        dWidth,
                        dHeight);

                    // Define colum widths and row heights.
                    var dColumnWidth = dWidth / 7;
                    var dRowHeight = dHeight / 8;

                    m_options.arrowsAndDateDisplayRow.sizeArrowPreviousMonth.height = dRowHeight - 10;
                    m_options.arrowsAndDateDisplayRow.sizeArrowPreviousMonth.width = m_options.arrowsAndDateDisplayRow.sizeArrowPreviousMonth.height * 0.4;

                    // Save in object state for subsequent requirements.
                    m_options.columnWidth = dColumnWidth;
                    m_options.rowHeight = dRowHeight;

                    // Set context font:
                    m_options.context.font = m_options.font;

                    // Row 1: Arrows and Date display.
                    // Note: parameter is the rectangle defining the entire region.
                    m_functionRenderArrowsAndDateDisplay({

                        left: 0,
                        top: 0,
                        width: dWidth,
                        height: dRowHeight
                    });

                    // Row 2: Days of the week.
                    // Note: parameter is the rectangle defining the entire region.
                    m_functionRenderDOWs({

                        left: 0,
                        top: dRowHeight,
                        width: dWidth,
                        height: dRowHeight
                    }, dColumnWidth);

                    // Row 3-N: Days.
                    // Note: parameter is the rectangle defining the entire region.
                    m_functionRenderDays({

                        left: 0,
                        top: 2 * dRowHeight,
                        width: dWidth,
                        height: dRowHeight * 6
                    },
                        dColumnWidth,
                        dRowHeight);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render first row of calendar.
            var m_functionRenderArrowsAndDateDisplay = function (rectangle) {

                try {

                    // Save off for remainder of function.
                    var context = m_options.context;

                    // Render previous month arrow:

                    // Define bounds-rectangle.
                    var dPMALeft = rectangle.left + m_options.arrowsAndDateDisplayRow.paddingArrow.left;
                    var dPMATop = rectangle.top + m_options.arrowsAndDateDisplayRow.paddingArrow.top;
                    var dPMAWidth = m_options.arrowsAndDateDisplayRow.sizeArrowPreviousMonth.width;
                    var dPMAHeight = m_options.arrowsAndDateDisplayRow.sizeArrowPreviousMonth.height;

                    // Render a triangle.
                    context.lineWidth = m_options.lineWidthArrow;
                    context.strokeStyle = m_options.strokeArrow;
                    context.beginPath();
                    context.moveTo(dPMALeft + dPMAWidth,
                        dPMATop);
                    context.lineTo(dPMALeft,
                        dPMATop + dPMAHeight / 2);
                    context.lineTo(dPMALeft + dPMAWidth,
                        dPMATop + dPMAHeight);
                    context.stroke();

                    // Render next month arrow:

                    // Define bounds-rectangle.
                    var dNMAWidth = m_options.arrowsAndDateDisplayRow.sizeArrowPreviousMonth.width;
                    var dNMAHeight = m_options.arrowsAndDateDisplayRow.sizeArrowPreviousMonth.height;
                    var dNMALeft = rectangle.left + rectangle.width - m_options.arrowsAndDateDisplayRow.paddingArrow.left - dNMAWidth;
                    var dNMATop = rectangle.top + m_options.arrowsAndDateDisplayRow.paddingArrow.top;

                    // Render a triangle.
                    context.beginPath();
                    context.moveTo(dNMALeft,
                        dNMATop);
                    context.lineTo(dNMALeft + dNMAWidth,
                        dNMATop + dNMAHeight / 2);
                    context.lineTo(dNMALeft,
                        dNMATop + dNMAHeight);
                    context.stroke();
                    context.lineWidth = 1;

                    // Render date:

                    // Compose the date to render.
                    var strDate = m_functionMonthNumberToString() + " " + m_options.displayYear.toString();

                    // Determine its size.
                    var dDateSize = strDate.size(m_options.font);

                    // Center date within region.
                    var dDateCenterLeft = rectangle.left + (rectangle.width - dDateSize.width) / 2;
                    var dDateCenterTop = rectangle.top + (rectangle.height - dDateSize.height) / 2;

                    // Render out the date.
                    context.textBaseline = "top";
                    context.fillStyle = m_options.fillText;
                    context.fillText(strDate,
                        dDateCenterLeft,
                        dDateCenterTop);

                    // Draw separator line.
                    context.strokeStyle = m_options.strokeSeparatorLine;
                    context.beginPath();
                    context.moveTo(rectangle.left,
                        rectangle.top + m_options.rowHeight + 2);
                    context.lineTo(rectangle.left + rectangle.width,
                        rectangle.top + m_options.rowHeight + 2);
                    context.stroke();

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render second row of calendar.
            var m_functionRenderDOWs = function (rectangle,
                dColumnWidth) {

                try {

                    // Save for remainder of method.
                    var context = m_options.context;

                    context.fillStyle = m_options.fillWeekendText;

                    // Build collection of all day names.
                    var arrayDOWs = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

                    // Loop over known day names.
                    for (var i = 0; i < arrayDOWs.length; i++) {

                        // Comput cell bounds.
                        var dCellLeft = rectangle.left + i * dColumnWidth;
                        var dCellTop = rectangle.top;
                        var dCellWdith = dColumnWidth;
                        var dCellHeight = rectangle.height;

                        // Get the text to output.
                        var strDOW = arrayDOWs[i];
                        var sizeDOW = strDOW.size(m_options.font);

                        // Center text.
                        var dTextLeft = dCellLeft + (dColumnWidth - sizeDOW.width) / 2;
                        var dTextTop = dCellTop + (rectangle.height - sizeDOW.height) / 2;

                        // Render text.
                        context.fillText(strDOW,
                            dTextLeft,
                            dTextTop);
                    }

                    // Draw separator line.
                    context.strokeStyle = m_options.strokeSeparatorLine;
                    context.beginPath();
                    context.moveTo(rectangle.left,
                        rectangle.top + rectangle.height);
                    context.lineTo(rectangle.left + rectangle.width,
                        rectangle.top + rectangle.height);
                    context.stroke();

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render rows 3 - N of calendar (the days).
            var m_functionRenderDays = function (rectangle,
                dColumnWidth,
                dRowHeight) {

                try {

                    // Alias self up front for easier access below.
                    var context = m_options.context;

                    // Compse new date starting at the first day of the display month.
                    var dateDisplay = new Date(m_options.displayYear,
                        m_options.displayMonth,
                        0);

                    // Determine the day of week of the first day of month.
                    var dFirstDayOfWeek = dateDisplay.getDay();

                    // Get the days in self and the previous month.
                    var dDaysInDisplayMonth = m_functionGetDaysInMonth(m_options.displayYear,
                        m_options.displayMonth);
                    var dDaysInPreviousMonth = 0;
                    if (m_options.displayMonth > 0) {

                        dDaysInPreviousMonth = m_functionGetDaysInMonth(m_options.displayYear,
                            m_options.displayMonth - 1);
                    } else {

                        dDaysInPreviousMonth = m_functionGetDaysInMonth(m_options.displayYear - 1,
                            11);
                    }

                    // Compute how many previous month days are displayed.
                    var dNumberofPreviousDaysToDisplay = dFirstDayOfWeek + 1;
                    var dStartingPreviousMonthDayNumber = dDaysInPreviousMonth - dNumberofPreviousDaysToDisplay + 1;

                    // Keep track of current cell.
                    var dCellCounter = 0;

                    // Need to know now, it is highlight-boxed.
                    var dateNow = new Date();

                    // Reset the private field, cell.  Values are specified as iterated.
                    m_cells = [];

                    // Loop over all cells to render:

                    // Loop over rows.
                    for (var iRow = 0; iRow < 6; iRow++) {

                        // Maintain the matrix of cell values.
                        var arrayRow = [];
                        m_cells.push(arrayRow);

                        // Loop over columns.
                        for (var iColumn = 0; iColumn < 7; iColumn++) {

                            // Need to know the day number--it is rendered in "self" cell.
                            var strDay = "";

                            // Indicates that the current cell is not in the display month.
                            var bOtherMonth = false;

                            // The computed date representing the current date.
                            var dateCell = null;

                            // If still on the previous month.
                            if (dCellCounter < dNumberofPreviousDaysToDisplay) {

                                // Calculate day.
                                strDay = (dStartingPreviousMonthDayNumber + dCellCounter).toString();

                                // Indicate that this is not the display month. 
                                bOtherMonth = true;

                                // Compute the date associated with this cell.
                                dateCell = new Date(m_options.displayYear + (m_options.displayMonth === 0 ? -1 : 0),
                                    (m_options.displayMonth === 0 ? 11 : (m_options.displayMonth - 1)),
                                    dStartingPreviousMonthDayNumber + dCellCounter);
                            } else {

                                // Calculate day.
                                var dDay = 1 + dCellCounter - dNumberofPreviousDaysToDisplay;

                                // If off end of display month, go into next month block.
                                if (dDay > dDaysInDisplayMonth) {

                                    // Compensate for the span of days in the display 
                                    // month to get the 1-based day in the next month.
                                    dDay -= dDaysInDisplayMonth;

                                    // Indicate that self is not the display 
                                    // month and set text color accordingly.
                                    context.fillStyle = m_options.fillDisabledText;
                                    bOtherMonth = true;

                                    // Compute the date associated with self cell.
                                    dateCell = new Date(m_options.displayYear + (m_options.displayMonth === 11 ? 1 : 0),
                                        (m_options.displayMonth === 11 ? 0 : (m_options.displayMonth + 1)),
                                        dDay);
                                } else {

                                    // Set the color to the display month, active color.
                                    context.fillStyle = m_options.fillText;

                                    // Compute the date associated with this cell.
                                    dateCell = new Date(m_options.displayYear,
                                        m_options.displayMonth,
                                        dDay);
                                }

                                // Freeze out the value into a string for display.
                                strDay = dDay.toString();
                            }

                            // Prepare for next cell.
                            dCellCounter++;

                            // Store the value in the array of cell values.
                            // This is used for the mouse handling routines.
                            arrayRow.push(dateCell);

                            // Compute cell bounds.
                            var dCellLeft = rectangle.left + iColumn * dColumnWidth + 1.5;
                            var dCellTop = rectangle.top + iRow * dRowHeight + 1.5;
                            var dCellWdith = dColumnWidth - 3.0;
                            var dCellHeight = dRowHeight - 3.0;

                            // Look for the value cell.  The cell whose 
                            // date =='s the value of the related combo.
                            if (m_options.value.getMonth() === dateCell.getMonth() &&
                                m_options.value.getDate() === dateCell.getDate() &&
                                m_options.value.getFullYear() === dateCell.getFullYear()) {

                                // Fill in background of this cell right here.
                                context.fillStyle = m_options.fillValue;
                                context.fillRect(dCellLeft,
                                    dCellTop,
                                    dCellWdith,
                                    dCellHeight);

                                // Reset fill to default for text.
                                context.fillStyle = m_options.fillText;
                            }

                            // Figure out if this cell is a weekend or holiday.
                            var bWeekend = (self.weekends.indexOf(iColumn) !== -1);

                            // Loop over all holidays until a match is found.
                            // Format cell date for holiday lookup.
                            var strCellDate = dateCell.formatDateForDisplay();
                            var bHoliday = self.holidays.hasOwnProperty(strCellDate);

                            // Center text.
                            var dTextLeft = dCellLeft + 2;
                            var dTextTop = dCellTop + 2;

                            if (m_options.centerText) {

                                // Get width of the text to output so 
                                // that it can be centered in the cell.
                                var sizeDay = strDay.size(m_options.font);

                                dTextLeft = dCellLeft + (dColumnWidth - sizeDay.width) / 2;
                                dTextTop = dCellTop + (dRowHeight - sizeDay.height) / 2;
                            }

                            // Let the callback handle the render.
                            if ($.isFunction(self.onCellRender)) {

                                context.save();
                                try {

                                    self.onCellRender(context,
                                        dCellLeft,
                                        dCellTop,
                                        dCellWdith,
                                        dCellHeight,
                                        dateCell);
                                } finally {

                                    context.restore();
                                }
                            }

                            // Possibly override the fill color with which to render the text.
                            if (bOtherMonth === false) {
                                if (bHoliday) {

                                    context.fillStyle = m_options.fillHolidayText;
                                } else if (bWeekend) {

                                    context.fillStyle = m_options.fillWeekendText;
                                } else {

                                    context.fillStyle = m_options.fillText;
                                }
                            } else {

                                context.fillStyle = m_options.fillDisabledText;
                            }

                            // Render text.
                            context.fillText(strDay,
                                dTextLeft,
                                dTextTop);
                        }
                    }
                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Simple helper method to calculate the number of days in a month.
            // NOTE: No exception handling in function that returns a number.
            var m_functionGetDaysInMonth = function (dYear,
                dMonth) {

                // Compose the 28th day of month.
                var dateTest = new Date(dYear, dMonth, 26);

                // Save off the best value for number of days.
                var dNumberOfDaysInMonth = 0;

                // Walk forward one day at a time 
                // until no longer the same month.
                while (dateTest.getMonth() === dMonth) {

                    // Get the best value for the number of days.
                    dNumberOfDaysInMonth = dateTest.getDate();

                    // Move to the next day, which might be next month.
                    dateTest = new Date(dateTest.getTime() + 86400000);
                }

                // Return the best value found.
                return dNumberOfDaysInMonth;
            };

            // Simple helper method to convert a month number to a string.
            // NOTE: only supposts en-us right now, i18n in the future.
            var m_functionMonthNumberToString = function () {

                if (m_options.displayMonth === 0) {

                    return "January";
                } else if (m_options.displayMonth === 1) {

                    return "Feburary";
                } else if (m_options.displayMonth === 2) {

                    return "March";
                } else if (m_options.displayMonth === 3) {

                    return "April";
                } else if (m_options.displayMonth === 4) {

                    return "May";
                } else if (m_options.displayMonth === 5) {

                    return "June";
                } else if (m_options.displayMonth === 6) {

                    return "July";
                } else if (m_options.displayMonth === 7) {

                    return "August";
                } else if (m_options.displayMonth === 8) {

                    return "September";
                } else if (m_options.displayMonth === 9) {

                    return "October";
                } else if (m_options.displayMonth === 10) {

                    return "November";
                } else {

                    return "December";
                } 
            };

            // Function called to update the value 
            // of the displayMonth then to re-render.
            var m_functionUpdateMonth = function (bNext) {

                try {

                    // Previous month button.
                    if (bNext === false) {

                        m_options.displayMonth--;

                        // Scroll the years, if necessary.
                        if (m_options.displayMonth < 0) {

                            m_options.displayYear--;
                            m_options.displayMonth = 11;
                        }
                    } else {

                        // Next month button.
                        m_options.displayMonth++;

                        // Scroll the years, if necessary.
                        if (m_options.displayMonth > 11) {

                            m_options.displayYear++;
                            m_options.displayMonth = 0;
                        }
                    }

                    // Raise the change event.
                    if ($.isFunction(self.onShowMonth)) {

                        self.onShowMonth(m_options.displayMonth,
                            m_options.displayYear);
                    }

                    // Update display to match.
                    return m_functionRender();
                } catch (e) {

                    return e;
                }
            };

            //////////////////////////////////////
            // Private event handlers.

            // Invoked when the mouse is double-clicked over the root canvas.
            // Implemented to update the value and raise the related event.
            var m_functionDoubleClick = function (e) {

                try {

                    // Don't want this sent to other windows.
                    e.stopPropagation();
                    e.preventDefault();

                    // Determine in what cell the user clicked.
                    var dColumn = Math.floor(e.offsetX / m_options.columnWidth);
                    var dRow = Math.floor(e.offsetY / m_options.rowHeight);

                    // If wired, then raise.
                    if (dRow > 1 &&
                        $.isFunction(self.onDoubleClick)) {

                        self.onDoubleClick();
                    }
                } catch (e) {

                    self.mediator.reportError(e);
                }
            };

            // Invoked when the mouse is depressed over the root canvas.
            // Implemented to update the value and raise the related event.
            var m_functionMouseDown = function (e) {

                try {

                    // Don't want this sent to other windows.
                    e.stopPropagation();
                    e.preventDefault();

                    // Determine in what cell the user clicked.
                    var dColumn = Math.floor(e.offsetX / m_options.columnWidth);
                    var dRow = Math.floor(e.offsetY / m_options.rowHeight);

                    // Different actions based on different rows:

                    // Row 1: possibly the user clicked on a month arrow.
                    if (dRow === 0) {

                        // Check for previous.
                        if (dColumn === 0) {

                            // Just update to previous month.
                            var exceptionRet = m_functionUpdateMonth(false);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            // Start the repeat timer.  The first step   
                            // is slow, then the timer speeds up later.
                            m_options.timerCookie = setInterval(m_functionFirstPrevious,
                                500);
                        } else if (dColumn === 6) {     // Test next month button.

                            // Just update to next month.
                            var exceptionRet = m_functionUpdateMonth(true);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            // Start the repeat timer.  The first step   
                            // is slow, then the timer speeds up later.
                            m_options.timerCookie = setInterval(m_functionFirstNext,
                                500);
                        }

                    } else if (dRow > 1) {  // Test for click in day cell.

                        // Compute the new row in the day rectangle.
                        var dRow = Math.floor((e.offsetY - 2 * m_options.rowHeight) / m_options.rowHeight);

                        // Extract the value stored at that location.
                        var dateClicked = m_cells[dRow][dColumn];

                        if (dateClicked.getMonth() === m_options.displayMonth) {

                            m_options.value = dateClicked;

                            // If the onChange event is wired...
                            if ($.isFunction(self.onChange)) {

                                // ...then fire it.
                                self.onChange(m_options.value);
                            }

                            // Update display.
                            var exceptionRet = m_functionRender();
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                        }
                    }
                } catch (e) {

                    self.mediator.reportError(e);
                }
            };

            // Invoked when the mouse is let up over the root canvas.
            // Implemented to stop any repeat timer that is running.
            var m_functionMouseUp = function (e) {

                try {

                    // Don't want this sent to other windows.
                    e.stopPropagation();
                    e.preventDefault();

                    // Cancel timer, if set.
                    if (m_options.timerCookie !== undefined) {

                        // Clear timer.
                        clearTimeout(m_options.timerCookie);

                        // Reset state.
                        delete m_options.timerCookie;
                    }
                } catch (e) {

                    self.mediator.reportError(e);
                }
            };

            // Invoked for the first previous timer callback (the slow call).
            // Implemented to stop the slow and start the fast timer callback.
            var m_functionFirstPrevious = function (e) {

                try {

                    // Cancel slow timer, if set.
                    if (m_options.timerCookie !== undefined) {

                        // Clear timer.
                        clearInterval(m_options.timerCookie);

                        // Reset state.
                        delete m_options.timerCookie;
                    }

                    // Start the fast timer.
                    m_options.timerCookie = setTimeout(m_functionRepeatPrevious,
                        250);
                } catch (e) {

                    self.mediator.reportError(e);
                }
            };

            // Invoked for the first next timer callback (the slow call).
            // Implemented to stop the slow and start the fast timer callback.
            var m_functionFirstNext = function (e) {

                try {

                    // Cancel slow timer, if set.
                    if (m_options.timerCookie !== undefined) {

                        // Clear timer.
                        clearInterval(m_options.timerCookie);

                        // Reset state.
                        delete m_options.timerCookie;
                    }

                    // Start the fast timer.
                    m_options.timerCookie = setTimeout(m_functionRepeatNext,
                        250);
                } catch (e) {

                    self.mediator.reportError(e);
                }
            };

            // Invoked subsequent to the slow timer until the mouse button is let up.
            // Implemented to update the display values associated with self control.
            var m_functionRepeatPrevious = function (e) {

                try {

                    // Update month to previous month.
                    var exceptionRet = m_functionUpdateMonth(false);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Cycle.
                    m_options.timerCookie = setTimeout(m_functionRepeatPrevious,
                        50);
                } catch (e) {

                    self.mediator.reportError(e);
                }
            };

            // Invoked subsequent to the slow timer until the mouse button is let up.
            // Implemented to update the display values associated with self control.
            var m_functionRepeatNext = function (e) {

                try {

                    // Update month to next month.
                    var exceptionRet = m_functionUpdateMonth(true);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Cycle.
                    m_options.timerCookie = setTimeout(m_functionRepeatNext,
                        50);
                } catch (e) {

                    self.mediator.reportError(e);
                }
            };

            //////////////////////////////////////
            // Private fields.

            // Options object maintains drawing and runtime state.
            var m_options = {

                fillBackground: "rgb(35, 56, 80)",
                strokeSeparatorLine: "rgb(43, 79, 105)",
                fillText: "rgb(255, 255, 255)",
                fillValue: "rgb(143, 72, 40)",
                fillWeekendText: "rgb(150, 183, 216)",
                fillHolidayText: "rgb(50, 253, 116)",
                fillDisabledText: "rgb(4, 31, 48)",
                strokeArrow: "rgb(255, 88, 0)",
                lineWidthArrow: 2,
                font: "12px Arial",
                value: null,
                displayYear: 0,
                displayMonth: 0,
                centerText: true,

                arrowsAndDateDisplayRow: {

                    paddingArrow: {

                        left: 5,
                        top: 5,
                        right: 5
                    },
                    sizeArrowPreviousMonth: {

                        width: 4,
                        height: 10
                    }
                }
            };

            // Collection of cell-date data.
            var m_cells = [];


            // Cause first render:
            self.render();
        };

        return functionRet;

    });
