////////////////////////////////////////
// PageConfirmStop -- The other end page.
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/Page"],
    function (prototypes,
        Page) {

        // Define constructor function.
        var functionRet = function PageConfirmStop(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from Page.
            self.inherits(Page, {

                configuration: {
                
                    breadcrumbLabel: {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: ">  Exit wizard",
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
                	
                    congratsLabel: {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: "Want to switch to Plum Mode?",
                                lineHeight: 46,
                                font: "300 42px Open Sans",
                                fillStyle: "#7FB062"
                            },
                            left: 20,
                            top: 45,
                            width: 700,
                            height: 92
                        }
                    },
                	
                    confirmLabel1: {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: "You can leave the wizard at any time if you think you've entered enough information.",
                                lineHeight: 24,
                                font: "300 18px Open Sans",
                                fillStyle: "#666666"
                            },
                            left: 20,
                            top: 106,
                            width: 200,
                            height: 200
                        }
                    },
                	
                    confirmLabel2: {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: "You'll also be able to enter additional information and make changes in Plum Mode.",
                                lineHeight: 24,
                                font: "300 18px Open Sans",
                                fillStyle: "#666666"
                            },
                            left: 272,
                            top: 106,
                            width: 600,
                            height: 200
                        }
                    },
                	
                    pinchedButton: {
                    
                        type: "RegionButtonPinched",
                        options: {
                        
                            click: function () {
                            	
                            	try {

                            		self.options.wizard.onExitingWizard({});
                            		
                            	} catch (e) {
                            		
                            		alert(e.message);
                            	}
                            },
                            label: {
                          
                                text: "Switch to Plum Mode"
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
        functionRet.inherits(Page);

        // Return constructor function.
        return functionRet;
    });
