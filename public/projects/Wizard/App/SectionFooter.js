////////////////////////////////////////////
// Footer section.

"use strict";

define(["App/SectionYearsBase"],
    function (SectionYearsBase) {

        // Define constructor.
        var functionRet = function SectionFooter(optionsOverride) {

            var self = this;            // Uber-closure.

            // Inherit from SectionYearsBase.
            self.inherits(SectionYearsBase,
                optionsOverride);       // Pass constructor override to base class.

            ////////////////////////////////////////////
            // Override properties.

            // Return the height required by the section.
            self.getHeight = function () {

                // Just return 0 if invisible.
                if (self.isVisible() === false) {

                    return 0;
                }
                return self.options.footer.height;
            };

            // Return bool indicating visibility of Section.
            self.isVisible = function () {

                return self.options.footer.visible;
            };

            // Return true.
            self.showHeader = function () {

                return true;
            };

            // Returns padding for years strip.
            self.getAntiPadding = function () {

                return self.options.footer.renderYearsAntiPadding;
            };
        };

        // One-time function injection.
        functionRet.inherits(SectionYearsBase);

        // Return constructor.
        return functionRet;
    });
