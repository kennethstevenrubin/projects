///////////////////////////////////////
// Main application module.
//

"use strict";

define(["ScrollRegion"],
    function (ScrollRegion) {

        try {

            // Run when loaded.
            $(document).ready(function () {

                try {

                    // Attach the scroll-region.
                    var sr = new ScrollRegion();
                    var exceptionRet = sr.create("#It",
                        100);
                    if (exceptionRet) {

                        throw exceptionRet;
                    }

                    // Wire click event.
                    sr.click = function (strId) {

                        alert(strId + " clicked.");
                    };

                    for (var i = 0; i < 5; i++) {

                        exceptionRet = sr.addImage(i * 3,
                            "Fred",
                            i * 3,
                            "/media/world.png");
                        if (exceptionRet) {

                            throw exceptionRet;
                        }
                        
                        exceptionRet = sr.addImage(i * 3 + 1,
                            "Wilma",
                            i * 3 + 1,
                            "/media/g.jpg");
                        if (exceptionRet) {

                            throw exceptionRet;
                        }

                        exceptionRet = sr.addImage(i * 3 + 2,
                            "Bert",
                            i * 3 + 2,
                            "/media/2.png");
                        if (exceptionRet) {

                            throw exceptionRet;
                        }
                    }
                } catch (e) {

                    alert(e.message);
                }
            });
        } catch (e) {

            alert(e.message);
        }
    });
