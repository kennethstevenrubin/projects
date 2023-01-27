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
    "./Statement",
    "./Block"],
    function (prototypes, options, Area, Point, Size, Statement, Block) {

        try {

            // Constructor function.
        	var functionRet = function StatementFor() {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from base class.
                    self.inherits(Statement);

                    //////////////////
                    // Public fields.

                    // Hold on the block that owns this statement.
                    self.initialization = null;
                    self.condition = null;
                    self.increment = null;
                    self.behavior = new Block();

                    //////////////////
                    // Public methods.

                    // Method returns the height of all contained statements.
                    self.innerGetHeight = function () {

                        // For now, boring....
                        var dHeight = 4 * options.textHeight + options.textDataBorder.height + self.behavior.getHeight() + options.blockBorder.height;
                        return dHeight;
                    };

                    // Render instance details.
                    self.innerRender = function (iMS, contextRender, areaRender) {

                        try {

                            // For.
                            contextRender.fillStyle = options.textDataFill;
                            contextRender.font = options.textDataFont;
                            contextRender.fillText("For",
                                areaRender.location.x + options.textDataBorder.width,
                                areaRender.location.y + options.textDataBorder.height,
                                areaRender.extent.width - options.textDataBorder.width);

                            // Initialization.
                            contextRender.fillStyle = options.textDataFill;
                            contextRender.font = options.textDataFont;
                            contextRender.fillText("Initialization",
                                areaRender.location.x + 2 * options.textDataBorder.width,
                                areaRender.location.y + options.textDataBorder.height + options.textHeight,
                                areaRender.extent.width - 2 * options.textDataBorder.width);

                            // Draw the Initialization expression.
                            m_areaInitialization = new Area(new Point(areaRender.location.x + options.expressionOffset, areaRender.location.y + options.textDataBorder.height + options.textHeight),
                                new Size(areaRender.extent.width - options.expressionOffset - options.textDataBorder.width * 2, options.textHeight - options.expressionGap));
                            var exceptionRet = m_areaInitialization.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            contextRender.fillStyle = options.expressionFill;
                            contextRender.fill();
                            contextRender.strokeStyle = options.parametersStroke;
                            contextRender.stroke();

                            // And finally the initialize expression text.
                            contextRender.fillStyle = options.textExpressionFill;
                            contextRender.font = options.textExpressionFont;
                            contextRender.fillText(self.initialization,
                                m_areaInitialization.location.x + options.textDataBorder.width,
                                m_areaInitialization.location.y + options.textDataBorder.height,
                                m_areaInitialization.extent.width - options.textDataBorder.width);

                            // Condition.
                            contextRender.fillStyle = options.textDataFill;
                            contextRender.font = options.textDataFont;
                            contextRender.fillText("Condition",
                                areaRender.location.x + 2 * options.textDataBorder.width,
                                areaRender.location.y + options.textDataBorder.height + 2 * options.textHeight,
                                areaRender.extent.width - 2 * options.textDataBorder.width);

                            // Draw the Condition expression.
                            m_areaCondition = new Area(new Point(areaRender.location.x + options.expressionOffset, areaRender.location.y + options.textDataBorder.height + 2 * options.textHeight),
                                new Size(areaRender.extent.width - options.expressionOffset - options.textDataBorder.width * 2, options.textHeight - options.expressionGap));
                            var exceptionRet = m_areaCondition.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            contextRender.fillStyle = options.expressionFill;
                            contextRender.fill();
                            contextRender.strokeStyle = options.parametersStroke;
                            contextRender.stroke();

                            // And finally the condition expression text.
                            contextRender.fillStyle = options.textExpressionFill;
                            contextRender.font = options.textExpressionFont;
                            contextRender.fillText(self.condition,
                                m_areaCondition.location.x + options.textDataBorder.width,
                                m_areaCondition.location.y + options.textDataBorder.height,
                                m_areaCondition.extent.width - options.textDataBorder.width);

                            // Increment.
                            contextRender.fillStyle = options.textDataFill;
                            contextRender.font = options.textDataFont;
                            contextRender.fillText("Increment",
                                areaRender.location.x + 2 * options.textDataBorder.width,
                                areaRender.location.y + options.textDataBorder.height + 3 * options.textHeight,
                                areaRender.extent.width - 2 * options.textDataBorder.width);

                            // Draw the Condition expression.
                            m_areaIncrement = new Area(new Point(areaRender.location.x + options.expressionOffset, areaRender.location.y + options.textDataBorder.height + 3 * options.textHeight),
                                new Size(areaRender.extent.width - options.expressionOffset - options.textDataBorder.width * 2, options.textHeight - options.expressionGap));
                            var exceptionRet = m_areaIncrement.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            contextRender.fillStyle = options.expressionFill;
                            contextRender.fill();
                            contextRender.strokeStyle = options.parametersStroke;
                            contextRender.stroke();

                            // And finally the increment expression text.
                            contextRender.fillStyle = options.textExpressionFill;
                            contextRender.font = options.textExpressionFont;
                            contextRender.fillText(self.increment,
                                m_areaIncrement.location.x + options.textDataBorder.width,
                                m_areaIncrement.location.y + options.textDataBorder.height,
                                m_areaIncrement.extent.width - options.textDataBorder.width);

                            // Draw the behavior block.

                            // Draw the opening statement glyph.
                            contextRender.fillStyle = options.textDataFill;
                            contextRender.font = options.textDataFont;
                            contextRender.fillText("{",
                                areaRender.location.x + options.textDataBorder.width,
                                areaRender.location.y + options.textDataBorder.height + 4 * options.textHeight,
                                areaRender.extent.width);

                            // Draw the statements area.
                            m_areaBehavior = new Area(new Point(areaRender.location.x + options.blockBorder.width, areaRender.location.y + options.textDataBorder.height + 4 * options.textHeight),
                                new Size(areaRender.extent.width - 2 * options.blockBorder.width, self.behavior.getHeight()));
                            var exceptionRet = m_areaBehavior.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            contextRender.fillStyle = options.statementsFill;
                            contextRender.fill();
                            contextRender.strokeStyle = options.statementsStroke;
                            contextRender.stroke();

                            // Draw the actual statements block or statement detail.
                            exceptionRet = self.behavior.render(iMS,
                                contextRender,
                                m_areaBehavior,
                                0);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            // Draw the closing staetment glyph.
                            contextRender.fillStyle = options.textDataFill;
                            contextRender.font = options.textDataFont;
                            contextRender.fillText("}",
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

                    var m_areaInitialization = null;
                    var m_areaCondition = null;
                    var m_areaIncrement = null;
                    var m_areaBehavior = null;
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
