////////////////////////////////////////
// Page4_7 -- Do you have any spouse retirement accounts?
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page4_7(optionsOverride) {

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
            			
            			text: "Would you like to enter information about one of " + optionsOverride.wizard.options.wizData.spouse.name + "'s retirement accounts?"
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
            						selected: (optionsOverride.wizard.options.wizData.answer4_7 === "Yes"),
            						click: function() {
            							
            							try {
            								
            								self.options.wizard.options.wizData.answer4_7 = "Yes";
            								
            								self.options.configuration.noButton.instance.setSelected(false);
            								this.setSelected(true);
            								
            								if (self.options.wizard.options.wizData.assets.retirementAccounts.accountsSpouse.length === 0) {
            									
	            								self.options.wizard.options.wizData.assets.retirementAccounts.accountsSpouse.push({
	            									name: "",
	            									type: "",
	            									value: "$"
	            								});
            								}

            								self.options.wizard.options.wizData.index = 0;
            								var exceptionRet = self.options.wizard.loadPage("Page4_8");
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
            						selected: (optionsOverride.wizard.options.wizData.answer4_7 === "No"),
            						click: function() {
            							
            							try {
            								
            								self.options.wizard.options.wizData.answer4_7 = "No";

            								self.options.configuration.yesButton.instance.setSelected(false);
            								this.setSelected(true);
            								self.options.wizard.options.wizData.index = -1;
            								self.options.wizard.options.wizData.assets.retirementAccounts.accountsSpouse = [];
            								
            								var pageId;
            								if (self.options.wizard.options.wizData.assets.retirementAccounts.accountsSelf.length > 0 || self.options.wizard.options.wizData.assets.retirementAccounts.accountsSpouse.length > 0)
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
            			
            			visible: false
            		},
            		whyAnswer: {
            			
            			visible: false
            		},
            		previousSkipLinks: {
            			
                        previousVisible: true,
                        skipVisible: true,
	        			previousClick: function () {
	        				
	                        try {
	                            
	                            var exceptionRet = self.options.wizard.loadPage("Page4_2");
	                            if (exceptionRet !== null) {
	                  
	                                throw exceptionRet;
	                            }
	                        } catch (e) {
	                  
	                            alert(e.message);
	                        }
	        			},
	        			skipClick: function () {
	        				
	        				try {
	        					
								var pageId;
								if (self.options.wizard.options.wizData.assets.retirementAccounts.accountsSelf.length > 0 || self.options.wizard.options.wizData.assets.retirementAccounts.accountsSpouse.length > 0)
									pageId = "Page4_11a";
								else if (self.options.wizard.options.wizData.assets.collegeAccounts.userMayGoThruSection)
									pageId = "Page4_13";
								else
									pageId = "Page4_12";
	
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

