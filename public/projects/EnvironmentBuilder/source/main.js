///////////////////////////////////////
// Main application module.
//

"use strict";

// Define helper method to print to body.
window.print = function (str) {

    try {

        $("#WrapperDiv").append("<div class='ParagraphDiv'>" + str + "</div>");
    } catch (e) {

        alert(e.message);
    }
};

// Define the module code.
define(["Simulator"],
    function (Simulator) {

        try {

            var objectProject = {

                comics: [{

                    evaluator: {

                        // Index across window.instances
                        target: "window.app.ship",
                        condition: {

                            x: 200
                        }
                    },
                    types: [{

                        name: "App",
                        methods: [{

                            name: "initialize",
                            workspace: "<xml>Some stuff...</xml>",
                            code: " self.ship = new Ship(self);  self.ship.x = 0;  self.ship.y = 0; self.ship.dx = 2; self.ship.dy = 1; window.eventCollection['keypress'].push({ target: self.ship, method: 'HandleKeyPress' }); window.eventCollection['bounce'].push({ target: self.ship, method: 'HandleBounce' }); "
                        }],
                        properties: [{

                            name: "ship"
                        }, {

                            name: "context"
                        }],
                        events: []
                    }, {

                        name: "Ship",                
                        methods: [{

                            name: "HandleBounce",
                            parameters: ["ea"],
                            workspace: "<xml>Other stuff...</xml>",
                            code: " if (self.color === 'yellow') { self.color = 'green'; } else { self.color = 'yellow'; } "
                        }, {

                            name: "HandleKeyPress",
                            parameters: ["ea"],
                            workspace: "<xml>Other stuff...</xml>",
                            code: " document.title = ea.key; "
                        }, {

                            name: "update",
                            workspace: "<xml>Other stuff...</xml>",
                            code: " self.x += self.dx; " + 
                                " if (self.x > 780 || self.x < 0) { self.dx *= -1; self.x += self.dx * 2; window.raiseEvent('bounce', {}); } " + 
                                "self.y += self.dy; " +
                                " if (self.y > 580 || self.y < 0) { self.dy *= -1; self.y += self.dy * 2; window.raiseEvent('bounce', {}); } "
                        }, {

                            name: "render",
                            workspace: "<xml>Other stuff...</xml>",
                            code: " self.app.context.fillStyle = self.color; " + 
                                "self.app.context.fillRect(self.x, self.y, 20, 20); "
                        }],
                        properties: [{

                            name: "x"
                        },{

                            name: "dx"
                        },{

                            name: "y"
                        }, {

                            name: "dy"
                        }, {

                            name: "color",
                            initialValue: "red",
                            initialValueQuoted: true
                        }],
                        events: [{

                            name: "bounce"
                        }]
                    }]
                }]
            };

            print("Allocate simulator.");
            var simulator = new Simulator();
            var exceptionRet = simulator.create(objectProject);
            if (exceptionRet) {

                throw exceptionRet;
            }

            // Start simulation.
            print("Start simulation.");
            exceptionRet = simulator.start();
            if (exceptionRet) {

                throw exceptionRet;
            }
        } catch (e) {

            alert(e.message);
        }
    });
