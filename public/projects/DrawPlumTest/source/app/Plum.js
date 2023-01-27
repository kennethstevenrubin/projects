///////////////////////////////////////
// Draws plum 
"use strict";

define([],
    function () {

        // Base constructor function is simply returned.
        var functionRet = function Plum(optionsOverride) {
            
            this.create = function (canvas,
                context,
                rectangle) {

                try {

                    self.options.canvas = canvas;
                    self.options.context = context;
                    self.options.rectangle = rectangle;

                    // Load up all images, then continue after the last image is loaded.
                    for (var i = 0; i < m_arrayPlums.length; i++) {

                        var strURL = m_arrayPlums[i];

                        var img = new Image();

                        if (i === m_arrayPlums.length - 1) {

                            img.onload = m_functionImageOnLoad;
                        }
                        img.src = "media/" +
                            strURL +
                            ".png";

                        m_objectImages[strURL] = img;
                    }

                    $(self.options.canvas).mousemove(m_functionOnMouseMove);
                    $(self.options.canvas).mousedown(m_functionOnMouseDown);
                    $(self.options.canvas).mouseup(m_functionOnMouseUp);
                    $(self.options.canvas).mouseout(m_functionOnMouseUp);

                    return m_functionRender();
                } catch (e) {

                    return e;
                }
            };

            this.options = {

                padingPlum: 20,
                widthShadedPlum: 90,
                heightShadedPlum: 86,
                widthShadedPlumSpace: 74,
                widthWestPlum: 40,
                heightWestPlum: 40,
                padingScrollRegion: 5,
                scrollOffset: 40,
                firstIndex: 0
            };

            $.extend(true,
                this.options,
                optionsOverride);

            var m_functionImageOnLoad = function () {

                // Render now that all images are loaded.
                return m_functionRender();
            };

            var m_functionScroll = function (dScroll) {

                try {

                    self.options.scrollOffset += dScroll;
                    while (self.options.scrollOffset > self.options.widthShadedPlumSpace) {

                        self.options.scrollOffset -= self.options.widthShadedPlumSpace;
                        self.options.firstIndex++;
                    }

                    while (self.options.scrollOffset < 0) {

                        self.options.scrollOffset += self.options.widthShadedPlumSpace;
                        self.options.firstIndex--;
                    }

                    return m_functionRender();
                } catch (e) {

                    return e;
                }
            };

            var m_functionOnMouseMove = function (e) {

                try {

                    self.options.mousePointerCoordinates = {

                        x: e.offsetX,
                        y: e.offsetY
                    };

                    if (self.options.mousePointerCoordinates.x < self.options.rectangle.left ||
                        self.options.mousePointerCoordinates.y < self.options.rectangle.top ||
                        self.options.mousePointerCoordinates.x > self.options.rectangle.left + self.options.rectangle.width ||
                        self.options.mousePointerCoordinates.y > self.options.rectangle.top + self.options.rectangle.height) {

                        return;
                    }

                    // Generate the path for each button.
                    m_functionRenderPlumWest(self.options.context,
                        self.options.westLeft,
                        self.options.rectangle.top + (self.options.rectangle.height - self.options.heightWestPlum) / 2,
                        self.options.widthWestPlum,
                        self.options.heightWestPlum,
                        "rgba(0,0,0,1)");

                    self.options.pointInWestButton = self.options.context.isPointInPath(e.offsetX,
                        e.offsetY);

                    m_functionRenderPlumEast(self.options.context,
                        self.options.eastLeft,
                        self.options.rectangle.top + (self.options.rectangle.height - self.options.heightWestPlum) / 2,
                        self.options.widthWestPlum,
                        self.options.heightWestPlum,
                        "rgba(0,0,0,1)");

                    self.options.pointInEastButton = self.options.context.isPointInPath(e.offsetX,
                        e.offsetY);

                    var exceptionRet = m_functionRender();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            var m_functionOnMouseDown = function (e) {

                try {

                    if (self.options.pointInWestButton) {

                        m_functionScroll(-10);

                        self.options.timerCookie = setInterval(m_functionWestFirst,
                            500);

                        self.options.mouseDownInWestButton = true;
                    } else if (self.options.pointInEastButton) {

                        m_functionScroll(10);

                        self.options.timerCookie = setInterval(m_functionEastFirst,
                            500);
                        self.options.mouseDownInEastButton = true;
                    }

                    var exceptionRet = m_functionRender();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            var m_functionWestFirst = function () {

                try {
                    if (self.options.timerCookie !== undefined) {

                        clearInterval(self.options.timerCookie);
                        delete self.options.timerCookie;
                    }

                    self.options.timerCookie = setInterval(m_functionWestRepeat,
                        10);
                } catch (e) {

                    alert(e);
                }
            }

            var m_functionWestRepeat = function () {

                try {

                    m_functionScroll(-1.5);
                } catch (e) {

                    alert(e);
                }
            }

            var m_functionEastFirst = function () {

                try {
                    if (self.options.timerCookie !== undefined) {

                        clearInterval(self.options.timerCookie);
                        delete self.options.timerCookie;
                    }

                    self.options.timerCookie = setInterval(m_functionEastRepeat,
                        10);
                } catch (e) {

                    alert(e);
                }
            }

            var m_functionEastRepeat = function () {

                try {

                    m_functionScroll(1.5);
                } catch (e) {

                    alert(e);
                }
            }

            var m_functionOnMouseUp = function (e) {

                try {

                    self.options.mouseDownInWestButton = false;
                    self.options.mouseDownInEastButton = false;

                    self.options.pointInWestButton = false;
                    self.options.pointInEastButton = false;

                    if (self.options.timerCookie !== undefined) {

                        clearInterval(self.options.timerCookie);
                        delete self.options.timerCookie;
                    }

/*                    m_functionOnMouseMove({

                        offsetX: e.offsetX,
                        offsetY: e.offsetY
                    });
*/                    var exceptionRet = m_functionRender();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            var m_functionRender = function () {

                try {

                    var context = self.options.context;
                    var rectangle = self.options.rectangle;

                    // Fill background.
                    context.fillStyle = "#444";
                    context.fillRect(rectangle.left,
                        rectangle.top,
                        rectangle.width,
                        rectangle.height);

                    // Calculate the various regions.
                    var dWestLeft = rectangle.left + self.options.padingPlum;
                    var dWestWidth = self.options.widthWestPlum;
                    self.options.westLeft = dWestLeft;

                    var dHalfNonBody = self.options.widthWestPlum + self.options.padingPlum + self.options.padingScrollRegion;
                    var dCenterLeft = dWestLeft + dWestWidth + self.options.padingScrollRegion;
                    var dCenterWidth = rectangle.width - 2 * (dHalfNonBody);

                    var dEastLeft = dCenterLeft + dCenterWidth + self.options.padingScrollRegion;
                    var dEastWidth = self.options.widthWestPlum;
                    self.options.eastLeft = dEastLeft;

                    var dTop = rectangle.top;
                    if (self.options.mouseDownInWestButton) {

                        dTop += 2;
                    }
                    if (self.options.pointInWestButton === true) {

                        m_functionRenderPlumWest(context,
                            dWestLeft - 3,
                            dTop + (rectangle.height - self.options.heightWestPlum) / 2 - 3,
                            self.options.widthWestPlum + 6,
                            self.options.heightWestPlum + 6,
                            "rgb(235,184,185)");
                    } else {

                        m_functionRenderPlumWest(context,
                            dWestLeft,
                            dTop + (rectangle.height - self.options.heightWestPlum) / 2,
                            self.options.widthWestPlum,
                            self.options.heightWestPlum,
                            "rgb(235,184,185)");
                    }

                    var dTop = rectangle.top;
                    if (self.options.mouseDownInEastButton) {

                        dTop += 2;
                    }
                    if (self.options.pointInEastButton === true) {

                        m_functionRenderPlumEast(context,
                            dEastLeft - 3,
                            dTop + (rectangle.height - self.options.heightWestPlum) / 2 - 3,
                            self.options.widthWestPlum + 6,
                            self.options.heightWestPlum + 6,
                            "rgb(235,184,185)");
                    } else {

                        m_functionRenderPlumEast(context,
                            dEastLeft,
                            dTop + (rectangle.height - self.options.heightWestPlum) / 2,
                            self.options.widthWestPlum,
                            self.options.heightWestPlum,
                            "rgb(235,184,185)");
                    }

                    context.save();

                    // Set the clipping area
                    context.beginPath();
                    context.rect(dCenterLeft,
                        rectangle.top,
                        dCenterWidth,
                        rectangle.height);
                    context.clip();

                    // Render out the shaded plums.
                    var iIndex = self.options.firstIndex;
                    var dCursor = dEastLeft + self.options.scrollOffset;
                    while (dCursor + self.options.widthShadedPlumSpace > dHalfNonBody) {

                        while (iIndex < 0) {

                            iIndex += m_arrayPlums.length;
                        }

                        m_functionRenderShadedPlum(context,
                            dCursor,
                            rectangle.top + 2,
                            self.options.widthShadedPlum,
                            self.options.heightShadedPlum,
                            m_arrayPlums[iIndex % m_arrayPlums.length]);

                        // Test the mouse pointer against the plum just rendered.
                        if (self.options.mousePointerCoordinates !== undefined &&
                            self.options.mousePointerCoordinates.x >= dCenterLeft &&
                            self.options.mousePointerCoordinates.x < dCenterLeft + dCenterWidth &&
                            context.isPointInPath(self.options.mousePointerCoordinates.x,
                                self.options.mousePointerCoordinates.y)) {

                            // Re-draw bigger.
                            m_functionRenderShadedPlum(context,
                                dCursor - 4,
                                rectangle.top + 4 - 4,
                                self.options.widthShadedPlum + 8,
                                self.options.heightShadedPlum + 8,
                                m_arrayPlums[iIndex % m_arrayPlums.length]);
                        }


                        iIndex++;
                        dCursor -= self.options.widthShadedPlumSpace;
                    }

                    context.restore();

                    return null;
                } catch (e) {

                    return e;
                }
            };

            var m_functionRenderShadedPlum = function (context,
                dLeft,
                dTop,
                dWidth,
                dHeight,
                strURL) {

                try {

                    var dDeltaX = 0;
                    var dDeltaY = -10;
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
                    } else if (strURL === "WestArrow") {

                        m_functionRenderPlumWest(context,
                            dLeft + 30,
                            dTop + 30,
                            40,
                            40,
                            "rgb(235,184,185)");

                        return null;
                    } else if (strURL === "EastArrow") {

                        m_functionRenderPlumEast(context,
                            dLeft + 30,
                            dTop + 30,
                            40,
                            40,
                            "rgb(235,184,185)");

                        return null;
                    } else if (strURL === "AddPlum") {

                        m_functionRenderPlum(context,
                            dLeft + 40,
                            dTop + 40,
                            20,
                            20,
                            "#888",
                            1,
                            true);

                        return null;
                    } else if (strURL === "EventPlum") {

                        m_functionRenderPlum(context,
                            dLeft + 40,
                            dTop + 40,
                            20,
                            20,
                            "rgb(235,184,185)",
                            1);

                        return null;
                    }

                    // Draw the shadow.
                    for (var i = 0; i < 5; i++) {

                        m_functionRenderPlum(context,
                            dLeft + i,
                            dTop + 5 + i / 5,
                            dWidth,
                            dHeight,
                            "rgba(0,0,0,0.1)");
                    }

                    m_functionRenderPlum(context,
                        dLeft,
                        dTop,
                        dWidth,
                        dHeight,
                        strFillStyle);

                    var img = m_objectImages[strURL];
                    context.drawImage(img,
                        dLeft + (dWidth - img.width) / 2 + dDeltaX,
                        dTop + (dHeight - img.height) / 2 + dDeltaY);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            var m_functionRenderPlum = function (context,
                dLeft,
                dTop,
                dWidth,
                dHeight,
                strFillStyle,
                dEndGap,
                bRenderPlus) {

                try {

                    if (dEndGap === undefined) {

                        dEndGap = 2;
                    }
                    context.fillStyle = strFillStyle;
                    context.beginPath();

                    context.moveTo(dLeft + dWidth / 2 + dEndGap,
                        dTop + dHeight);
                    context.lineTo(dLeft + 3 * dWidth / 4,
                        dTop + dHeight - dWidth / 4);
                    context.bezierCurveTo(dLeft + dWidth,
                        dTop + dHeight - dWidth / 2,
                        dLeft + dWidth,
                        dTop,
                        dLeft + dWidth / 2,
                        dTop);
                    context.bezierCurveTo(dLeft,
                        dTop,
                        dLeft,
                        dTop + dHeight - dWidth / 2,
                        dLeft + dWidth / 4,
                        dTop + dHeight - dWidth / 4);
                    context.lineTo(dLeft + dWidth / 2 - dEndGap,
                        dTop + dHeight);

                    context.closePath();
                    context.fill();

                    if (bRenderPlus === true) {

                        context.lineWidth = 3;

                        context.strokeStyle = "#333";
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

                    return null;
                } catch (e) {

                    return e;
                }
            };

            var m_functionRenderPlumWest = function (context,
                dLeft,
                dTop,
                dWidth,
                dHeight,
                strFillStyle) {

                try {

                    context.fillStyle = strFillStyle;
                    context.beginPath();

                    context.moveTo(dLeft,
                        dTop + dHeight / 2 + 2);
                    context.lineTo(dLeft + dWidth / 4,
                        dTop + 3 * dHeight / 4);
                    context.bezierCurveTo(dLeft + dWidth / 2,
                        dTop + dHeight,
                        dLeft + dWidth,
                        dTop + dHeight,
                        dLeft + dWidth,
                        dTop + dHeight / 2);
                    context.bezierCurveTo(dLeft + dWidth,
                        dTop,
                        dLeft + dWidth / 2,
                        dTop,
                        dLeft + dWidth / 4,
                        dTop + dHeight / 4);
                    context.lineTo(dLeft,
                        dTop + dHeight / 2 - 2);

                    context.closePath();
                    context.fill();

                    return null;
                } catch (e) {

                    return e;
                }
            };

            var m_functionRenderPlumEast = function (context,
                dLeft,
                dTop,
                dWidth,
                dHeight,
                strFillStyle) {

                try {

                    context.fillStyle = strFillStyle;
                    context.beginPath();

                    context.moveTo(dLeft + dWidth,
                        dTop + dHeight / 2 + 2);
                    context.lineTo(dLeft + dWidth - dWidth / 4,
                        dTop + 3 * dHeight / 4);
                    context.bezierCurveTo(dLeft + dHeight - dWidth / 2,
                        dTop + dHeight,
                        dLeft,
                        dTop + dHeight,
                        dLeft,
                        dTop + dHeight / 2);
                    context.bezierCurveTo(dLeft,
                        dTop,
                        dLeft + dWidth - dWidth / 2,
                        dTop,
                        dLeft + dWidth - dWidth / 4,
                        dTop + dWidth / 4);
                    context.lineTo(dLeft + dWidth,
                        dTop + dHeight / 2 - 2);

                    context.closePath();
                    context.fill();

                    return null;
                } catch (e) {

                    return e;
                }
            };

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

            var m_objectImages = {


            };

            var self = this;
        };

        return functionRet;
    });
