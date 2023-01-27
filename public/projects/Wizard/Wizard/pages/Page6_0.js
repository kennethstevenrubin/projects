////////////////////////////////////////
// Page6_0 -- Use individual expense categories?
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page6_0(optionsOverride) {

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

            			text: ">  Everyday Living       >  Expense"
            		},
            		question: {
            			
            			text: "Now it's time to consider your living expenses."
            		},
            		additionalInfo: {
            			
            			visible: true,
            			text: "Would you like to see categories of expenses to consider, or just enter one monthly figure?"
            		},
            		userAction: {
            			
            			configuration: {
            				
            				categoriesButton: {
            					
            					type: "RegionButtonRoundedCentered",
            					options: {
            						label: {
            							text: "Show me the categories",
            							font: "14px Arial"
            						},
            						left: 20,
            						width: 75,
            						height: 30,
            						selected: (optionsOverride.wizard.options.wizData.everydayLife.expenses.haveAskedTheQuestion) && (!optionsOverride.wizard.options.wizData.everydayLife.expenses.aggregateBeingUsed),
            						click: function() {
            							
            							try {
            								
            								self.options.configuration.aggregateButton.instance.setSelected(false);
            								this.setSelected(true);
            								self.options.wizard.options.wizData.everydayLife.expenses.haveAskedTheQuestion = true;
            								self.options.wizard.options.wizData.everydayLife.expenses.aggregateBeingUsed = false;
            								var exceptionRet = self.options.wizard.loadPage("Page6_1");
            								if (exceptionRet !== null) {
            									
            									throw exceptionRet;
            								}
            							} catch (e){
            								
            								alert(e.message);
            							}
            						}
            					}
            				},
            				
            				aggregateButton: {
            					
            					type: "RegionButtonRoundedCentered",
            					options: {
            						label: {
            							text: "Just one number",
            							font: "14px Arial"
            						},
            						left: 207,
            						width: 100,
            						height: 30,
            						selected: (optionsOverride.wizard.options.wizData.everydayLife.expenses.haveAskedTheQuestion) && (optionsOverride.wizard.options.wizData.everydayLife.expenses.aggregateBeingUsed),
            						click: function() {
            							
            							try {
            								
            								self.options.configuration.categoriesButton.instance.setSelected(false);
            								this.setSelected(true);
            								self.options.wizard.options.wizData.everydayLife.expenses.haveAskedTheQuestion = true;
            								self.options.wizard.options.wizData.everydayLife.expenses.aggregateBeingUsed = true;
            								var exceptionRet = self.options.wizard.loadPage("Page6_0a");
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
                                
                                var exceptionRet = self.options.wizard.loadPage("Page5a_5");
                                if (exceptionRet !== null) {
                      
                                    throw exceptionRet;
                                }
                            } catch (e) {
                      
                                alert(e.message);
                            }
            			},
            			skipClick: function () {
            				
            				try {

            					// This will act as if they answered No to the question. Bean will think we're aggregating,
            					// but value will be 0.
								self.options.wizard.options.wizData.everydayLife.expenses.haveAskedTheQuestion = true;
								self.options.wizard.options.wizData.everydayLife.expenses.aggregateBeingUsed = true;
                                self.options.wizard.options.wizData.everydayLife.expenses.monthlyAggregate = "$";
								var exceptionRet = self.options.wizard.loadPage("Page6_6");
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

