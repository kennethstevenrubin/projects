////////////////////////////////////////////
// Everyday Life section.

"use strict";

define(["App/SectionTabEventBase"],
    function (SectionTabEventBase) {

        // Define Everyday Life Section constructor function.
        var functionRet = function SectionEverydayLife(optionsOverride) {

            var self = this;            // Uber-closure.

            // Inhert from SectionTabEventBase.
            self.inherits(SectionTabEventBase,
                optionsOverride);       // Pass constructor parameter to base class.

            // Override base public options.
            self.options.title = "Everyday Life";

            ///////////////////////////////////////////////////
            // Override methods.

            // Toggle collapsed state.
            self.toggleCollapsed = function () {

                try {

                    self.options.everydayLife.collapsed = (self.options.everydayLife.collapsed ? false : true);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            /////////////////////////////////////////
            // Override properties.

            // Return the height required by the section.
            self.getHeight = function () {

                // Just return 0 if invisible.
                if (self.isVisible() === false) {

                    return 0;
                }

                // Just return header height if invisible.
                if (self.isCollapsed()) {

                    return self.options.everydayLife.headerHeight + 1;
                }

                return self.options.everydayLife.rowHeight * (self.options.renderData.length + (self.options.showPlusPlum ? 1 : 0)) +
                    ((self.showHeader()) ? self.options.everydayLife.headerHeight : 0) +
                    self.options.everydayLife.paddingHeight;
            };

            // Return bool indicating visibility of SectionTab.
            self.isVisible = function () {

                return self.options.everydayLife.visible;
            };

            // Return bool indicating collapsed status of SectionTab.
            self.isCollapsed = function () {

                return self.options.everydayLife.collapsed;
            };

            // Return bool indicating the visibility of the header.
            self.showHeader = function () {

                return self.options.everydayLife.showHeader;
            };

            // Return bool indicating the visibility of the headerName.	Jerry
            self.showHeaderName = function () {

                return self.options.everydayLife.showHeaderName;
            };
        };

        // One-time Function.inherits injections.
        functionRet.inherits(SectionTabEventBase);

        // Return constructor.
        return functionRet;
    });
