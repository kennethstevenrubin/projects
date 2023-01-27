////////////////////////////////////////
// Page7_5 -- Enter spouse employer retirement contribution
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page7_5(optionsOverride) {

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
            			
            			text: ">  Everyday Living       >  Saving"
            		},
            		question: {
            			
            			text: "Does " + optionsOverride.wizard.options.wizData.spouse.name + "'s employer help out?"
            		},
            		additionalInfo: {
            			
            			visible: true,
            			text: "Enter the amount that " + optionsOverride.wizard.options.wizData.spouse.name + "'s employer contributes each month as an employee retirement benefit."
            		},
            		userAction: {
            			
            			configuration: {
            				
            				valInput: {
            					
            					type: "RegionInput",
            					options: {
	            					left: 20,
	                                width: 200,
	                                height: 27,
	                                value: optionsOverride.wizard.options.wizData.everydayLife.savings.savingsRetirementSpouse.monthlyEmplContribution
            					}
            				},
            				
            				nextPinchedButton: {
            					
            					type: "RegionButtonPinched",
            					options: {
            						
            						click: function() {
            							
            							try {
            								var entry = self.options.configuration.valInput.instance.options.value;
            								var exceptionRet = self.options.wizard.validateMoney(entry);
            								
                                            if (exceptionRet !== null) {
                          
                                                var e = self.setErrorMessage(exceptionRet.message);
                                                if (e !== null)
                                                    throw e;
                                                return;
            								}

                                            self.options.wizard.options.wizData.everydayLife.savings.savingsRetirementSpouse.monthlyEmplContribution = self.options.wizard.standardizeMoney(entry);
            								var exceptionRet = self.options.wizard.loadPage("Page7_6");
            								if (exceptionRet !== null) {
            									
            									throw exceptionRet;
            								}
            							} catch (e) {
            								
            								alert(e.message);
            							}
            						},
            						label: {
            							text: "Next"
            						},
            						left: 240,
            						width: 100,
            						height: 30
            					}
            				}
            			}
            		},
            		whyQuestion: {
            			
            			visible: true
            		},
            		whyAnswer: {
            			
            			visible: false,
            			text: "Many employers offer to match a portion of employees' retirement savings with a contribution from the company. Participating in these kinds of plans is a can't-lose proposition. Matching contributions from your spouse's employer should appear on his or her paycheck."
            		},
            		previousSkipLinks: {
            			
                        previousVisible: true,
                        skipVisible: true,
            			previousClick: function () {
            				
                            try {
                                
                                var exceptionRet = self.options.wizard.loadPage("Page7_4");
                                if (exceptionRet !== null) {
                      
                                    throw exceptionRet;
                                }
                            } catch (e) {
                      
                                alert(e.message);
                            }
            			},
            			skipClick: function () {
            				
            				try {
            					
                                self.options.wizard.options.wizData.everydayLife.savings.savingsRetirementSpouse.monthlyEmplContribution = "$";
            					var exceptionRet = self.options.wizard.loadPage("Page7_6");
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

