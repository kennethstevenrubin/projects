////////////////////////////////////////
// Page4_6 -- Do you have more ret accounts (self)?
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page4_6(optionsOverride) {

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
            			
            			text: "Great. Would you like to enter information about another of your retirement accounts?"
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
            						selected: (optionsOverride.wizard.options.wizData.beenHere4_6) && (optionsOverride.wizard.options.wizData.index < optionsOverride.wizard.options.wizData.assets.retirementAccounts.accountsSelf.length - 1),
            						click: function() {
            							
            							try {
            								
                							var numAccts = self.options.wizard.options.wizData.assets.retirementAccounts.accountsSelf.length;
                							// See Page3_3 for comments.
                							
                							if (self.options.wizard.options.wizData.index === numAccts - 1){
                								
	            								self.options.wizard.options.wizData.assets.retirementAccounts.accountsSelf.push({
	            									name: "",
	            									type: "",
	            									value: "$"
	            								});
	            								self.options.wizard.options.wizData.index = self.options.wizard.options.wizData.assets.retirementAccounts.accountsSelf.length - 1;
                							
                							} else {
                								
            									self.options.wizard.options.wizData.index++;
                							}
                							
            								var exceptionRet = self.options.wizard.loadPage("Page4_3");
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
            						selected: (optionsOverride.wizard.options.wizData.beenHere4_6) && (optionsOverride.wizard.options.wizData.index === optionsOverride.wizard.options.wizData.assets.retirementAccounts.accountsSelf.length - 1),
            						click: function() {
            							
            							try {
            								
                							self.options.wizard.options.wizData.beenHere4_6 = true;

            								var numAccts = self.options.wizard.options.wizData.assets.retirementAccounts.accountsSelf.length;
            								// Page3_3 for comments.
            								
            								if (self.options.wizard.options.wizData.index < numAccts - 1) {
            									
            									// There are some to pop.
            									for (var i = numAccts - 1; i > self.options.wizard.options.wizData.index; i--)
            										self.options.wizard.options.wizData.assets.retirementAccounts.accountsSelf.pop();
            								}
            								
            								var pageId;
            								if (self.options.wizard.options.wizData.household.self.maritalStatus === "Married") {
            									pageId = "Page4_7";
            								} else if (self.options.wizard.options.wizData.assets.retirementAccounts.accountsSelf.length > 0 || self.options.wizard.options.wizData.assets.retirementAccounts.accountsSpouse.length > 0)
            									pageId = "Page4_11a";
            								else if (self.options.wizard.options.wizData.assets.collegeAccounts.userMayGoThruSection) {
            									pageId = "Page4_13";
            								} else
            									pageId = "Page4_12";
            								var exceptionRet = self.options.wizard.loadPage(pageId);
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
            			text: "Letting Plumvo know about all of your retirement accounts helps to make your plan more realistic."
            		},
            		previousSkipLinks: {
            			
                        previousVisible: true,
                        skipVisible: false,
            			previousClick: function () {
            				
                            try {
                                
                                var exceptionRet = self.options.wizard.loadPage("Page4_5");
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

