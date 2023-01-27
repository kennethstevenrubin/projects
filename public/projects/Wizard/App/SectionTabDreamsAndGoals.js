////////////////////////////////////////////
// Dreams And Goals section.

"use strict";

define(["App/SectionTabEventBase"],
    function (SectionTabEventBase) {

        // Define Dreams & Goals Section constructor function.
        var functionRet = function SectionDreamsAndGoals(optionsOverride) {

            var self = this;            // Uber-closure.

            // Inherit from base class.
            self.inherits(SectionTabEventBase,
                optionsOverride);       // Pass constructor parameter to base class.

            // Override base-class options object.
            self.options.title = "Dreams & Goals";

            ///////////////////////////////////////////////////
            // Override methods.

            // Toggle collapsed state.
            self.toggleCollapsed = function () {

                try {

                    self.options.dreamsAndGoals.collapsed = (self.options.dreamsAndGoals.collapsed ? false : true);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            /////////////////////////////////////////////
            // Override properties.

            // Return the height required by the section.
            self.getHeight = function () {

                // Just return 0 if invisible.
                if (self.isVisible() === false) {

                    return 0;
                }

                // Just return header height if invisible.
                if (self.isCollapsed()) {

                    return self.options.dreamsAndGoals.headerHeight + 1;
                }

                var iTotalLength = (self.options.renderData.length + (self.options.showPlusPlum ? 1 : 0));

                return self.options.dreamsAndGoals.rowHeight * iTotalLength +
                    (self.showHeader() ? self.options.dreamsAndGoals.headerHeight : 0) +
                    self.options.dreamsAndGoals.paddingHeight;
            };

            // Return bool indicating visibility of SectionTab.
            self.isVisible = function () {

                return self.options.dreamsAndGoals.visible;
            };

            // Return bool indicating collapsed status of SectionTab.
            self.isCollapsed = function () {

                return self.options.dreamsAndGoals.collapsed;
            };

            // Return bool indicating the visibility of the header.
            self.showHeader = function () {

                return self.options.dreamsAndGoals.showHeader;
            };

            // Return bool indicating the visibility of the headerName.	Jerry
            self.showHeaderName = function () {

                return self.options.dreamsAndGoals.showHeaderName;
            };
        };

        // One-time Function.inherits injection.
        functionRet.inherits(SectionTabEventBase);

        // Return constructor.
        return functionRet;
    });
