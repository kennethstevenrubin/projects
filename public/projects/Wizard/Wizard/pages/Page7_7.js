////////////////////////////////////////
// Page7_7 -- Enter savings to non-retirement investments
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page7_7(optionsOverride) {

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
            			
            			text: "Are you doing other saving and investing?"
            		},
            		additionalInfo: {
            			
            			visible: true,
            			text: "Enter any other amounts you are saving and investing in taxable accounts each month."
            		},
            		userAction: {
            			
            			configuration: {
            				
            				valInput: {
            					
            					type: "RegionInput",
            					options: {
	            					left: 20,
	                                width: 200,
	                                height: 27,
	                                value: optionsOverride.wizard.options.wizData.everydayLife.savings.savingsNonretirement
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

                                            self.options.wizard.options.wizData.everydayLife.savings.savingsNonretirement = self.options.wizard.standardizeMoney(entry);
                                            
                                            var pageId;
                                            if (self.options.wizard.options.wizData.investmentRiskModel === "")
                                            	pageId = "Page7_8";
                                            else
                                            	pageId = "PageComplete";
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
            			text: "After all your monthly expenses are paid, your consumer debt is paid off, and you've contributed the maximum to tax-deferred savings plans like IRAs and 401(k)s, you'll want to invest any remaining dollars you don't need for a short-term cushion for future goals. You can include those savings in your plan here. You can also change them later if you need to."
            		},
            		previousSkipLinks: {
            			
                        previousVisible: true,
                        skipVisible: true,
            			previousClick: function () {
            				
                            try {
                                
                            	var pageId;
                            	
                            	if (self.options.wizard.options.wizData.retirementRiskModel !== "")
                            		pageId = "Page7_6a";
                            	else {
                            		
                                	var selfEmployment = self.options.wizard.options.wizData.everydayLife.income.selseIncome.employment;
                                	var selfIsEmployed = (selfEmployment === "Employed full-time" || selfEmployment === "Employed part-time" || selfEmployment === "Self-employed")
                                	var spouseEmployment = self.options.wizard.options.wizData.everydayLife.income.spouseIncome.employment;
                                	var spouseIsEmployed = (spouseEmployment === "Employed full-time" || spouseEmployment === "Employed part-time" || spouseEmployment === "Self-employed")
                                	
                                	if (self.options.wizard.options.wizData.household.self.maritalStatus == "Married" && spouseIsEmployed)
                                		pageId = "Page7_6";
                                	else if (selfIsEmployed)
                                		pageId = "Page7_3";
                                	else
                                		pageId = "Page6_6";
                            	}
                            	
                        		exceptionRet = self.options.wizard.loadPage(pageId);
                                if (exceptionRet !== null) {
                      
                                    throw exceptionRet;
                                }
                            } catch (e) {
                      
                                alert(e.message);
                            }
            			},
            			skipClick: function () {
            				
            				try {
            					
                                self.options.wizard.options.wizData.everydayLife.savings.savingsNonretirement = "$";

								var exceptionRet = self.options.wizard.loadPage("PageComplete");
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

