///////////////////////////////////////
// StatementNewStatement module.
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
    "./StatementFor"],
    function (prototypes, options, Area, Point, Size, Statement, StatementFor) {

        try {

            // Constructor function.
        	var functionRet = function StatementNewStatement() {

                try {

            		var self = this;                        // Uber closure.

                    // Inherit from base class.
                    self.inherits(Statement);

                    //////////////////
                    // Public fields.

                    // .

                    //////////////////
                    // Public methods.

                    // Method returns the height of all contained statements.
                    self.innerGetHeight = function () {

                        // For now, boring....
                        var dHeight = options.textHeight + 2 * options.expressionGap;
                        return dHeight;
                    };

                    // Render instance details.
                    self.innerRender = function (iMS, contextRender, areaRender) {

                        try {

                            // +.
                            contextRender.fillStyle = options.textDataFill;
                            contextRender.font = options.textDataFont;
                            contextRender.fillText("+",
                                areaRender.location.x + options.textDataBorder.width,
                                areaRender.location.y + options.textDataBorder.height,
                                options.plusWidth);

                            // Draw the Statement For area.
                            m_areaStatementFor = new Area(new Point(areaRender.location.x + options.statementNewStatementForOffset, areaRender.location.y + options.expressionGap),
                                new Size(options.statementNewStatementForWidth, options.textHeight));
                            var exceptionRet = m_areaStatementFor.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            contextRender.fillStyle = options.expressionFill;
                            contextRender.fill();
                            contextRender.strokeStyle = options.parametersStroke;
                            contextRender.stroke();

                            // For.
                            contextRender.fillStyle = options.textDataFill;
                            contextRender.font = options.textStatementFont;
                            contextRender.fillText("For",
                                m_areaStatementFor.location.x + options.textDataBorder.width,
                                m_areaStatementFor.location.y + options.textDataBorder.height,
                                options.statementNewStatementForWidth - 2 * options.textDataBorder.width);

                            // Draw the Statement Invoke area.
                            m_areaStatementInvoke = new Area(new Point(areaRender.location.x + options.statementNewStatementInvokeOffset, areaRender.location.y + options.expressionGap),
                                new Size(options.statementNewStatementInvokeWidth, options.textHeight));
                            var exceptionRet = m_areaStatementInvoke.generateRoundedRectPath(contextRender);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }
                            contextRender.fillStyle = options.expressionFill;
                            contextRender.fill();
                            contextRender.strokeStyle = options.parametersStroke;
                            contextRender.stroke();

                            // For.
                            contextRender.fillStyle = options.textDataFill;
                            contextRender.font = options.textStatementFont;
                            contextRender.fillText("Invoke",
                                m_areaStatementInvoke.location.x + options.textDataBorder.width,
                                m_areaStatementInvoke.location.y + options.textDataBorder.height,
                                options.statementNewStatementInvokeWidth - 2 * options.textDataBorder.width);

                            return null;
                        } catch (e) {

                            return e;
                        }
                    }

                    //////////////////
                    // Private fields.

                    // Area to allocate a new for statement.
                    var m_areaStatementFor = null;
                    var m_areaStatementInvoke = null;
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
