///////////////////////////////////////
// StatementFor module.
//
// Return constructor function.
//

"use strict";

// Require-AMD, and dependencies.
define(["./prototypes",
    "./options",
    "./Area",
    "./Point",
    "./Size",
    "./Statement"],
    function (prototypes, options, Area, Point, Size, Statement) {

        try {

            // Constructor function.
        	var functionRet = function StatementInvoke() {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from base class.
                    self.inherits(Statement);

                    //////////////////
                    // Public fields.

                    // Hold on the block that owns this statement.
                    self.instance = null;
                    self.method = null;
                    self.parameters = [];

                    //////////////////
                    // Public methods.

                    // Method returns the height of all contained statements.
                    self.innerGetHeight = function () {

                        // For now, boring....
                        var dHeight = (3 + self.parameters.length) * options.textHeight + options.textDataBorder.height + options.blockBorder.height;
                        return dHeight;
                    };

                    // Render instance details.
                    self.innerRender = function (iMS, contextRender, areaRender) {

                        try {

                            // Invoke.
                            contextRender.fillStyle = options.textDataFill;
                            contextRender.font = options.textDataFont;
                            contextRender.fillText("Invoke",
                                areaRender.location.x + options.textDataBorder.width,
                                areaRender.location.y + options.textDataBorder.height,
                                areaRender.extent.width - options.textDataBorder.width);

                            // Instance.
                            contextRender.fillStyle = options.textDataFill;
                            contextRender.font = options.textDataFont;
                            contextRender.fillText("Instance",
                                areaRender.location.x + 2 * options.textDataBorder.width,
                                areaRender.location.y + options.textDataBorder.height + options.textHeight,
                                areaRender.extent.width - 2 * options.textDataBorder.width);

                            // Draw the instance expression.
                            m_areaInstance = new Area(new Point(areaRender.location.x + options.expressionOffset, areaRender.location.y + options.textDataBorder.height + options.textHeight),
                                new Size(areaRender.extent.width - options.expressionOffset - options.textDataBorder.width * 2, options.textHeight - options.expressionGap));
                            var exceptionRet = m_areaInstance.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            contextRender.fillStyle = options.expressionFill;
                            contextRender.fill();
                            contextRender.strokeStyle = options.parametersStroke;
                            contextRender.stroke();

                            // And finally the instance expression text.
                            contextRender.fillStyle = options.textExpressionFill;
                            contextRender.font = options.textExpressionFont;
                            contextRender.fillText(self.instance,
                                m_areaInstance.location.x + options.textDataBorder.width,
                                m_areaInstance.location.y + options.textDataBorder.height,
                                m_areaInstance.extent.width - options.textDataBorder.width);

                            // Method.
                            contextRender.fillStyle = options.textDataFill;
                            contextRender.font = options.textDataFont;
                            contextRender.fillText("Method",
                                areaRender.location.x + 2 * options.textDataBorder.width,
                                areaRender.location.y + options.textDataBorder.height + 2 * options.textHeight,
                                areaRender.extent.width - 2 * options.textDataBorder.width);

                            // Draw the Method expression.
                            m_areaMethod = new Area(new Point(areaRender.location.x + options.expressionOffset, areaRender.location.y + options.textDataBorder.height + 2 * options.textHeight),
                                new Size(areaRender.extent.width - options.expressionOffset - options.textDataBorder.width * 2, options.textHeight - options.expressionGap));
                            var exceptionRet = m_areaMethod.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            contextRender.fillStyle = options.expressionFill;
                            contextRender.fill();
                            contextRender.strokeStyle = options.parametersStroke;
                            contextRender.stroke();

                            // And finally the method expression text.
                            contextRender.fillStyle = options.textExpressionFill;
                            contextRender.font = options.textExpressionFont;
                            contextRender.fillText(self.method,
                                m_areaMethod.location.x + options.textDataBorder.width,
                                m_areaMethod.location.y + options.textDataBorder.height,
                                m_areaMethod.extent.width - options.textDataBorder.width);

                            // Draw the parameters block.

                            // Draw the opening parameter glyph.
                            contextRender.fillStyle = options.textDataFill;
                            contextRender.font = options.textDataFont;
                            contextRender.fillText("(",
                                areaRender.location.x + options.textDataBorder.width,
                                areaRender.location.y + options.textDataBorder.height + 3 * options.textHeight,
                                areaRender.extent.width);

                            // Draw the statements area.
                            m_areaParameters = new Area(new Point(areaRender.location.x + options.blockBorder.width, areaRender.location.y + options.textDataBorder.height + 3 * options.textHeight),
                                new Size(areaRender.extent.width - 2 * options.blockBorder.width, options.textHeight * 2));
                            var exceptionRet = m_areaParameters.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            contextRender.fillStyle = options.parametersFill;
                            contextRender.fill();
                            contextRender.strokeStyle = options.parametersStroke;
                            contextRender.stroke();

                            contextRender.fillStyle = options.textDataFill;
                            contextRender.font = options.textDataFont;
                            for (var i = 0; i < self.parameters.length; i++) {

                                // Get the parameter.
                                var strParameter = self.parameters[i];
                                contextRender.fillText(strParameter,
                                    m_areaParameters.location.x + options.textDataBorder.width,
                                    m_areaParameters.location.y + options.textHeight * i + options.textDataBorder.height,
                                    m_areaParameters.extent.width);
                            }

                            // Draw the closing staetment glyph.
                            contextRender.fillStyle = options.textDataFill;
                            contextRender.font = options.textDataFont;
                            contextRender.fillText(")",
                                areaRender.location.x + areaRender.extent.width - 22,
                                areaRender.location.y + areaRender.extent.height - options.textHeight - 5,
                                areaRender.extent.width);

                            return null;
                        } catch (e) {

                            return e;
                        }
                    }

                    //////////////////
                    // Private fields.

                    var m_areaInstance = null;
                    var m_areaMethod = null;
                    var m_areaParameters = null;
                } catch (e) {

                    alert(e.message);
                }
        	};

            // Fix up OO prototype-chain.
            functionRet.inheritsFrom(Statement);

        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
