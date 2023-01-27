////////////////////////////////////////
// Page5a_2 -- What is your salary?
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page5a_2(optionsOverride) {

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
            			
            			text: ">  Everyday Living       >  Income"
            		},
            		question: {
            			
            			text: "What is your current salary?"
            		},
            		additionalInfo: {
            			
            			visible: true,
                        text: "Provide your gross salary, before deductions for health insurance, retirement savings, and other benefits. We'll handle those later."
            		},
            		userAction: {
            			
            			configuration: {
            				
            				salaryInput: {
            					
            					type: "RegionInput",
            					options: {
	            					left: 20,
	                                width: 200,
	                                height: 27,
	                                value: optionsOverride.wizard.options.wizData.everydayLife.income.selfIncome.salary
            					}
            				},
            				
            				monthlyButton: {
            					
            					type: "RegionButtonRoundedCentered",
            					options: {
            						label: {
            							text: "Monthly",
            							font: "14px Arial"
            						},
            						left: 240,
            						width: 90,
            						height: 30,
            						selected: optionsOverride.wizard.options.wizData.everydayLife.income.selfIncome.period === "Monthly",
            						click: function() {
            							
            							try {
            								
            								var entry = self.options.configuration.salaryInput.instance.options.value;
            								var exceptionRet = self.options.wizard.validateMoney(entry);
            								
                                            if (exceptionRet !== null) {
                          
                                                var e = self.setErrorMessage(exceptionRet.message);
                                                if (e !== null)
                                                    throw e;
                                                return;
            								}
                          
            								self.options.wizard.options.wizData.everydayLife.income.selfIncome.salary = self.options.wizard.standardizeMoney(entry);
            								self.options.wizard.options.wizData.everydayLife.income.selfIncome.period = "Monthly";
            								var exceptionRet = self.options.wizard.loadPage(self.options.wizard.getNextPageId("elEmpMarried"));	// 5a_3 or 5a_5
            								if (exceptionRet !== null) {
            									
            									throw exceptionRet;
            								}
            							} catch (e){
            								
            								alert(e.message);
            							}
            						}
            					}
            				},
            				
            				annuallyButton: {
            					
            					type: "RegionButtonRoundedCentered",
            					options: {
            						label: {
            							text: "Annually",
            							font: "14px Arial"
            						},
            						left: 327,
            						width: 90,
            						height: 30,
            						selected: optionsOverride.wizard.options.wizData.everydayLife.income.selfIncome.period === "Annually",
            						click: function() {
            							
            							try {
            								
            								var entry = self.options.configuration.salaryInput.instance.options.value;
            								var exceptionRet = self.options.wizard.validateMoney(entry);
            								
                                            if (exceptionRet !== null) {
                          
                                                var e = self.setErrorMessage(exceptionRet.message);
                                                if (e !== null)
                                                    throw e;
                                                return;
            								}
                          
            								self.options.wizard.options.wizData.everydayLife.income.selfIncome.salary = self.options.wizard.standardizeMoney(entry);
            								self.options.wizard.options.wizData.everydayLife.income.selfIncome.period = "Annually";
            								var exceptionRet = self.options.wizard.loadPage(self.options.wizard.getNextPageId("elEmpMarried"));	// 5a_3 or 5a_5
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
            			text: "Your salary is an important driver of your plan, affecting your ability to pay expenses and especially to save."
            		},
            		previousSkipLinks: {
            			
                        previousVisible: true,
                        skipVisible: true,
            			previousClick: function () {
            				
                            try {
                                
                                var exceptionRet = self.options.wizard.loadPage("Page5a_1");
                                if (exceptionRet !== null) {
                      
                                    throw exceptionRet;
                                }
                            } catch (e) {
                      
                                alert(e.message);
                            }
            			},
            			skipClick: function () {
            				
            				try {
            					
								self.options.wizard.options.wizData.everydayLife.income.selfIncome.salary = "$";
								var exceptionRet = self.options.wizard.loadPage(self.options.wizard.getNextPageId("elEmpMarried"));	// 5a_3 or 5a_5
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

