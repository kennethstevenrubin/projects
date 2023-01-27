////////////////////////////////////////
// Page3_1 -- What is your child's name?
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page3_1(optionsOverride) {

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

            			text: ">  Household"
            		},
            		question: {
            			
            			text: "What is your child's name?"
            		},
            		additionalInfo: {
            			
            			visible: false
            		},
            		userAction: {
            			
            			configuration: {
            				
            				childNameInput: {
            					
            					type: "RegionInput",
            					options: {
	            					left: 20,
	                                width: 200,
	                                height: 27,
	                                value: optionsOverride.wizard.options.wizData.children[optionsOverride.wizard.options.wizData.index].name
            					}
            				},
            				nextPinchedButton: {
            					
            					type: "RegionButtonPinched",
            					options: {
            						
            						click: function() {
            							
            							try {
            								var entry = self.options.configuration.childNameInput.instance.options.value;
            								var exceptionRet = self.options.wizard.validateString(entry);
            								
            								// validate
                                            if (exceptionRet !== null) {
                          
                                            	this.setSelected(false);
                                                var e = self.setErrorMessage(exceptionRet.message);
                                                if (e !== null)
                                                    throw e;
                                                return;
            								}
            								
            								self.options.wizard.options.wizData.children[self.options.wizard.options.wizData.index].name = entry;
            								var exceptionRet = self.options.wizard.loadPage("Page3_2");
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
                                
                                var exceptionRet = self.options.wizard.loadPage("Page3_1a");
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

