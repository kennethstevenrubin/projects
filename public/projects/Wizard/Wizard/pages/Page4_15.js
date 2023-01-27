////////////////////////////////////////
// Page4_15 -- College account beneficiary
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageRowBase"],
    function (prototypes,
    		PageRowBase) {

        // Define constructor function.
        var functionRet = function Page4_15(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from PageBaseWith3Buttons.
            self.inherits(PageRowBase, {
            	
            	itemList: [],
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
            			
            			text: "Who is the beneficiary of " + optionsOverride.wizard.options.wizData.assets.collegeAccounts.accounts[optionsOverride.wizard.options.wizData.index].name + "?"
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
                                			
                                            // Set the font to the combo selection's font so that the length
                                            // is calculated the same way (as with the combo selection's).
                                            this.options.context.font = this.options.label.font;

                                            var dBorder = 8;
	                                		
	                                		// We're collecting a list of children just to get max width.
	                                		// We'll collect the list again, in the combo button click handler for use in popup page.
	                                		var clist = [];
	                                		
	                                        var thirtyYearsAgo = (new Date().getFullYear() - 30).toString();
	                                        for (var i = 0; i < optionsOverride.wizard.options.wizData.children.length; i++) {
	                                        	
	                                        	var childIth = optionsOverride.wizard.options.wizData.children[i];
	                                        	if (!(childIth.dob < thirtyYearsAgo)) {
	                                        		
	                                           		clist.push({text: childIth.name});
	                                        	}
	                                        }
                                            
                                            clist.push({text:"Someone else"});
	                                		
	                                		// Set the width.
	                                		this.options.width = optionsOverride.wizard.calculateMaxWidthOfList(clist, this.options.context) + 2 * dBorder;
	                                		
                                		} catch (e) {
                                			
                                			alert(e.message);
                                		}
                                	},
                                
                                	change: function () {
                                		
                                		try {
                                			
                                			// set label.text = value
                                			this.label.text = this.value;
                                			
                                			// enable next pinched button
                                			self.options.configuration.nextBtn.instance.options.enabled = true;
                                			
                                		} catch (e) {
                                  
                                            alert(e.message);
                                        }
                                	},
                                    label: {
                                  
                                        text: (optionsOverride.wizard.options.wizData.assets.collegeAccounts.accounts[optionsOverride.wizard.options.wizData.index].beneficiary === "") ? "Select..." : optionsOverride.wizard.options.wizData.assets.collegeAccounts.accounts[optionsOverride.wizard.options.wizData.index].beneficiary,
                                   		selected: (optionsOverride.wizard.options.wizData.assets.collegeAccounts.accounts[optionsOverride.wizard.options.wizData.index].beneficiary === "") ? false : true
                                        		
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
                          
                                            var dBorder = 8;

                                            // We're collecting a list of children just to get max width.
	                                		// We'll save the list to use if they click the combo button.
                                            this.options.page.options.itemList = [];
                                            
                                            var thirtyYearsAgo = (new Date().getFullYear() - 30).toString();
                                            for (var i = 0; i < optionsOverride.wizard.options.wizData.children.length; i++) {
                                            	
                                            	var childIth = optionsOverride.wizard.options.wizData.children[i];
                                            	if (!(childIth.dob < thirtyYearsAgo)) {
                                            		
                                               		this.options.page.options.itemList.push({text: childIth.name, selected: false});
                                            	}
                                            }

                                            this.options.page.options.itemList.push({text: "Someone else", selected: false});
	                                		
	                                		// Set the width.
	                                		var dWidthOfList = optionsOverride.wizard.calculateMaxWidthOfList(this.options.page.options.itemList, this.options.context) + 2 * dBorder;

                                            // Move the button to just to the right of the right side of the combo selection.
                                            this.options.left = regionComboSelectionLabel.options.left +
                                                dWidthOfList + 5;

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
	                                            self.options.wizard.options.rlPopup = {
	                      
	                                                    buttonTop: this.options.top,
	                                                    buttonLeft: this.options.left,
	                                                    haveSelection: self.options.wizard.options.wizData.assets.collegeAccounts.accounts[self.options.wizard.options.wizData.index].beneficiary,
	                                                    rlList: []
	                                            };
	
	                                            // Move items from our itemList into rlPopup.
	                                            for (var i = 0; i < self.options.itemList.length; i++) {
	                      
	                                            	self.options.wizard.options.rlPopup.rlList.push(self.options.itemList[i]);
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
                          
                                            var dBorder = 8;

                                            if (this.options.page.options.itemList.length === 0) {
                                            	
	                                            // We're collecting a list of children just to get max width.
		                                		// We'll save the list to use if they click the combo button.
                                                var thirtyYearsAgo = (new Date().getFullYear() - 30).toString();
                                                for (var i = 0; i < optionsOverride.wizard.options.wizData.children.length; i++) {
                                                	
                                                	var childIth = optionsOverride.wizard.options.wizData.children[i];
                                                	if (!(childIth.dob < thirtyYearsAgo)) {
                                                		
                                                		this.options.page.options.itemList.push({text: childIth.name, selected: false});
                                                	}
                                                }

	                                            this.options.page.options.itemList.push({text: "Someone else", selected: false});
                                            }
                                            
	                                		// Set the width.
	                                		var dWidthOfList = optionsOverride.wizard.calculateMaxWidthOfList(this.options.page.options.itemList, this.options.context) + 2 * dBorder;

                                            // Move the button to just to the right of the right side of the combo selection.
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
                                        	self.options.wizard.options.wizData.assets.collegeAccounts.accounts[self.options.wizard.options.wizData.index].beneficiary = self.options.configuration.comboSelection.instance.options.label.text;
                                            var exceptionRet = self.options.wizard.loadPage("Page4_16");
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
                                    enabled: (optionsOverride.wizard.options.wizData.assets.collegeAccounts.accounts[optionsOverride.wizard.options.wizData.index].beneficiary === "") ? false : true,
                                    left: 310,
                                    top: 280,
                                    width: 170,
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
                                
                            	if (self.options.wizard.options.rlPopup !== undefined)
                                	delete self.options.wizard.options.rlPopup;

                                var exceptionRet = self.options.wizard.loadPage("Page4_14");
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

