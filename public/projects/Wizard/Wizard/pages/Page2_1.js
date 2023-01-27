////////////////////////////////////////
// Page2_1 -- In what year were you born?
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page2_1(optionsOverride) {

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
            			
            			text: ">  Household       >  Adults"
            		},
            		question: {
            			
            			text: "In what year were you born?"
            		},
            		additionalInfo: {
            			
            			visible: false
            		},
            		userAction: {
            			
            			configuration: {
            				
            				dobInput: {
            					
            					type: "RegionInput",
            					options: {
	            					left: 20,
	                                width: 200,
	                                height: 27,
	                                value: optionsOverride.wizard.options.wizData.household.self.dob
            					}
            				},
            				nextPinchedButton: {
            					
            					type: "RegionButtonPinched",
            					options: {
            						
            						click: function() {
            							
            							try {
            								
            								var entry = self.options.configuration.dobInput.instance.options.value;
            								// valid dates are between 1913 and this year - 17
            								var year2 = (new Date().getFullYear() - 17).toString();
            								var exceptionRet = self.options.wizard.validateDate(entry, "1913", year2);
            								
            								// validate
                                            if (exceptionRet !== null) {
                          
                                            	this.setSelected(false);
                                                var e = self.setErrorMessage(exceptionRet.message);
                                                if (e !== null)
                                                    throw e;
                                                return;
            								}
                          
                                            self.options.wizard.options.wizData.household.self.dob = entry;
            								var exceptionRet = self.options.wizard.loadPage("Page2_2");
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
            			text: "Some plan assumptions depend on an individual's age, like his or her expected date of retirement."
            		},
            		previousSkipLinks: {
            			
                        previousVisible: true,
                        skipVisible: false,
                        previousClick: function() {
                        	
                            try {
                                
                                var exceptionRet = self.options.wizard.loadPage("PageWelcome");
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

