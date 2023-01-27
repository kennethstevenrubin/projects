////////////////////////////////////////
// Page1_1 -- User cannot do HH in Wizard.
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageBaseWith3Buttons"],
    function (prototypes,
    		PageBaseWith3Buttons) {

        // Define constructor function.
        var functionRet = function Page1_1(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from PageBaseWith3Buttons.
            self.inherits(PageBaseWith3Buttons, {

                configuration: {
                
                    hhRoundedButton: {

                        options: {
                        
                        	enabled: optionsOverride.wizard.options.wizData.household.sectionButtonEnabled
                        }
                    },
                    asRoundedButton: {

                        options: {
                        
                        	enabled: optionsOverride.wizard.options.wizData.assets.sectionButtonEnabled
                        }
                    },
                    elRoundedButton: {

                        options: {
                        
                        	enabled: optionsOverride.wizard.options.wizData.everydayLife.sectionButtonEnabled
                        }
                    },
                    breadcrumbLabel: {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: ">  Household",
                                lineHeight: 12,
                                font: "12px Arial",
                                fillStyle: "#666666"
                            },
                            left: 20,
                            top: 15,
                            width: 300,
                            height: 200
                        }
                    },
                	
                    gibLabel1: {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: "We've found your household data.",
                                lineHeight: 46,
                                font: "300 42px Open Sans",
                                fillStyle: "#7FB062"
                            },
                            left: 20,
                            top: 45,
                            width: 450,
                            height: 46
                        }
                    },
                    
                    alreadyLabel: {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: "You've already entered information about your household.",
                                lineHeight: 24,
                                font: "300 18px Open Sans",
                                fillStyle: "#666666"
                            },
                            left: 20,
                            top: 152,
                            width: 200,
                            height: 200
                        }
                    },
                    jumpOutLabel: {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: "You can update it using the 'Household' page now if necessary. Otherwise, click 'Continue' if you're ready to go on.",
                                lineHeight: 24,
                                font: "300 18px Open Sans",
                                fillStyle: "#666666"
                            },
                            left: 272,
                            top: 152,
                            width: 600,
                            height: 200
                        }
                    },
                    lgsPinchedButton: {
                    
                        type: "RegionButtonPinched",
                        options: {
                        
                            click: function () {

                                try {
                          
                                	var pageId = self.options.wizard.getNextPageId("assetsRetirement");	// can return 4_2 or 4_1
                                    var exceptionRet = self.options.wizard.loadPage(pageId);
                                    if (exceptionRet !== null) {
                          
                                        throw exceptionRet;
                                    }
                                } catch (e) {
                          
                                    alert(e.message);
                                }
                            },
                            label: {
                            	text: "Continue"
                            },
                            left: 272,
                            top: 280,
                            width: 170,
                            height: 30
                        }
                    }
                }
            }.inject(optionsOverride));
        };

        // One-time injection.
        functionRet.inherits(PageBaseWith3Buttons);

        // Return constructor function.
        return functionRet;
    });
