////////////////////////////////////////
// Page5a_1 -- Self employment status
//
// Return constructor function.

"use strict";

define(["App/prototypes",
        "Wizard/pages/PageRowBase"],
        function (prototypes,
        		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page5a_1(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from PageBaseWith3Buttons.
            self.inherits(PageRowBase, {
            	
            	itemList: [{

                    text: "Employed full-time",
                    selected: optionsOverride.wizard.options.wizData.everydayLife.income.selfIncome.employment === "Employed full-time"
                }, {

                    text: "Employed part-time",
                    selected: optionsOverride.wizard.options.wizData.everydayLife.income.selfIncome.employment === "Employed part-time"
                }, {

                    text: "Self-employed",
                    selected: optionsOverride.wizard.options.wizData.everydayLife.income.selfIncome.employment === "Self-employed"
                }, {

                    text: "Retired",
                    selected: optionsOverride.wizard.options.wizData.everydayLife.income.selfIncome.employment === "Retired"
                }, {

                    text: "Unemployed",
                    selected: optionsOverride.wizard.options.wizData.everydayLife.income.selfIncome.employment === "Unemployed"
                }, {

                    text: "Student",
                    selected: optionsOverride.wizard.options.wizData.everydayLife.income.selfIncome.employment === "Student"
                }, {

                    text: "Other",
                    selected: optionsOverride.wizard.options.wizData.everydayLife.income.selfIncome.employment === "Other"
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

            			text: ">  Everyday Living"
            		},
            		question: {
            			
            			text: "What is your employment status?"
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
                                  
                                        text: (optionsOverride.wizard.options.wizData.everydayLife.income.selfIncome.employment === "") ? "Select..." : optionsOverride.wizard.options.wizData.everydayLife.income.selfIncome.employment,
                                        selected: (optionsOverride.wizard.options.wizData.everydayLife.income.selfIncome.employment === "") ? false : true
                                        		
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
	                                                    haveSelection: self.options.wizard.options.wizData.everydayLife.income.selfIncome.employment,
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
                                        	
                                        	var emp = self.options.configuration.comboSelection.instance.options.label.text;
                                        	self.options.wizard.options.wizData.everydayLife.income.selfIncome.employment = emp;
                                        	
                                        	var pageId;
                                        	if (emp === "Self-employed" || emp === "Employed full-time" || emp === "Employed part-time")
                                        		pageId = "Page5a_2";
                                        	else
                                        		pageId = self.options.wizard.getNextPageId("elEmpMarried");
                                        	
                                            var exceptionRet = self.options.wizard.loadPage(pageId);
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
                                    enabled: (optionsOverride.wizard.options.wizData.everydayLife.income.selfIncome.employment === "") ? false : true,
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
            			text: "If you're employed, we'll want to give you a chance to enter your salary information to help model your cash flow."
            		},
            		previousSkipLinks: {
            			
                        previousVisible: false,
                        skipVisible: false
                    }
            	}
            }.inject(optionsOverride));
        };
        
        // One-time injection.
        functionRet.inherits(PageRowBase);
        
        // Return constructor function.
        return functionRet;
	});

