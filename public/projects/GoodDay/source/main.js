////////////////////////////////////////
// Main.js

require([document.location.protocol + "//" + document.domain + "/MithrilLib/data/sql.js"],
    function (sql) {

        try {

            // State fields.
            var strDown = null;
            var bVoted = false;

            // Function calls off to the server to get summation result.
            var functionGetResults = function () {

                try {

                    // Nest the calls to get all three data sets in the success handlers.
                    return sql.execute("GoodDay",
                        "dodouser",
                        "Albatross",
                        "SELECT COUNT(vote), SUM(vote) FROM GoodDay.log",
                        function (arrayTotal) {

                            try {

                                // Call year.
                                var exceptionRet = sql.execute("GoodDay",
                                    "dodouser",
                                    "Albatross",
                                    "SELECT COUNT(vote), SUM(vote) FROM GoodDay.log WHERE YEAR(CURDATE()) = YEAR(stamp)",
                                    function (arrayYearToDate) {

                                        try {

                                            // Call month.
                                            var exceptionRet = sql.execute("GoodDay",
                                                "dodouser",
                                                "Albatross",
                                                "SELECT COUNT(vote), SUM(vote) FROM GoodDay.log WHERE YEAR(CURDATE()) = YEAR(stamp) AND MONTH(CURDATE()) = MONTH(stamp)",
                                                function (arrayMonthToDate) {

                                                    try {

                                                        // Call today.
                                                        var exceptionRet = sql.execute("GoodDay",
                                                            "dodouser",
                                                            "Albatross",
                                                            "SELECT COUNT(vote), SUM(vote) FROM GoodDay.log WHERE YEAR(CURDATE()) = YEAR(stamp) AND MONTH(CURDATE()) = MONTH(stamp) AND DAY(CURDATE()) = DAY(stamp)",
                                                            function (arrayToday) {

                                                                try {

                                                                    // 
                                                                    var iCount = arrayTotal[0]["COUNT(vote)"];
                                                                    var iSum = arrayTotal[0]["SUM(vote)"];
                                                                    var dRatio = iSum / iCount;
                                                                    var bGoodTotal = dRatio >= 0.5;

                                                                    iCount = arrayYearToDate[0]["COUNT(vote)"];
                                                                    iSum = arrayYearToDate[0]["SUM(vote)"];
                                                                    dRatio = iSum / iCount;
                                                                    var bGoodYearToDate = dRatio >= 0.5;

                                                                    iCount = arrayMonthToDate[0]["COUNT(vote)"];
                                                                    iSum = arrayMonthToDate[0]["SUM(vote)"];
                                                                    dRatio = iSum / iCount;
                                                                    var bGoodMonthToDate = dRatio >= 0.5;

                                                                    iCount = arrayToday[0]["COUNT(vote)"];
                                                                    iSum = arrayToday[0]["SUM(vote)"];
                                                                    dRatio = iSum / iCount;
                                                                    var bGoodToday = dRatio >= 0.5;

                                                                    var jPopup = $("#Popup");
                                                                    jPopup.html("<br/>" +
                                                                        "Total: " + bGoodTotal.toString() + "<br/>" +
                                                                        "Year to Date: " + bGoodYearToDate.toString() + "<br/>" +
                                                                        "Month to Date: " + bGoodMonthToDate.toString() + "<br/>" +
                                                                        "Today: " + bGoodToday.toString() + "<br/>"
                                                                        );

                                                                } catch (e) {

                                                                    alert(e.message);
                                                                }
                                                            },
                                                            function (strError) {

                                                                alert(strError);
                                                            },
                                                            true);
                                                        if (exceptionRet !== null) {

                                                            alert(exceptionRet.message);
                                                        }
                                                    } catch (e) {

                                                        alert(e.message);
                                                    }
                                                },
                                                function (strError) {

                                                    alert(strError);
                                                },
                                                true);
                                            if (exceptionRet !== null) {

                                                alert(exceptionRet.message);
                                            }
                                        } catch (e) {

                                            alert(e.message);
                                        }
                                    },
                                    function (strError) {

                                        alert(strError);
                                    },
                                    true);
                                if (exceptionRet !== null) {

                                    alert(exceptionRet.message);
                                }
                            } catch (e) {

                                alert(e.message);
                            }
                        },
                        function (strError) {

                            alert(strError);
                        },
                        true);
                } catch (e) {

                    return e;
                }
            };

            // Function shows an OK message to the user.
            var functionReport = function () {

                try {

                    var jOverlay = $("<div id='Overlay'></div>");
                    $(document.body).append(jOverlay);

                    var jPopup = $("<div id='Popup'></div>");
                    $(document.body).append(jPopup);

                    jPopup.animate({
                                
                        left: "10%",
                        width: "80%"
                    }, 1000, functionGetResults);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Helper method makes transaction with the server and reports progress to user.
            var functionAddLog = function (bValue) {

                try {

                    // There can be only one!
                    bVoted = true;

                    var exceptionRet = sql.execute("GoodDay",
                        "dodouser",
                        "Albatross",
                        "INSERT INTO Log VALUES ('" + (new Date()).formatForMySQLDate() + "', " + bValue.toString() + ")",
                        function (result) {

                            try {
                                // Report to the user.
                                var exceptionRet = functionReport();
                                if (exceptionRet !== null) {

                                    alert(exceptionRet.message);
                                }
                            } catch (e) {

                                alert(e.message);
                            }
                        },
                        function (strError) {

                            alert(strError);
                        },
                        false);
                    if (exceptionRet !== null) {

                        alert(exceptionRet.message);
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Function wires up the mouse handlers to the DOM element.
            var functionWire = function (strDOMElement,
                bValue) {

                try {

                    // Zoom in a little bit on mouse enter.
                    $(strDOMElement).mouseenter(function () {

                        try {

                            $(strDOMElement).animate({

                                "background-size": "60%"
                            }, 100);
                        } catch (e) {

                            alert(e.message);
                        }
                    });
                    // Zoom out a little bit on mouse leave.
                    $(strDOMElement).mouseleave(function () {

                        try {

                            $(strDOMElement).animate({

                                "background-size": "50%"
                            }, 100);

                            // Reset.
                            strDown = null;
                        } catch (e) {

                            alert(e.message);
                        }
                    });
                    // Zoom in a little bit on mouse down.
                    $(strDOMElement).mousedown(function () {

                        try {

                            $(strDOMElement).animate({

                                "background-size": "63%"
                            }, 100);

                            // Set.
                            strDown = strDOMElement;
                        } catch (e) {

                            alert(e.message);
                        }
                    });
                    // Zoom out a little bit on mouse up.
                    $(strDOMElement).mouseup(function () {

                        try {

                            $(strDOMElement).animate({

                                "background-size": "60%"
                            }, 100);

                            // Add a vote to the server.
                            if (strDown === strDOMElement &&
                                !bVoted) {

                                var exceptionRet = functionAddLog(bValue);
                                if (exceptionRet !== null) {

                                    alert(excaptionRet.message);
                                }
                            }

                            // Reset.
                            strDown = null;
                        } catch (e) {

                            alert(e.message);
                        }
                    });

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Wire them up.
            var exceptionRet = functionWire("#bad",
                false);
            if (exceptionRet !== null) {

                alert(exceptionRet.message);
            }
            exceptionRet = functionWire("#good",
                true);
            if (exceptionRet !== null) {

                alert(exceptionRet.message);
            }
        } catch (e) {

            alert(e.message);
        }
    });
