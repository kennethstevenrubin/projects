/////////////////////////////////////////////////////////////
// Invoked when require is loaded.

"use strict";

// Simply require the VonNeumann type.
require(["./VonNeumann"],
    function (VonNeumann) {

        try {

            // Allocate VonNeumann instance.  Override some default values....
            var vn = new VonNeumann({

                timeoutMS: 20,
                fillStyle: "rgba(0,0,0,0.5)",
                strokeStyle: "rgba(255,200,0,0.75)",
                lineWidth: 2,
                numberOfColumns: 200,
                numberOfRows: 200,
                width: 800,
                height: 600,
                gggSlideRadius: 40
            });

            // Create the object and start it.
            var exceptionRet = vn.create();
            if (exceptionRet !== null) {

                throw exceptionRet;
            }
        } catch (e) {

            alert(e.message);
        }
    }
);
