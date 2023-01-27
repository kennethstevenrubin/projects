///////////////////////////////////////
// Block module.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["./prototypes",
    "./Area",
    "./options"],
    function (prototypes, Area, options) {

        try {

            // Constructor function.
        	var functionRet = function Block() {

                try {

            		var self = this;                        // Uber closure.

                    ///////////////////////
                    // Public fields.

                    // Collection of statement blocks.
                    self.statements = [];

                    ///////////////////////
                    // Public methods.

                    // Add child to collection of children.
                    self.addStatement = function (statementChild) {

                        try {

                            self.statements.push(statementChild);
                            statementChild.parent = this;
                            
                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    // Method returns the height of all contained statements.
                    self.getHeight = function () {

                        var dHeight = options.statementGap;
                        // Aggregate all statement heights.
                        for (var i = 0; i < self.statements.length; i++) {

                            // Get the ith statement.
                            var statementIth = self.statements[i];

                            dHeight += (statementIth.getHeight() + options.statementGap);
                        }
                        return dHeight;
                    };

                    // Render instance details.
                    self.render = function (iMS, contextRender, areaRender, dScrollOffset) {

                        try {

                            // Render all statements in a list.
                            var dRunningHeight = 0;
                            for (var i = 0; i < self.statements.length; i++) {

                                // Get the ith statement.
                                var statementIth = self.statements[i];

                                // Render it out.
                                var exceptionRet = statementIth.render(iMS,
                                    contextRender,
                                    areaRender,
                                    dRunningHeight - dScrollOffset + options.statementGap);
                                if (exceptionRet) {

                                    throw exceptionRet;
                                }

                                // Jump down to the bottom of the statement.
                                dRunningHeight += (statementIth.getHeight() + options.statementGap);
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    }
                } catch (e) {

                    alert(e.message);
                }
        	};

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
