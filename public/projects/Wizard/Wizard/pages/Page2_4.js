////////////////////////////////////////
// Page2_4 -- Marital status
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page2_4(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from PageBaseWith3Buttons.
            self.inherits(PageRowBase, {
            	
            	itemList: [{

                    text: "Married",
                    selected: optionsOverride.wizard.options.wizData.household.self.maritalStatus === "Married"
                }, {

                    text: "Single",
                    selected: optionsOverride.wizard.options.wizData.household.self.maritalStatus === "Single"
                }, {

                    text: "Divorced",
                    selected: optionsOverride.wizard.options.wizData.household.self.maritalStatus === "Divorced"
                }, {

                    text: "Widowed",
                    selected: optionsOverride.wizard.options.wizData.household.self.maritalStatus === "Widowed"
                }, {

                    text: "Separated",
                    selected: optionsOverride.wizard.options.wizData.household.self.maritalStatus === "Separated"
                }],
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
            			
            			text: "What's your marital status?"
            		},
            		additionalInfo: {
            			
            			visible: false
            		},
            		userAction: {
            			
            			configuration: {
            				
            				comboSelection: {
            					
                                type: "RegionRLLabel",
                                options: {
                                	
                                	positionMethod: function (dNewWidth) {
                          
                                        try {

                                            // Set the font so the utility function knows how to calculate the correct width.
                                            this.options.context.font = this.options.label.font;

                                            // Get the max width of any item in the list.
                                            var dMaxWidth = optionsOverride.wizard.calculateMaxWidthOfList(this.options.page.options.itemList,
                                                    this.options.context);
                          
                                            var dBorder = 8;
                          
                                            // Set the width.
                                            this.options.width = dMaxWidth + 2 * dBorder;
                                            
                                        } catch (e) {
                          
                                            alert(e.message);
                                        }
                                	},
                                
                                	change: function () {
                                		
                                		try {
                                			
                                			// set label.text = value
                                			this.label.text = this.value;
                                			
                                			// enable nextBtn pinched button
                                			self.options.configuration.nextBtn.instance.options.enabled = true;
                                			
                                		} catch (e) {
                                  
                                            alert(e.message);
                                        }
                                	},
                                    label: {
                                  
                                        text: (optionsOverride.wizard.options.wizData.household.self.maritalStatus === "") ? "Select..." : optionsOverride.wizard.options.wizData.household.self.maritalStatus,
                                        selected: (optionsOverride.wizard.options.wizData.household.self.maritalStatus === "") ? false : true
                                        		
                                    },
                                    left: 20
                                }
            				},
            				
            				comboButton: {
            					
                                type: "RegionButtonCombo",
                                options: {
                                
                                	positionMethod: function (dNewWidth) {
                          
                                        try {

                                            // Get a reference to the combo selection region.
                                            var regionComboSelectionLabel = this.options.page.options.configuration.comboSelection.instance;

                                            // Set the font to the combo selection's font so that the length
                                            // is calculated the same way (as with the combo selection's).
                                            this.options.context.font = regionComboSelectionLabel.options.label.font;

                                            // Pass in list of items and context to calculate a maximum width.
                                            var dWidthOfList = optionsOverride.wizard.calculateMaxWidthOfList(this.options.page.options.itemList,
                                                    this.options.context);
                          
                                            var dBorder = 8;
                                            dWidthOfList += 2 * dBorder;
                          
                                            // Move the button to just to the right of the right side of the combo selection.
                                            this.options.left = regionComboSelectionLabel.options.left +
                                                dWidthOfList + 5;
//                                            this.options.height = 30;
                                            this.options.top = regionComboSelectionLabel.options.top +
                                                (regionComboSelectionLabel.options.height - this.options.height) / 2 - 1;
                                            
                                        } catch (e) {
                          
                                            alert(e.message);
                                        }
                                	},
                                
                                    click: function () {

                                        try {
                                        	
                                        	if (optionsOverride.wizard.options.rlPopup === undefined) {
                                        		
	                                            // Set rlPopup info for PageComboRLPopup to use for positioning.
	                                            optionsOverride.wizard.options.rlPopup = {
	                      
	                                                    buttonTop: this.options.top,
	                                                    buttonLeft: this.options.left,
	                                                    haveSelection: self.options.wizard.options.wizData.household.self.maritalStatus,
	                                                    rlList: []
	                                            };
	
	                                            // Move items from our itemList into rlPopup.
	                                            for (var i = 0; i < self.options.itemList.length; i++) {
	                      
	                                                optionsOverride.wizard.options.rlPopup.rlList.push(self.options.itemList[i]);
	                                            }
                                        	}
                                        	
                                            // Show the page.
                                            var exceptionRet = self.options.wizard.createPopupPage("PageComboRLPopup");
                                            if (exceptionRet !== null) {
                                  
                                                throw exceptionRet;
                                            }
                                        } catch (e) {
                                  
                                            alert(e.message);
                                        }
                                    },
                                    left: 250,
                                    opacity: 0
                                }
            				},
            				
            				nextBtn: {
            					
            					type: "RegionButtonPinched",
            					options: {
            						
                                	positionMethod: function (dNewWidth) {
                                        
                                        try {

                                            // Get a reference to the combo selection region.
                                            var regionComboSelectionLabel = this.options.page.options.configuration.comboSelection.instance;
                                            var regionComboButton = this.options.page.options.configuration.comboButton.instance;

                                            // Set the font to the combo selection's font so that the length
                                            // is calculated the same way (as with the combo selection's).
                                            this.options.context.font = regionComboSelectionLabel.options.label.font;

                                            // Pass in list of items and context to calculate a maximum width.
                                            var dWidthOfList = optionsOverride.wizard.calculateMaxWidthOfList(this.options.page.options.itemList,
                                                this.options.context);
                          
                                            var dBorder = 8;
                                            dWidthOfList += 2 * dBorder;
                          
                                            // Move the button to just to the right of the right side of the combo button.
                                            this.options.left = regionComboSelectionLabel.options.left +
                                                dWidthOfList + 5 +
                                                regionComboButton.options.width + 20;

                                            this.options.top = regionComboSelectionLabel.options.top +
                                                (regionComboSelectionLabel.options.height - this.options.height) / 2 - 1;
                                            
                                        } catch (e) {
                          
                                            alert(e.message);
                                        }
                                	},
                                
                                    click: function () {

                                        try {

                                        	// Destroy wizard.options.rlPopup.
                                        	// This will server as a flag for comboButton#click() above.
                                        	delete self.options.wizard.options.rlPopup;
                                        	
                                        	// Before setting Self's maritalStatus, check to see if we're moving from Married to something else.
                                        	// If so, blank out or delete all Spouse infor in wizData (if any exists).
                                        	var newMaritalStatus = self.options.configuration.comboSelection.instance.options.label.text
                                        	var oldMaritalStatus = self.options.wizard.options.wizData.household.self.maritalStatus;
                                        	
                                        	if (oldMaritalStatus === "Married" && newMaritalStatus !== "Married"){
                                        	
                                        		self.options.wizard.options.wizData.spouse = {
                                        				
                                        				gender: "",
                                        				name: "",
                                        				dob: ""
                                        		};
                                        		self.options.wizard.options.wizData.assets.retirementAccounts.accountsSpouse = [];
                                        		self.options.wizard.options.wizData.everydayLife.income.spouseIncome = {
                                        			
                                        				employment: "",
                                        				salary: "$",
                                        				period: ""
                                        		};
                                        		self.options.wizard.options.wizData.everydayLife.savings.savingsRetirementSpouse = {
                                        				
                                    					monthlyOwnContribution: "$",
                                    					monthlyEmplContribution: "$",
                                    					annualIRAContribution: "$"
                                        		};
                                        	}
                                        	
                                        	self.options.wizard.options.wizData.household.self.maritalStatus = newMaritalStatus;
            								var exceptionRet = self.options.wizard.loadPage(self.options.wizard.getNextPageId("household"));
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
                                    enabled: (optionsOverride.wizard.options.wizData.household.self.maritalStatus === "") ? false : true,
                                    left: 310,
                                    top: 280,
                                    width: 170,
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
            			text: "If you're married, we'll make sure to give you an opportunity to enter your spouse's income and assets separately."
            		},
            		previousSkipLinks: {
            			
                        previousVisible: true,
                        skipVisible: false,
            			previousClick: function () {
            				
                            try {
                                
                            	if (self.options.wizard.options.rlPopup !== undefined)
                                	delete self.options.wizard.options.rlPopup;

                                var exceptionRet = self.options.wizard.loadPage("Page2_2");
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

