////////////////////////////////////////
// Page5_8 -- Do you have any bank accounts?
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page5_8(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from PageBaseWith3Buttons.
            self.inherits(PageRowBase, {
            	
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
                    }
                },
            	rows : {
            		
            		breadcrumb: {

            			text: ">  Assets"
            		},
            		question: {
            			
            			text: "Would you like to enter information about your bank accounts?"
            		},
            		additionalInfo: {
            			
            			visible: false
            		},
            		userAction: {
            			
            			configuration: {
            				
            				yesButton: {
            					
            					type: "RegionButtonRoundedCentered",
            					options: {
            						label: {
            							text: "Yes",
            							font: "14px Arial"
            						},
            						left: 20,
            						width: 75,
            						height: 30,
            						selected: (optionsOverride.wizard.options.wizData.answer5_8 === "Yes"),
            						click: function() {
            							
            							try {
            								
            								self.options.wizard.options.wizData.answer5_8 = "Yes";
            								
            								self.options.configuration.noButton.instance.setSelected(false);
            								this.setSelected(true);
            								
            								if (self.options.wizard.options.wizData.assets.otherBankAccounts.accounts.length === 0){

            									self.options.wizard.options.wizData.assets.otherBankAccounts.accounts.push({
	            									name: "",
	            									type: "",
	            									value: "$"
	            								});
            								}

            								self.options.wizard.options.wizData.index = 0;
            								var exceptionRet = self.options.wizard.loadPage("Page5_9");
            								if (exceptionRet !== null) {
            									
            									throw exceptionRet;
            								}
            							} catch (e){
            								
            								alert(e.message);
            							}
            						}
            					}
            				},
            				
            				noButton: {
            					
            					type: "RegionButtonRoundedCentered",
            					options: {
            						label: {
            							text: "No",
            							font: "14px Arial"
            						},
            						left: 81,
            						width: 100,
            						height: 30,
            						selected: (optionsOverride.wizard.options.wizData.answer5_8 === "No"),
            						click: function() {
            							
            							try {
            								
            								self.options.wizard.options.wizData.answer5_8 = "No";

            								self.options.configuration.yesButton.instance.setSelected(false);
            								this.setSelected(true);
            								self.options.wizard.options.wizData.index = -1;
            								self.options.wizard.options.wizData.assets.otherBankAccounts.accounts = [];
            								var exceptionRet = self.options.wizard.loadPage("Page1_3");
            								if (exceptionRet !== null) {
            									
            									throw exceptionRet;
            								}
            							} catch (e){
            								
            								alert(e.message);
            							}
            						}
            					}
            				}
            			}
            		},
            		whyQuestion: {
            			
            			visible: false
            		},
            		whyAnswer: {
            			
            			visible: false
            		},
            		previousSkipLinks: {
            			
                        previousVisible: true,
                        skipVisible: false,
                        previousClick: function() {
                        	
                        	try {
                        	
	                        	var pageId;
	                        	
	                        	if (self.options.wizard.options.wizData.investmentRiskModel !== "")
	                        		pageId = "Page5_6a";
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
            }.inject(optionsOverride));
        };
        
        // One-time injection.
        functionRet.inherits(PageRowBase);
        
        // Return constructor function.
        return functionRet;
	});

