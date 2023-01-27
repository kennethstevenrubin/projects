///////////////////////////////////////
// RegionRunner module.
//
// Sets up for regions.
//

"use strict";

// AMD includes.
define(["./prototypes",
    "./CodeRegion",
    "./regions/Region",
    "./regions/RegionButton",
    "./regions/RegionButtonCombo",
    "./regions/RegionButtonLabel",
    "./regions/RegionButtonPinched",
    "./regions/RegionButtonRounded",
    "./regions/RegionButtonRoundedCentered",
    "./regions/RegionComboList",
    "./regions/RegionInput",
    "./regions/RegionLabel"],
    function (prototypes, 
        CodeRegion, 
        Region,
        RegionButton,
        RegionButtonCombo,
        RegionButtonLabel,
        RegionButtonPinched, 
        RegionButtonRounded, 
        RegionButtonRoundedCentered,
        RegionComboList,
        RegionInput,
        RegionLabel) {

        try {

            // Statement constructor function.
        	var functionRet = function RegionRunner() {

                try {

            		var self = this;          // Uber closure.

                    /////////////////////
                    // Public.

                    // Create instance.
                    self.create = function () {

                        try {

                            var cr = new CodeRegion();
                            var exceptionRet = cr.create();
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            var rbc = new RegionButtonCombo({

                                left:10,
                                top:10,
                                click: function () {

                                    alert("Click RegionButtonCombo");
                                }
                            });
                            exceptionRet = cr.addRegion(rbc);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            var rbl = new RegionButtonLabel({

                                left:110,
                                top:30,
                                click: function () {

                                    alert("Click RegionButtonLabel");
                                }
                            });
                            exceptionRet = cr.addRegion(rbl);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            var rbp = new RegionButtonPinched({

                                left:210,
                                top:150,
                                click: function () {

                                    alert("Click RegionButtonPinched");
                                },
                                label: {

                                    text: "Fred"
                                }
                            });
                            exceptionRet = cr.addRegion(rbp);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            var rbr = new RegionButtonRounded({

                                left:310,
                                top:170,
                                click: function () {

                                    alert("Click RegionButtonRounded");
                                },
                                label: {

                                    text: "Sally"
                                }
                            });
                            exceptionRet = cr.addRegion(rbr);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            var rbrc = new RegionButtonRoundedCentered({

                                left:410,
                                top:90,
                                zIndex:2,
                                click: function () {

                                    alert("Click RegionButtonRoundedCentered");
                                },
                                label: {

                                    text: "Sally"
                                }
                            });
                            exceptionRet = cr.addRegion(rbrc);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            var rcl = new RegionComboList({

                                width:200,
                                left:10,
                                top:350,
                                click: function () {

                                    alert("Click RegionComboList");
                                },
                                list: {

                                    items: [{ text: "Abc", selected: false },
                                        { text: "123", selected: false },
                                        { text: "Test", selected: true }]
                                }
                            });
                            exceptionRet = cr.addRegion(rcl);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            var ri = new RegionInput({

                                left:110,
                                top:210,
                                click: function () {

                                    alert("Click RegionInput");
                                }
                            });
                            exceptionRet = cr.addRegion(ri);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            var ri2 = new RegionInput({

                                left:110,
                                top:240,
                                click: function () {

                                    alert("Click RegionInput 2");
                                }
                            });
                            exceptionRet = cr.addRegion(ri2);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            var rl = new RegionLabel({

                                left:210,
                                top:310,
                                click: function () {

                                    alert("Click RegionLabel");
                                }
                            });
                            exceptionRet = cr.addRegion(rl);
                            if (exceptionRet) {

                                throw exceptionRet;
                            }

                            return null;
                        } catch (e) {

                            return e;
                        }
                    };

                    /////////////////////
                    // Private.

                } catch (e) {

                    alert(e.message);
                }
        	};

            // Return Require module component.
        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
