///////////////////////////////////////
// Main application module.
//

"use strict";

// The main module requires other modules, it does not define its own, per se.
require(["./prototypes",
    "./RegionRunner"],
    function (prototypes, 
        RegionRunner) {

        try {

            /* Define the data structure for a method.
            var objectMethod = {

                name: "a",
                description: "function a() { for (var i = 0; i < 10; i++) { alert(i); } }",
                arguments: [],
                behavior: [{

                    type: "statementFor",
                    initialization: {

                        type: "expressionAssignment",
                        lhs: {

                            type: "expressionName",
                            name: "i"
                        },
                        operator: "=",
                        rhs: {

                            type: "expressionLiteral",
                            value: "0"
                        }
                    },
                    condition: {

                        type: "expressionInfixOperator",
                        lhs: {

                            type: "expressionName",
                            name: "i"
                        },
                        operator: "<",
                        rhs: {

                            type: "expressionLiteral",
                            value: "10"
                        }
                    },
                    increment: {

                        type: "expressionPostfixOperator",
                        lhs: {

                            type: "expressionName",
                            name: "i"
                        },
                        operator: "++"
                    },
                    behavior: [{

                        type: "statementExpression",
                        expression: {

                            type: "expressionInvocation",
                            function: {

                                type: "expressionName",
                                name: "alert"
                            },
                            parameters: [{

                                type: "expressionName",
                                name: "i"
                            }]
                        }
                    }]
                }]
            };*/

            var rr = new RegionRunner();
            var exceptionRet = rr.create();
            if (exceptionRet) {

                throw exceptionRet;
            }
        } catch (e) {

            alert(e.message);
        }
    });
