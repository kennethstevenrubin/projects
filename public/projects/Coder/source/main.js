///////////////////////////////////////
// Main application module.
//

"use strict";

define(["coder", "Scanner"],
    function (coder, Scanner) {

        try {

            // Define two closures to allow changes
            // to cause updates to the display.
            var MethodString = "";
            var WorkspaceString = "";

            // Run when loaded.
            $(document).ready(function () {

                try {

                    // Condition blockly, add some blocks:
                    Blockly.Blocks["App_Initialize"] = {

                        init: function() {

                            this.appendDummyInput().appendField("Initialize");
                            this.setColour(133);
                            this.setPreviousStatement(true);
                            this.setNextStatement(true);
                            this.setInputsInline(true);
                            this.setTooltip("Initialize the app instance--called by system.");
                        }
                    };
                    Blockly.JavaScript["App_Initialize"] = function(block) {

                        return [" app.Initialize(); ", Blockly.JavaScript.ORDER_MEMBER];
                    };
                    Blockly.Blocks["App_getThingyInstance"] = {

                        init: function() {

                            this.appendDummyInput().appendField("get Thingy instance");
                            this.setColour(166);
                            this.setOutput(true);
                            this.setInputsInline(true);
                            this.setTooltip(".");
                        }
                    };
                    Blockly.JavaScript["App_getThingyInstance"] = function(block) {

                        return [" app.thingyInstance ", Blockly.JavaScript.ORDER_MEMBER];
                    };
                    Blockly.Blocks["App_setThingyInstance"] = {

                        init: function() {

                            this.appendDummyInput().appendField("set Thingy instance");
                            this.appendValueInput('VALUE').appendField('to');
                            this.setColour(200);
                            this.setPreviousStatement(true);
                            this.setNextStatement(true);
                            this.setInputsInline(true);
                            this.setTooltip("Set it.");
                        }
                    };
                    Blockly.JavaScript["App_setThingyInstance"] = function(block) {

                        var strValue = Blockly.JavaScript.valueToCode(block, "VALUE",Blockly.JavaScript.ORDER_ADDITION) || "";
                        return " app.thingyInstance = " + strValue + "; "
                    };

                    Blockly.Blocks["new_Thingy"] = {

                        init: function() {

                            this.appendDummyInput().appendField("new Thingy");
                            this.setColour(0);
                            this.setOutput(true);
                            this.setInputsInline(true);
                            this.setTooltip("Allocate new type instance.");
                        }
                    };
                    Blockly.JavaScript["new_Thingy"] = function(block) {

                        return [" new Thingy() ", Blockly.JavaScript.ORDER_MEMBER];
                    };

                    Blockly.Blocks["Thingy_getX"] = {

                        init: function() {

                            this.appendDummyInput().appendField("get X");
                            this.appendValueInput('SELF').appendField('from');
                            this.setColour(33);
                            this.setOutput(true);
                            this.setInputsInline(true);
                            this.setTooltip("Get X.");
                        }
                    };
                    Blockly.JavaScript["Thingy_getX"] = function(block) {

                        var strId = Blockly.JavaScript.valueToCode(block,"SELF",Blockly.JavaScript.ORDER_ADDITION) || "";
                        return [" " + strId + "['X'] ", Blockly.JavaScript.ORDER_MEMBER];
                    };

                    Blockly.Blocks["Thingy_setX"] = {

                        init: function() {

                            this.appendDummyInput().appendField("set X");
                            this.appendValueInput('SELF').appendField('in');
                            this.appendValueInput('VALUE').appendField('to');
                            this.setColour(66);
                            this.setPreviousStatement(true);
                            this.setNextStatement(true);
                            this.setInputsInline(true);
                            this.setTooltip("Set X.");
                        }
                    };
                    Blockly.JavaScript["Thingy_setX"] = function(block) {

                        var strId = Blockly.JavaScript.valueToCode(block,"SELF",Blockly.JavaScript.ORDER_ADDITION) || "";
                        var strValue = Blockly.JavaScript.valueToCode(block, "VALUE",Blockly.JavaScript.ORDER_ADDITION) || "";
                        return " " + strId + "['X'] = " + strValue + "; "
                    };

                    Blockly.Blocks["Thingy_DoIt"] = {

                        init: function() {

                            this.appendDummyInput().appendField("do It");
                            this.appendValueInput('SELF').appendField('using');
                            this.setColour(255);
                            this.setOutput(true);
                            this.setInputsInline(true);
                            this.setTooltip("Do it.");
                        }
                    };
                    Blockly.JavaScript["Thingy_DoIt"] = function(block) {

                        var strId = Blockly.JavaScript.valueToCode(block,"SELF",Blockly.JavaScript.ORDER_ADDITION) || "";
                        return [" " + strId + "['DoIt']() ", Blockly.JavaScript.ORDER_MEMBER];
                    };

                    // Load blockly up.
                    Blockly.inject($("#FrameDiv")[0], {

                        toolbox: document.getElementById("toolbox"),
                        grid: {

                            spacing: 20,
                            length: 3,
                            colour: '#ccc',
                            snap: true
                        },
                        trashcan: true
                    });

                    // Listen in on changes to update the GUI.
                    Blockly.mainWorkspace.addChangeListener(function () {

                        var strMethodString = Blockly.JavaScript.workspaceToCode();
                        if (MethodString !== strMethodString) {

                            MethodString = strMethodString;
                            $("#MethodDiv").text(MethodString);
                        }

                        var strWorkspaceString = Blockly.Xml.domToText(Blockly.Xml.workspaceToDom(Blockly.mainWorkspace));
                        if (WorkspaceString !== strWorkspaceString) {

                            WorkspaceString = strWorkspaceString;
                            $("#WorkspacesDiv").text(WorkspaceString);
                        }
                    });

                    // Allocate scanner object which listens for blocks.
                    var scanner = new Scanner();
                    var exceptionRet = scanner.create();
                    if (exceptionRet) {

                        throw exceptionRet;
                    }

                    // Add alert("Hello, World!");.

                    exceptionRet = coder.add_GetVariable("self", 10, 10);
                    if (exceptionRet) {

                        throw exceptionRet;
                    }

                    exceptionRet = coder.add_GetVariable("ea", 10, 40);
                    if (exceptionRet) {

                        throw exceptionRet;
                    }

                    exceptionRet = coder.add_AllocateType("Thingy");
                    if (exceptionRet) {

                        throw exceptionRet;
                    }

                    exceptionRet = coder.add_SetPropertyValue("Thingy",
                        "X",
                        "100",
                        "ThingyInstance");
                    if (exceptionRet) {

                        throw exceptionRet;
                    }                
                } catch (e) {

                    alert(e.message);
                }
            });
        } catch (e) {

            alert(e.message);
        }
    });
