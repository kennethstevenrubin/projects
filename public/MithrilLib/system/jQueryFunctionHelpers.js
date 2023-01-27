///////////////////////////////////////
// Module adds textfill to jQuery.
// textfill is then used to maximize the size of text in an element.
//
// Returns ... nothing.
//
// Use:
//
// $("div").textfill({ 
//
//          maxFontPixels: 72,
//          decrement: 1,
//          live: true
//      });
//
// Where div contains the text to fill to maximum size.
// Its parent is used to determine the size to which to fit.

"use strict";

define([],
    function () {

        // Install jQuery function extension
        $.fn.textfill = function (options) {

            // Get the max and min font sizes within which to vary.
            var dFontSize = 72;
            var dMinFontSize = 3;

            // Get a reference to this.
            var jText = $(this);

            // Override values if options passed.
            if (options !== undefined &&
                options !== null) {

                // Update max.
                if (options.maxFontSize !== undefined &&
                    options.maxFontSize !== null) {

                    dFontSize = options.maxFontSize;
                }

                // Update min.
                if (options.minFontSize !== undefined &&
                    options.minFontSize !== null) {

                    dMinFontSize = options.minFontSize;
                }

                // If live, install hander.
                if (options.live !== undefined &&
                    options.live !== null &&
                    options.live === true) {

                    // Handler probably should not specify live....
                    $(window).resize(function () {

                        // Call based on these final values.
                        jText.textfill({

                            maxFontSize: dFontSize,
                            minFontSize: dMinFontSize
                        });
                    });
                }
            }

            // Get the height and width to use from the parent.
            var dMaxHeight = $(this).parent().height();
            var dMaxWidth = $(this).parent().width();

            // Define these out here, so they are accessible in the while clause.
            var dTextHeight = 0;
            var dTextWidth = 0;
            do {

                // Set to guess.
                jText.css({

                    "font-size": dFontSize.toString() + "px"
                });

                // Get the new size.
                dTextHeight = jText.height();
                dTextWidth = jText.width();

                // Decrement, if must loop again.
                dFontSize = dFontSize - 1;

            } while ((dTextHeight > dMaxHeight ||
                dTextWidth > dMaxWidth) &&
                dFontSize > dMinFontSize);
            return this;
        }
    });
