///////////////////////////////////////
// cssLoader loads up CSS files into the DOM.
//
// Returns singleton instance.

"use strict";

define([],
    function () {

        // Constructor function.
        var functionRet = function CssLoader() {

            var self = this;            // Uber-closure.

            ////////////////////////////
            // Public method.

            // Loads up the specfied CSS file into the DOM.
            //
            // strUrl -- URL of CSS file.
            // strId -- Id of the style element.
            // functionError -- error function to invoke on error.
            self.load = function (strUrl,
                strId,
                functionError) {

                try {

                    // Talk to server.
                    $.ajax({

                        url: strUrl,
                        success: function (objectData,
                            strTextStatus,
                            jqxhr) {

                            try {

                                $(document.head).append("<style type='text/css' id='" + strId + "'>" + objectData + "</style>");
                            } catch (e) {

                                // Call error handler.
                                functionError("Processing error: " + e.message);
                            }
                        },
                        error: function (jqxhr,
                            strTextStatus,
                            strError) {

                            // Call error handler.
                            functionError("Communication error: " + strError);
                        }
                    });
                    return null;
                } catch (x) {

                    return x;
                }
            };
        };

        return new functionRet();
    });
