////////////////////////////////////////
// Page6_9 -- Do you have more discretionary expenses?
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page6_9(optionsOverride) {

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

            			text: ">  Everyday Living"
            		},
            		question: {
            			
            			text: "Would you like to enter more information about other spending?"
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
            						selected: (optionsOverride.wizard.options.wizData.beenHere6_9) && (optionsOverride.wizard.options.wizData.index < optionsOverride.wizard.options.wizData.everydayLife.expenses.discretionaryExpenses.length - 1),
            						click: function() {
            							
            							try {
            								
                							var numAccts = self.options.wizard.options.wizData.everydayLife.expenses.discretionaryExpenses.length;
                							// See Page3_3 for comments.
                							
                							if (self.options.wizard.options.wizData.index === numAccts - 1){
                								
	            								self.options.wizard.options.wizData.everydayLife.expenses.discretionaryExpenses.push({
	            									description: "",
	            									amount: "$"
	            								});
	            								self.options.wizard.options.wizData.index = self.options.wizard.options.wizData.everydayLife.expenses.discretionaryExpenses.length - 1;
	                							
                							} else {
                								
            									self.options.wizard.options.wizData.index++;
                							}
                							
            								var exceptionRet = self.options.wizard.loadPage("Page6_7");
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
            						selected: (optionsOverride.wizard.options.wizData.beenHere6_9) && (optionsOverride.wizard.options.wizData.index === optionsOverride.wizard.options.wizData.everydayLife.expenses.discretionaryExpenses.length - 1),
            						click: function() {
            							
            							try {
            								
                							self.options.wizard.options.wizData.beenHere6_9 = true;

            								var numAccts = self.options.wizard.options.wizData.everydayLife.expenses.discretionaryExpenses.length;
            								// Page3_3 for comments.
            								
            								if (self.options.wizard.options.wizData.index < numAccts - 1) {
            									
            									// There are some to pop.
            									for (var i = numDiscretionaryExpenses - 1; i > self.options.wizard.options.wizData.index; i--)
            										self.options.wizard.options.wizData.everydayLife.expenses.discretionaryExpenses.pop();
            								}
            								
            								var pageId;
            								
            								var selfEmployed = false;
            								var spouseEmployed = false;
            								var selfEmployment = self.options.wizard.options.wizData.everydayLife.income.selfIncome.employment;
            								var spouseEmployment = self.options.wizard.options.wizData.everydayLife.income.spouseIncome.employment;

                                        	if (selfEmployment === "Employed full-time" || selfEmployment === "Employed part-time" || selfEmployment === "Self-employed"){
                                        		
                                        		selfEmployed = true;
                                        	}
                                        	
                                            if (self.options.wizard.options.wizData.household.self.maritalStatus == "Married"){

                                            	if (spouseEmployment === "Employed full-time" || spouseEmployment === "Employed part-time" || spouseEmployment === "Self-employed"){
                                            		
                                            		spouseEmployed = true;
                                            	}
                                            }

                                            if (selfEmployed)
            									pageId = "Page7_1";
            								else if (spouseEmployed)
            									pageId = "Page7_4";
            								else
            									pageId = "Page7_7";
            								
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
                        skipVisible: false,
            			previousClick: function () {
            				
                            try {
                                
                                var exceptionRet = self.options.wizard.loadPage("Page6_8");
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

