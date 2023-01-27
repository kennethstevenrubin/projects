////////////////////////////////////////
// Page3_0 -- Do you have a child?
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page3_0(optionsOverride) {

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
            			
            			text: "Do you have a child?"
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
            						selected: (optionsOverride.wizard.options.wizData.answer3_0 === "Yes"),
            						click: function() {
            							
            							try {
            								
            								self.options.wizard.options.wizData.answer3_0 = "Yes";
            								
            								self.options.configuration.noButton.instance.setSelected(false);
            								this.setSelected(true);
            								
            								// If self.options.wizard.options.wizData.children contains no children yet,
            								// this is our first time through and we have to push an empty child onto the array.
            								// Otherwise, we're in review mode.
            								if (self.options.wizard.options.wizData.children.length === 0) {
            									
	            								self.options.wizard.options.wizData.children.push({
	            									gender: "",
	            									name: "",
	            									dob: ""
	            								});
            								}
            									
            								self.options.wizard.options.wizData.index = 0;
            								
            								var exceptionRet = self.options.wizard.loadPage("Page3_1a");
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
            						selected: (optionsOverride.wizard.options.wizData.answer3_0 === "No"),
            						click: function() {
            							
            							try {
            								
            								self.options.wizard.options.wizData.answer3_0 = "No";

            								// Delete already entered children if any.
            								self.options.configuration.yesButton.instance.setSelected(false);
            								this.setSelected(true);
            								self.options.wizard.options.wizData.index = -1;
            								self.options.wizard.options.wizData.children = [];
            								var exceptionRet = self.options.wizard.loadPage("Page1_2");
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
            			text: "If you have children, we'll give you a chance to enter savings toward goals like college eduction associated with your children."
            		},
            		previousSkipLinks: {
            			
                        previousVisible: true,
                        skipVisible: false,
                			
               			previousClick: function () {
	                				
               				try {
	                                    
                               	var pageId;
	                                	
                               	if (self.options.wizard.options.wizData.household.self.maritalStatus === "Married")
                               		pageId = "Page2_7";
                               	else
                               		pageId = "Page2_4";
                               	var exceptionRet = self.options.wizard.loadPage(pageId);
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

