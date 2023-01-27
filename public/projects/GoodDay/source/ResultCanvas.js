////////////////////////////////////////
// Canvas shows good/bad info.
//
// Return constructor function.

"use strict";

define([],
    function () {

        // Define constructor for ResultCanvas.
        var functionConstructor = function (strParentSelector,
            arrayPreviousYears,
            arrayPreviousMonthsCurrentYear,
            arrayCurrentMonthCurrentYear) {

            var self = this;            // Uber closure.

            ////////////////////////////
            // Private methods

            // Create and append the canvas.
            var m_functionCreate = function () {

                try {

                    // Get the parent element.
                    var jParent = $(strParentSelector);

                    // Get its width and height.
                    var dWidth = jParent.width();
                    var dHeight = jParent.height();

                    // Create the canvas.
                    var jCanvas = $("<canvas width='" + dWidth.toString() + "' height='" + dHeight.toString() + "'></canvas>");
                    jCanvas.css({

                        width: dWidth.toString() + "px",
                        height: dHeight.toString() + "px",
                        opacity: 0.00001
                    });
                    jParent.append(jCanvas);
                    var context = jCanvas[0].getContext("2d");

                    context.clearRect(0,
                        0,
                        dWidth,
                        dHeight);

                    jCanvas.animate({

                        opacity: 1
                    }, 1000);

                    return m_functionRender(context,
                        dWidth,
                        dHeight);
                } catch (e) {

                    return e;
                }
            };

            // Render the canvas.
            var m_functionRender = function (context,
                dWidth,
                dHeight) {

                try {

                    // Break up the sections: 1/3 1/3 1/3.
                    var dSectionHeight = dHeight / 2;
                    var dSectionTop = dHeight / 4;
                    var dSectionShrink = dHeight / 32;
                    var dGap = dSectionShrink / 4;
                    var iBorder = dGap;
                    var dSectionWidth = (dWidth - 2 * iBorder) / 3;

                    // Render the year section first.
                    var iYears = arrayPreviousYears.length;
                    var dYearWidth = dSectionWidth / iYears;

                    var rectRender = {

                        left: iBorder,
                        top: dSectionTop,
                        width: dSectionWidth,
                        height: dSectionHeight
                    };
                    for (var i = 0; i < iYears; i++) {

                        // Get the ith year.
                        var yearIth = arrayPreviousYears[i];

                        // Figure out if this year is good or bad.
                        var iCount = yearIth["COUNT(vote)"];
                        var iSum = yearIth["SUM(vote)"];
                        var dRatio = iSum / iCount;

                        var bGood = dRatio > 0.5;
                        if (bGood) {

                            context.fillStyle = "green";
                            context.strokeStyle = "yellow";
                        } else {

                            context.fillStyle = "red";
                            context.strokeStyle = "brown";
                        }

                        context.fillRect(rectRender.left + i * dYearWidth + dGap,
                            rectRender.top,
                            dYearWidth - 2 * dGap,
                            rectRender.height);
                        context.strokeRect(rectRender.left + i * dYearWidth + dGap,
                            rectRender.top,
                            dYearWidth - 2 * dGap,
                            rectRender.height);
                    }

                    // Now the months.
                    var iMonths = arrayPreviousMonthsCurrentYear.length;
                    var dMonthWidth = dSectionWidth / iMonths;

                    rectRender = {

                        left: iBorder + dSectionWidth + dGap,
                        top: dSectionTop + dSectionShrink,
                        width: dSectionWidth - 2 * dGap,
                        height: dSectionHeight - 2 * dSectionShrink
                    };
                    for (var i = 0; i < iMonths; i++) {

                        // Get the ith month.
                        var monthIth = arrayPreviousMonthsCurrentYear[i];

                        // Figure out if this month is good or bad.
                        var iCount = monthIth["COUNT(vote)"];
                        var iSum = monthIth["SUM(vote)"];
                        var dRatio = iSum / iCount;

                        var bGood = dRatio > 0.5;
                        if (bGood) {

                            context.fillStyle = "cyan";
                            context.strokeStyle = "yellow";
                        } else {

                            context.fillStyle = "rgb(128, 0, 0)";
                            context.strokeStyle = "brown";
                        }

                        context.fillRect(rectRender.left + i * dMonthWidth + dGap,
                            rectRender.top,
                            dMonthWidth - 2 * dGap,
                            rectRender.height);
                        context.strokeRect(rectRender.left + i * dMonthWidth + dGap,
                            rectRender.top,
                            dMonthWidth - 2 * dGap,
                            rectRender.height);
                    }

                    // Finally the current month.
                    var iDays = arrayCurrentMonthCurrentYear.length;
                    var dDayWidth = dSectionWidth / iDays;

                    rectRender = {

                        left: iBorder + 2 * dSectionWidth + dGap,
                        top: dSectionTop + 2 * dSectionShrink,
                        width: dSectionWidth - 2 * dGap,
                        height: dSectionHeight - 4 * dSectionShrink
                    };
                    for (var i = 0; i < iDays; i++) {

                        // Get the ith day.
                        var dayIth = arrayCurrentMonthCurrentYear[i];

                        // Figure out if this month is good or bad.
                        var iCount = dayIth["COUNT(vote)"];
                        var iSum = dayIth["SUM(vote)"];
                        var dRatio = iSum / iCount;

                        var bGood = dRatio > 0.5;
                        if (bGood) {

                            context.fillStyle = "white";
                            context.strokeStyle = "yellow";
                        } else {

                            context.fillStyle = "black";
                            context.strokeStyle = "brown";
                        }

                        context.fillRect(rectRender.left + i * dDayWidth + dGap,
                            rectRender.top,
                            dDayWidth - 2 * dGap,
                            rectRender.height);
                        context.strokeRect(rectRender.left + i * dDayWidth + dGap,
                            rectRender.top,
                            dDayWidth - 2 * dGap,
                            rectRender.height);
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Instantiation

            // Call create.
            var exceptionRet = m_functionCreate();
            if (exceptionRet !== null) {

                throw exceptionRet;
            }
        };

        return functionConstructor;
    });
