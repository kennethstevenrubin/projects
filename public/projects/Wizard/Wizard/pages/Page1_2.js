////////////////////////////////////////
// Page1_2 -- The end Household page.
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageBaseWith3Buttons"],
    function (prototypes,
    		PageBaseWith3Buttons) {

        // Define constructor function.
        var functionRet = function Page1_2(optionsOverride) {

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
                	
                    hhYayLabel1: {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: "Yay! You've finished setting up your household.",
                                lineHeight: 46,
                                font: "300 42px Open Sans",
                                fillStyle: "#7FB062"
                            },
                            left: 20,
                            top: 45,
                            width: 550,
                            height: 46
                        }
                    },
                    
                    assetsIntro1Label: {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: "Now, we'll ask a few questions about your investments and savings.",
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
                    
                    assetsIntro2Label: {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: "You may want to have information on your investment accounts handy or you can use estimates now and come back later to add more detail.",
                                lineHeight: 24,
                                font: "300 18px Open Sans",
                                fillStyle: "#666666"
                            },
                            left: 272,
                            top: 152,
                            width: 400,
                            height: 200
                        }
                    },
                    
                    lgsPinchedButton: {
                    
                        type: "RegionButtonPinched",
                        options: {
                        
                            click: function () {
                            	
                                 try {
                          
                                    // Change page.
                                	var pageId = self.options.wizard.getNextPageId("assetsRetirement");	// Page4_2 or Page4_1
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
