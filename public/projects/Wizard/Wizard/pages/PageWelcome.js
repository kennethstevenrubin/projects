////////////////////////////////////////
// PageWelcome -- The welcome page.
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageBaseWith3Buttons"],
    function (prototypes,
    		PageBaseWith3Buttons) {

        // Define constructor function.
        var functionRet = function PageWelcome(optionsOverride) {

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
                          
                                text: ">  Welcome",
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
                	
                    welcomeLabel1: {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: "Welcome to your plan,",
                                lineHeight: 46,
                                font: "300 42px Open Sans",
                                fillStyle: "#7FB062"
                            },
                            left: 20,
                            top: 45,
                            width: 500,
                            height: 46
                        }
                    },
                    
                    welcomeLabel2: {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: optionsOverride.wizard.options.planName + ".",
                                lineHeight: 46,
                                font: "300 42px Open Sans",
                                fillStyle: "#7FB062"
                            },
                            left: 20,
                            top: 91,
                            width: 600,
                            height: 46
                        }
                    },
                    
                    theWizardLabel: {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: "The Wizard will guide you through some basic questions about your family and your finances.",
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
                    theMoreLabel: {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: "You can add all your information now or come back later to add details to any section. The more detail you add the more powerful Plumvo can be, but you can get started now and add more to your plan at any time.",
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
                          
                                	// Change page.
                                	var pageId = self.options.wizard.getNextPageId("self");
                                    var exceptionRet = self.options.wizard.loadPage(pageId);
                                    if (exceptionRet !== null) {
                          
                                        throw exceptionRet;
                                    }
                                } catch (e) {
                          
                                    alert(e.message);
                                }
                            },
                            label: {
                            	text: "Let's get started!"
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
