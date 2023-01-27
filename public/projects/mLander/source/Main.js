///////////////////////////////////////
// Main application module.
//

"use strict";

$(document).ready(function () {

    require(["./TheUberThing"],
        function (TheUberThing) {

            try {

                var tut = new TheUberThing();
                var exceptionRet = tut.create();
                if (exceptionRet) {

                    throw exceptionRet;
                }
            } catch (e) {

                alert(e.message);
            }
        });
});
