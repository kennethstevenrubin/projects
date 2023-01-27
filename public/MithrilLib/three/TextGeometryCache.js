////////////////////////////////////////
// TextGeometryCache is a singelton object
// which accumulates and holds on to 
// text geometries as needed by Paragraph.
//
// Return singleton.

"use strict";

// Define AMD module.
define([],
    function () {

        // Define String class.
        var functionConstructor = function TextGeometryCache() {

            var self = this;            // Uber closure.

            ////////////////////////////
            // Public fields.

            // Holds geometries statically.
            self.geometries = {

            };
        };

        // Return singleton instance.
        return new functionConstructor();
    });
