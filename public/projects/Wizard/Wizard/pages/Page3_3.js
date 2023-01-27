////////////////////////////////////////
// Page3_3 -- Do you have other children?
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page3_3(optionsOverride) {

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
            			
            			text: "Do you have other children?"
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
            						selected: (optionsOverride.wizard.options.wizData.beenHere3_3) && (optionsOverride.wizard.options.wizData.index < optionsOverride.wizard.options.wizData.children.length - 1),
            						click: function() {
            							
            							try {
            								
                							// User clicked Yes on 3.3 (Any more children?)
            								// Several scenarios here. Keep in mind that this is the Yes case.:
            								// 1. They are entering children; have entered one or more; and said Yes, we have more. 
            								//		Recognize by: index === numChildren - 1.
            								//		Do this: Start a new child by pushing onto array; update index to children.length - 1; go to 3.1a.
            								// 2. They are reviewing children in the forward direction and they've just reviewed a middle child.
            								//		Recognize by: index < numChildren - 1.
            								//		Do this: Increment index by 1; goto 3.1a to review next child.
            								// 3. They are reviewing children in the forward direction and they've just reviewed their last child.
            								//		Recognize by: index === numChildren - 1. (Same as scenario 1.)
            								//		Do same as 1.
            								// 4. They've been clicking Previous, reviewing children in reverse order; index is set earlier than last child.
            								//		Recognize by index < numChildren - 1.
            								//		Do this: Start reviewing in forward direction with subsequent children. So, same as scenario 2.
            								
            								var numChildren = self.options.wizard.options.wizData.children.length;
            								if (self.options.wizard.options.wizData.index === numChildren - 1) {
            								
	            								self.options.wizard.options.wizData.children.push({
	            									gender: "",
	            									name: "",
	            									dob: ""
	            								});
	            								self.options.wizard.options.wizData.index = self.options.wizard.options.wizData.children.length - 1;
            								
            								} else {
            								
            									self.options.wizard.options.wizData.index++;
            								}
            								
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
            						selected: (optionsOverride.wizard.options.wizData.beenHere3_3) && (optionsOverride.wizard.options.wizData.index === optionsOverride.wizard.options.wizData.children.length - 1),
            						click: function() {
            							
            							try {
            								
                							self.options.wizard.options.wizData.beenHere3_3 = true;

                							// User clicked No on 3.3 (Any more children?)
            								// Several scenarios here. Keep in mind that this is the No case.:
            								// 1. They are entering children; have entered one or more; and said No, we have no more.
            								//		Recognize by: index === numChildren - 1.
            								//		Do this: Go to 1.2--"Done with Household".
            								// 2. They are reviewing children in the forward direction; they've just reviewed a middle child; they've clicked No.
            								//		Recognize by index < numChildren -1.
            								//		Do this: Delete subsequent children; go to 1.2.
            								// 3. They are reviewing children in the forward direction and they've just reviewed their last child; they clicked No.
            								//		Recognize and do this are same as scenario 1.
            								// 4. They've been clicking Previous, reviewing children in reverse order; index is set earlier than last child. They clicked No.
            								//		All same as 2.
            								
            								var numChildren = self.options.wizard.options.wizData.children.length;
            								
            								if (self.options.wizard.options.wizData.index < numChildren - 1) {
            									
            									// There are some to pop.
            									for (var i = numChildren - 1; i > self.options.wizard.options.wizData.index; i--)
            										self.options.wizard.options.wizData.children.pop();
            								}
            								
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
                                
    							// Are there any other possibilities here other than keeping index what is was and going to 3.2? No.
                            	
                                var exceptionRet = self.options.wizard.loadPage("Page3_2");
                                if (exceptionRet !== null) {
                      
                                    throw exceptionRet;
                                }
                            } catch (e) {
                      
                                alert(e.message);
                            }
            			},
            			skipClick: function () {
            				
            				try {
            					
            					var exceptionRet = self.options.wizard.loadPage("Page1_2");
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

