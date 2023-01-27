////////////////////////////////////////
// Page4_14 -- What would you like to call this account?
//
// Return constructor function.

"use strict";

define(["App/prototypes",
        "Wizard/pages/PageRowBase"],
        function (prototypes,
        		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page4_14(optionsOverride) {

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
            			
            			text: "What would you like to call this account?"
            		},
            		additionalInfo: {
            			
            			visible: false
            		},
            		userAction: {
            			
            			configuration: {
            				
            				acctNameInput: {
            					
            					type: "RegionInput",
            					options: {
	            					left: 20,
	                                width: 200,
	                                height: 27,
	                                value: optionsOverride.wizard.options.wizData.assets.collegeAccounts.accounts[optionsOverride.wizard.options.wizData.index].name
            					}
            				},
            				nextPinchedButton: {
            					
            					type: "RegionButtonPinched",
            					options: {
            						
            						click: function() {
            							
            							try {
            								
            								var entry = self.options.configuration.acctNameInput.instance.options.value;
            								var exceptionRet = self.options.wizard.validateString(entry);
            								
            								// validate
                                            if (exceptionRet !== null) {
                          
                                            	this.setSelected(false);
                                                var e = self.setErrorMessage(exceptionRet.message);
                                                if (e !== null)
                                                    throw e;
                                                return;
            								}
                          
                                            self.options.wizard.options.wizData.assets.collegeAccounts.accounts[self.options.wizard.options.wizData.index].name = entry;
                                            
                                            // We are going to see if there are any children < 30 years old to be used in Page4_15
                                            // in a combo box of beneficiary choices.
                                            // If there are none, we'll skip right over to Page4_16.
                                            
                                            var pageId = "Page4_16";
                                            
                                            if (self.options.wizard.anyChildrenLT30() === true)
                                           		pageId = "Page4_15";

                                            exceptionRet = self.options.wizard.loadPage(pageId);
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
                                
                            	var exceptionRet = null;
                            	if (self.options.wizard.options.wizData.index === 0) {
                            		
                            		exceptionRet = self.options.wizard.loadPage("Page4_13");
                            		
                            	} else {
                            		
                            		self.options.wizard.options.wizData.index--;
                            		exceptionRet = self.options.wizard.loadPage("Page4_19");
                            	}
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

