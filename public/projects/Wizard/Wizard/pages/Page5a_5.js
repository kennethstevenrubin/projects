////////////////////////////////////////
// Page5a_5 -- Do you have other income?
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page5a_5(optionsOverride) {

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

            			text: ">  Everyday Living       >  Investments"
            		},
            		question: {
            			
            			text: "Do you have other income you'd like to include in this plan?"
            		},
            		additionalInfo: {
            			
            			visible: true,
            			text: "Only include income from things like rental property, part-time jobs or hobbies that isn't produced from your invested assets."
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
            						selected: (optionsOverride.wizard.options.wizData.answer5a_5 === "Yes"),
            						click: function() {
            							
            							try {
            								
            								self.options.wizard.options.wizData.answer5a_5 = "Yes";
            								
            								self.options.configuration.noButton.instance.setSelected(false);
            								this.setSelected(true);

            								if (self.options.wizard.options.wizData.everydayLife.income.otherIncomes.length === 0) {

            									self.options.wizard.options.wizData.everydayLife.income.otherIncomes.push({
	            									name: "",
	            									amount: "$",
	            									period: ""
	            								});
            								}

            								self.options.wizard.options.wizData.index = 0;
            								
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
            						selected: (optionsOverride.wizard.options.wizData.answer5a_5 === "No"),
            						click: function() {
            							
            							try {
            								
            								self.options.wizard.options.wizData.answer5a_5 = "No";

            								self.options.configuration.yesButton.instance.setSelected(false);
            								this.setSelected(true);
            								self.options.wizard.options.wizData.index = -1;
            								self.options.wizard.options.wizData.everydayLife.income.otherIncomes = [];
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
                                
                            	// Returns to check in this order:
                            	//	Page5a_4 if have spouse and spouse is employed
                            	// 	Page5a_3 if have spouse
                            	//	Page5a_2 otherwise
                            	var hasSpouse = (self.options.wizard.options.wizData.household.self.maritalStatus === "Married");
                            	var spouseEmpStatus = self.options.wizard.options.wizData.everydayLife.income.spouseIncome.employment;
                            	var pageId;
                                if (hasSpouse && (spouseEmpStatus === "Employed full-time" || spouseEmpStatus === "Employed part-time" || spouseEmpStatus === "Self-employed"))
                                	pageId = "Page5a_4";
                                else if (hasSpouse)
                                	pageId = "Page5a_3";
                                else
                                	pageId = "Page5a_2";
                                var exceptionRet = self.options.wizard.loadPage(pageId);
                                if (exceptionRet !== null) {
                      
                                    throw exceptionRet;
                                }
                            } catch (e) {
                      
                                alert(e.message);
                            }
            			},
            			skipClick: function () {
            				
            				try {
            					
            					var exceptionRet = self.options.wizard.loadPage("Page6_0");
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

