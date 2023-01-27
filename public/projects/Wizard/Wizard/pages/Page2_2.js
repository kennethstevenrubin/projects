////////////////////////////////////////
// Page2_2 -- Are you male or female?
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page2_2(optionsOverride) {

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
            			
            			text: "Are you male or female?"
            		},
            		additionalInfo: {
            			
            			visible: false
            		},
            		userAction: {
            			
            			configuration: {
            				
            				maleButton: {
            					
            					type: "RegionButtonRoundedCentered",
            					options: {
            						label: {
            							text: "Male",
            							font: "14px Arial"
            						},
            						left: 20,
            						width: 75,
            						height: 30,
            						selected: (optionsOverride.wizard.options.wizData.household.self.gender === "Male"),
            						click: function() {
            							
            							try {
            								
            								self.options.configuration.femaleButton.instance.setSelected(false);
            								this.setSelected(true);
            								self.options.wizard.options.wizData.household.self.gender = "Male";
            								var exceptionRet = self.options.wizard.loadPage("Page2_4");
            								if (exceptionRet !== null) {
            									
            									throw exceptionRet;
            								}
            							} catch (e){
            								
            								alert(e.message);
            							}
            						}
            					}
            				},
            				
            				femaleButton: {
            					
            					type: "RegionButtonRoundedCentered",
            					options: {
            						label: {
            							text: "Female",
            							font: "14px Arial"
            						},
            						left: 88,
            						width: 100,
            						height: 30,
            						selected: (optionsOverride.wizard.options.wizData.household.self.gender === "Female"),
            						click: function() {
            							
            							try {
            								
            								self.options.configuration.maleButton.instance.setSelected(false);
            								this.setSelected(true);
            								self.options.wizard.options.wizData.household.self.gender = "Female";
            								var exceptionRet = self.options.wizard.loadPage("Page2_4");
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
                                
                                var exceptionRet = self.options.wizard.loadPage("Page2_1");
                                if (exceptionRet !== null) {
                      
                                    throw exceptionRet;
                                }
                            } catch (e) {
                      
                                alert(e.message);
                            }
            			},
            			skipClick: function () {
            				
            				try {
            					
            					var exceptionRet = self.options.wizard.loadPage("Page2_4");
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

