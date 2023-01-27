////////////////////////////////////////
// Page5_7 -- User cannot do Bank Accounts in Wizard.
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageBaseWith3Buttons"],
    function (prototypes,
    		PageBaseWith3Buttons) {

        // Define constructor function.
        var functionRet = function Page5_7(optionsOverride) {

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
                          
                                text: ">  Assets",
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
                          
                                text: "We've found your bank accounts.",
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
                          
                                text: "You've already entered information about your bank accounts which we'll use in this plan.",
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
                          
                                text: "You can update those accounts or add additional accounts from the 'Assets' page if necessary. Click 'Continue' when you're ready to proceed.",
                                lineHeight: 24,
                                font: "300 18px Open Sans",
                                fillStyle: "#666666"
                            },
                            left: 272,
                            top: 152,
                            width: 500,
                            height: 200
                        }
                    },
                    lgsPinchedButton: {
                    
                        type: "RegionButtonPinched",
                        options: {
                        
                            click: function () {

                                try {
                          
                                	// Change page.
                                	var pageId = "Page1_3";
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
                    },
                    prevLink: {
                    	
                        type: "RegionButtonLabel",
                        options: {
                        
                            label: {
                          
                                text: "Previous question",
                                lineHeight: 24,
                                font: "12px Arial",
                                fillStyle: "#934962"
                            },
                            left: 20,
                            top: 360,
                            width: 100,
                            height: 15,
                            click: function() {
                            	
                            	try {
                            	
	                            	var pageId;
	                            	
	                            	if (self.options.wizard.options.wizData.investmentRiskModel !== "")
	                            		pageId = "Page5_6a";
	                            	else if (self.options.wizard.options.wizData.assets.otherInvestmentAccounts.dbDataExists === true)
	                            		pageId = "Page5_1";
	                            	else
	                            		pageId = "Page5_2";
	                            	
	                                var exceptionRet = self.options.wizard.loadPage(pageId);
	                                if (exceptionRet !== null) {
	                      
	                                    throw exceptionRet;
	                                }
	                            } catch (e) {
	                            	
	                            	alert(e.message);
	                            }
                            }
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
