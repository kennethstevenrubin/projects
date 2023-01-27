///////////////////////////////////////
// Main application module.
//

"use strict";

// The main module requires other modules, it does not define its own, per se.
require(["./prototypes",
    "./CodeArea",
    "./Block",
    "./Method",
    "./Statement",
    "./StatementFor",
    "./StatementInvoke",
    "./StatementNewStatement"],
    function (prototypes, CodeArea, Block, Method, Statement, StatementFor, StatementInvoke, StatementNewStatement) {

        try {

            // Allocate and initialize a dummy method to display.
            var method = new Method("LoopAndAlert",
                ["iMaxCount", "+"]);

            // Build the statements comprising this method.
            var statementFor = new StatementFor();
            statementFor.initialization = "var i = 0";
            statementFor.condition = "i < iMaxCount";
            statementFor.increment = "i++";
            var statementInvoke = new StatementInvoke();
            statementInvoke.parameters.push("i");
            statementInvoke.parameters.push("+");
            statementInvoke.instance = "window";
            statementInvoke.method = "alert";
            statementFor.behavior.addStatement(statementInvoke);
            statementFor.behavior.addStatement(new StatementNewStatement());
            var exceptionRet = method.behavior.addStatement(statementFor);
            if (exceptionRet) {

                throw exceptionRet;
            }

            var statementNewStatement = new StatementNewStatement();
            var exceptionRet = method.behavior.addStatement(statementNewStatement);
            if (exceptionRet) {

                throw exceptionRet;
            }

            // Allocate and create the code area object.
            var ca = new CodeArea();
            exceptionRet = ca.create(method);
            if (exceptionRet) {

                throw exceptionRet;
            }
        } catch (e) {

            alert(e.message);
        }
    });
