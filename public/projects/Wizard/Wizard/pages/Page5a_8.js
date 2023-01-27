////////////////////////////////////////
// Page5a_8 -- Do you have more other income accounts?
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page5a_8(optionsOverride) {

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
            			
            			text: "Would you like to enter more information about other income?"
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
            						selected: (optionsOverride.wizard.options.wizData.beenHere5a_8) && (optionsOverride.wizard.options.wizData.index < optionsOverride.wizard.options.wizData.everydayLife.income.otherIncomes.length - 1),
            						click: function() {
            							
            							try {
            								
                							var numAccts = self.options.wizard.options.wizData.everydayLife.income.otherIncomes.length;
                							// See Page3_3 for comments.
                							
                							if (self.options.wizard.options.wizData.index === numAccts - 1){
                								
	            								self.options.wizard.options.wizData.everydayLife.income.otherIncomes.push({
	            									name: "",
	            									amount: "$",
	            									period: ""
	            								});
	            								self.options.wizard.options.wizData.index = self.options.wizard.options.wizData.everydayLife.income.otherIncomes.length - 1;
	                							
                							} else {
                								
            									self.options.wizard.options.wizData.index++;
                							}
                							
            								var exceptionRet = self.options.wizard.loadPage("Page5a_6");
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
            						selected: (optionsOverride.wizard.options.wizData.beenHere5a_8) && (optionsOverride.wizard.options.wizData.index === optionsOverride.wizard.options.wizData.everydayLife.income.otherIncomes.length - 1),
            						click: function() {
            							
            							try {
            								
                							self.options.wizard.options.wizData.beenHere5a_8 = true;

            								var numAccts = self.options.wizard.options.wizData.everydayLife.income.otherIncomes.length;
            								// Page3_3 for comments.
            								
            								if (self.options.wizard.options.wizData.index < numAccts - 1) {
            									
            									// There are some to pop.
            									for (var i = numOtherIncomes - 1; i > self.options.wizard.options.wizData.index; i--)
            										self.options.wizard.options.wizData.everydayLife.income.otherIncomes.pop();
            								}
            								
            								var exceptionRet = self.options.wizard.loadPage("Page6_0");
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
                                
                                var exceptionRet = self.options.wizard.loadPage("Page5a_7");
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

