///////////////////////////////////////
// Main application module.
// Tests OOP imeplementation.

"use strict";

require(["Object",                      // Included here to cause its code to be executed.
    "Function",                         // Included here to cause its code to be executed.
    "app/Plum"],
    function (Object,
        Function,
        Plum) {

        try {

            var jqPlumCanvas = $("#Plum");
            var context = jqPlumCanvas[0].getContext("2d");
            var rectangle = {

                left: 100,
                top: 100,
                width: 600,
                height: 100
            };

            var plum = new Plum();
            var exceptionRet = plum.create(jqPlumCanvas[0],
                context,
                rectangle);
            if (exceptionRet !== null) {

                throw exceptionRet;
            }
        } catch (e) {

            alert(e.message);
        }
    });
