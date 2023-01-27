////////////////////////////////////////
// Page5_12 -- Do you have more bank accounts?
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page5_12(optionsOverride) {

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
            			
            			text: "Great. Would you like to enter information about another bank account?"
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
            						selected: (optionsOverride.wizard.options.wizData.beenHere5_12) && (optionsOverride.wizard.options.wizData.index < optionsOverride.wizard.options.wizData.assets.otherBankAccounts.accounts.length - 1),
            						click: function() {
            							
            							try {
            								
                							var numAccts = self.options.wizard.options.wizData.assets.otherBankAccounts.accounts.length;
                							// See Page3_3 for comments.
                							
                							if (self.options.wizard.options.wizData.index === numAccts - 1){
                								
	            								self.options.wizard.options.wizData.assets.otherBankAccounts.accounts.push({
	            									name: "",
	            									type: "",
	            									value: "$"
	            								});
	            								self.options.wizard.options.wizData.index = self.options.wizard.options.wizData.assets.otherBankAccounts.accounts.length - 1;
	                							
                							} else {
                								
            									self.options.wizard.options.wizData.index++;
                							}
                							
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
            						selected: (optionsOverride.wizard.options.wizData.beenHere5_12) && (optionsOverride.wizard.options.wizData.index === optionsOverride.wizard.options.wizData.assets.otherBankAccounts.accounts.length - 1),
            						click: function() {
            							
            							try {
            								
                							self.options.wizard.options.wizData.beenHere5_12 = true;

            								var numAccts = self.options.wizard.options.wizData.assets.otherBankAccounts.accounts.length;
            								// Page3_3 for comments.
            								
            								if (self.options.wizard.options.wizData.index < numAccts - 1) {
            									
            									// There are some to pop.
            									for (var i = numAccts - 1; i > self.options.wizard.options.wizData.index; i--)
            										self.options.wizard.options.wizData.assets.otherBankAccounts.accounts.pop();
            								}
            								
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
            			
            			visible: true
            		},
            		whyAnswer: {
            			
            			visible: false,
            			text: "Letting Plumvo know about all of your bank accounts helps to make your plan more realistic."
            		},
            		previousSkipLinks: {
            			
                        previousVisible: true,
                        skipVisible: false,
            			previousClick: function () {
            				
                            try {
                                
                                var exceptionRet = self.options.wizard.loadPage("Page5_11");
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

