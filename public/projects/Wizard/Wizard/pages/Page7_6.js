////////////////////////////////////////
// Page7_6 -- Enter spouse IRA contribution
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page7_6(optionsOverride) {

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
            			
            			text: "Does " + optionsOverride.wizard.options.wizData.spouse.name + " contribute to an IRA?"
            		},
            		additionalInfo: {
            			
            			visible: true,
            			text: "Enter the amount " + optionsOverride.wizard.options.wizData.spouse.name + " contributes each year to an IRA or other retirement account."
            		},
            		userAction: {
            			
            			configuration: {
            				
            				valInput: {
            					
            					type: "RegionInput",
            					options: {
	            					left: 20,
	                                width: 200,
	                                height: 27,
	                                value: optionsOverride.wizard.options.wizData.everydayLife.savings.savingsRetirementSpouse.annualIRAContribution
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

                                            self.options.wizard.options.wizData.everydayLife.savings.savingsRetirementSpouse.annualIRAContribution = self.options.wizard.standardizeMoney(entry);
                                            
                                            var pageId;
                                            
                                            if ((self.options.wizard.options.wizData.everydayLife.savings.savingsRetirementSelf.monthlyOwnContribution !== "$" || self.options.wizard.options.wizData.everydayLife.savings.savingsRetirementSelf.monthlyEmplContribution !== "$"
                                            	||
                                            	self.options.wizard.options.wizData.everydayLife.savings.savingsRetirementSpouse.monthlyOwnContribution !== "$" || self.options.wizard.options.wizData.everydayLife.savings.savingsRetirementSpouse.monthlyEmplContribution !== "$"
                                            	) && (self.options.wizard.options.wizData.retirementRiskModel === ""))
                                            	pageId = "Page7_6a";
                                            else
                                            	pageId = "Page7_7";
                                            		
                                            
            								var exceptionRet = self.options.wizard.loadPage(pageId);
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
            			text: "Up to certain limits, money contributed to an individual retirement account (IRA) grows tax-free. If you're saving for a retirement that's years away, the savings from deferring taxes on investment returns can be big. And if you're not covered by a retirement savings plan at work, your annual contribution to an IRA could be tax-deductible, too."
            		},
            		previousSkipLinks: {
            			
                        previousVisible: true,
                        skipVisible: true,
            			previousClick: function () {
            				
                            try {
                                
                                var exceptionRet = self.options.wizard.loadPage("Page7_5");
                                if (exceptionRet !== null) {
                      
                                    throw exceptionRet;
                                }
                            } catch (e) {
                      
                                alert(e.message);
                            }
            			},
            			skipClick: function () {
            				
            				try {
            					
                                self.options.wizard.options.wizData.everydayLife.savings.savingsRetirementSpouse.annualIRAContribution = "$";
                                
                                var pageId;
                                
                                if ((self.options.wizard.options.wizData.everydayLife.savings.savingsRetirementSelf.monthlyOwnContribution !== "$" || self.options.wizard.options.wizData.everydayLife.savings.savingsRetirementSelf.monthlyEmplContribution !== "$"
                                	||
                                	self.options.wizard.options.wizData.everydayLife.savings.savingsRetirementSpouse.monthlyOwnContribution !== "$" || self.options.wizard.options.wizData.everydayLife.savings.savingsRetirementSpouse.monthlyEmplContribution !== "$"
                                	) && (self.options.wizard.options.wizData.retirementRiskModel === ""))
                                	pageId = "Page7_6a";
                                else
                                	pageId = "Page7_7";
                                		
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

