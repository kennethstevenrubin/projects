///////////////////////////////////////
// Options module.
//
// Return instance.
//

"use strict";

// Require-AMD, and dependencies.
define(["prototypes"],
    function (prototypes) {

        try {

            // Constructor function.
        	var functionRet = function Options() {

                try {

            		var self = this;                          // Uber closure.

                    ///////////////////////
                    // Public fields.

                    self.general = {

                        cornerRadius: 8,                      // Roundedness.
                        scrollStub: {

                            width: 40,
                            height: 20,
                            yOffset: -10,
                            fillBackground: "#003",
                            strokeBackground: "#ff0",
                            delayMS: 1
                        }
                    };
                    self.tree = {

                        hostSelector: "#TypeTree",            // The host selector.
                        defaultWidth: 400,                    // Arbitrary default width.
                        defaultHeight: 300,                   // Arbitrary default height.
                        fillBackground: "#ddd",               // Background fill color.
                        type: {

                            font: "30px Monospace",           // Font with which to render name.
                            lineHeight: 40,                   // Height of a line of text.
                            strokeBackground: "#999",         // Background border color.
                            fillBackground: "#aaa",           // Background color.
                            strokeBackgroundHighlight: "#bbb",// Highlight background border color.
                            fillBackgroundHighlight: "#777",  // Highlight background color.
                            fillText: "#000",                 // Color of text.
                            textOffset: 10,                   // Positional X-offset.
                            margin: 5                         // Surrounding border.
                        },
                        meta: {

                            height: 300,                      // Height of the open part of meta.
                            font: "20px Monospace",           // Font with which to render name.
                            lineHeight: 30,                   // Height of a line of text.
                            strokeBackground: "#992",         // Background border color.
                            fillBackground: "#aaf",           // Background color.
                            strokeBackgroundHighlight: "#bb4",// Highlight background border color.
                            fillBackgroundHighlight: "#66d",  // Highlight background color.
                            fillText: "#000",                 // Color of text.
                            fillTextHighlight: "#220",        // Color of text highlight.
                            stroke: "#000",                   // .
                            strokeHighlight: "#220",          // .
                            fill: "#fff",                     // .
                            fillHighlight: "#ddd",            // .
                            textOffset: 10,                   // Positional X-offset.
                            textOffsetY: 2,                   // Positional Y-offset.
                            margin: 5                         // Surrounding border.
                        },
                        methods: {

                            font: "20px Monospace",           // Font with which to render name.
                            lineHeight: 30,                   // Height of a line of text.
                            strokeBackground: "#992",         // Background border color.
                            fillBackground: "#aa3",           // Background color.
                            strokeBackgroundHighlight: "#bb4",// Highlight background border color.
                            fillBackgroundHighlight: "#770",  // Highlight background color.
                            fillText: "#000",                 // Color of text.
                            fillTextHighlight: "#004",        // Color of text highlight.
                            textOffset: 10,                   // Positional X-offset.
                            textOffsetY: 2,                   // Positional Y-offset.
                            margin: 5                         // Surrounding border.
                        },
                        method: {

                            font: "16px Monospace",           // Font with which to render name.
                            lineHeight: 25,                   // Height of a line of text.
                            strokeBackground: "#000",         // Background border color.
                            fillBackground: "#fff",           // Background color.
                            strokeBackgroundHighlight: "#000",// Highlight background border color.
                            fillBackgroundHighlight: "#aaa",  // Highlight background color.
                            fillText: "#440",                 // Color of text.
                            fillTextHighlight: "#000",        // Color of text highlight.
                            textOffset: 20,                   // Positional X-offset.
                            margin: 5                         // Surrounding border.
                        },
                        properties: {

                            font: "20px Monospace",           // Font with which to render name.
                            lineHeight: 30,                   // Height of a line of text.
                            strokeBackground: "#929",         // Background border color.
                            fillBackground: "#a3a",           // Background color.
                            strokeBackgroundHighlight: "#b4b",// Highlight background border color.
                            fillBackgroundHighlight: "#707",  // Highlight background color.
                            fillText: "#000",                 // Color of text.
                            fillTextHighlight: "#000",        // Color of text highlight.
                            textOffset: 10,                   // Positional X-offset.
                            textOffsetY: 2,                   // Positional Y-offset.
                            margin: 5                         // Surrounding border.
                        },
                        property: {

                            font: "16px Monospace",           // Font with which to render name.
                            lineHeight: 25,                   // Height of a line of text.
                            strokeBackground: "#000",         // Background border color.
                            fillBackground: "#fff",           // Background color.
                            strokeBackgroundHighlight: "#000",// Highlight background border color.
                            fillBackgroundHighlight: "#aaa",  // Highlight background color.
                            fillText: "#404",                 // Color of text.
                            fillTextHighlight: "#000",        // Color of text highlight.
                            textOffset: 20,                   // Positional X-offset.
                            margin: 5                         // Surrounding border.
                        },
                        events: {

                            font: "20px Monospace",           // Font with which to render name.
                            lineHeight: 30,                   // Height of a line of text.
                            strokeBackground: "#299",         // Background border color.
                            fillBackground: "#3aa",           // Background color.
                            strokeBackgroundHighlight: "#4bb",// Highlight background border color.
                            fillBackgroundHighlight: "#077",  // Highlight background color.
                            fillText: "#000",                 // Color of text.
                            fillTextHighlight: "#400",        // Color of text highlight.
                            textOffset: 10,                   // Positional X-offset.
                            textOffsetY: 2,                   // Positional Y-offset.
                            margin: 5                         // Surrounding border.
                        },
                        event: {

                            font: "16px Monospace",           // Font with which to render name.
                            lineHeight: 25,                   // Height of a line of text.
                            strokeBackground: "#000",         // Background border color.
                            fillBackground: "#fff",           // Background color.
                            strokeBackgroundHighlight: "#000",// Highlight background border color.
                            fillBackgroundHighlight: "#aaa",  // Highlight background color.
                            fillText: "#044",                 // Color of text.
                            fillTextHighlight: "#000",        // Color of text highlight.
                            textOffset: 20,                   // Positional X-offset.
                            margin: 5                         // Surrounding border.
                        }
                    };
                  } catch (e) {

                    alert(e.message);
                }
        	};

            // Allocate and return instance, not constructor.
        	return new functionRet();
        } catch (e) {

            alert(e.message);
        }
    });
