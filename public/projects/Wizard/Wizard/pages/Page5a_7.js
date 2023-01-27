////////////////////////////////////////
// Page5a_7 -- How much do you receive from <x>?
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page5a_7(optionsOverride) {

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
            			
            			text: "How much do you receive from " + optionsOverride.wizard.options.wizData.everydayLife.income.otherIncomes[optionsOverride.wizard.options.wizData.index].name + "?"
            		},
            		additionalInfo: {
            			
            			visible: false
            		},
            		userAction: {
            			
            			configuration: {
            				
            				incomeInput: {
            					
            					type: "RegionInput",
            					options: {
	            					left: 20,
	                                width: 200,
	                                height: 27,
	                                value: optionsOverride.wizard.options.wizData.everydayLife.income.otherIncomes[optionsOverride.wizard.options.wizData.index].amount
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
            						selected: optionsOverride.wizard.options.wizData.everydayLife.income.otherIncomes[optionsOverride.wizard.options.wizData.index].period === "Monthly",
            						click: function() {
            							
            							try {
            								
            								var entry = self.options.configuration.incomeInput.instance.options.value;
            								var exceptionRet = self.options.wizard.validateMoney(entry);
            								
                                            if (exceptionRet !== null) {
                          
                                                var e = self.setErrorMessage(exceptionRet.message);
                                                if (e !== null)
                                                    throw e;
                                                return;
            								}
                          
            								self.options.wizard.options.wizData.everydayLife.income.otherIncomes[self.options.wizard.options.wizData.index].amount = self.options.wizard.standardizeMoney(entry);
            								self.options.wizard.options.wizData.everydayLife.income.otherIncomes[self.options.wizard.options.wizData.index].period = "Monthly";
            								var exceptionRet = self.options.wizard.loadPage("Page5a_8");
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
            						selected: optionsOverride.wizard.options.wizData.everydayLife.income.otherIncomes[optionsOverride.wizard.options.wizData.index].period === "Annually",
            						click: function() {
            							
            							try {
            								
            								var entry = self.options.configuration.incomeInput.instance.options.value;
            								var exceptionRet = self.options.wizard.validateMoney(entry);
            								
                                            if (exceptionRet !== null) {
                          
                                                var e = self.setErrorMessage(exceptionRet.message);
                                                if (e !== null)
                                                    throw e;
                                                return;
            								}
                          
            								self.options.wizard.options.wizData.everydayLife.income.otherIncomes[self.options.wizard.options.wizData.index].amount = self.options.wizard.standardizeMoney(entry);
            								self.options.wizard.options.wizData.everydayLife.income.otherIncomes[self.options.wizard.options.wizData.index].period = "Annually";
            								var exceptionRet = self.options.wizard.loadPage("Page5a_8");
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
            			text: "Even if it might seem small, additional income can make the difference between a plan that works and one that doesn't. Take a few minutes and enter any amounts you might receive from rents, hobbies, royalties, or part time work."
            		},
            		previousSkipLinks: {
            			
                        previousVisible: true,
                        skipVisible: true,
            			previousClick: function () {
            				
                            try {
                                
                                var exceptionRet = self.options.wizard.loadPage("Page5a_6");
                                if (exceptionRet !== null) {
                      
                                    throw exceptionRet;
                                }
                            } catch (e) {
                      
                                alert(e.message);
                            }
            			},
            			skipClick: function () {
            				
            				try {
            					
								self.options.wizard.options.wizData.everydayLife.income.otherIncomes[self.options.wizard.options.wizData.index].amount = "$";
            					var exceptionRet = self.options.wizard.loadPage("Page5a_8");
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

