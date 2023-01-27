////////////////////////////////////////
// PageComboPopup -- The combos popup drop-down.
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/Page"],
    function (prototypes,
        Page) {

        // Define constructor function.
        var functionRet = function PageComboPopup(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from Page.
            self.inherits(Page, {

                headerPage: true,
                configuration: {
                
                    comboDropDown: {
                    
                        type: "RegionComboList",
                        options: {
                        
                            select: function (item) {

                                try {
                                	
                                	if (item === null) {

                                		// User clicked on plan name at top of list.
                                        // Tell the wizard to close the popup page.
                                        var exceptionRet = self.options.wizard.destroyPopupPage();
                                        if (exceptionRet !== null) {
                              
                                            throw exceptionRet;
                                        }
                                	} else {
                                		
                                		// If they clicked on the current plan, do nothing.
                                		// Unfortunately, we have to loop to find SelectedPlan.
                                		for (var i = 0; i < self.options.wizard.options.plumPalette.plans.length; i++) {
                                			
                                			var planIth = self.options.wizard.options.plumPalette.plans[i];
                                			if (planIth.selectedPlan === true){
                                				
                                				if (planIth.planId === item.planId)
                                					return;
                                				
                                				break;
                                			}
                                		}

	                                    // Call the wizard event handler
	                                	self.options.wizard.onPlanComboSelectionChange.call(this, item);
	
	                                    // Tell the wizard to close the popup page.
	                                    var exceptionRet = self.options.wizard.destroyPopupPage();
	                                    if (exceptionRet !== null) {
	                          
	                                        throw exceptionRet;
	                                    }
                                	}
                                } catch (e) {
                          
                                    alert(e.message);
                                }
                            },
                            positionMethod: function (dNewWidth) {
                          
                                try {
                          
                                    // Calculate the max width of all plan names in list below the 0th.
                                    optionsOverride.context.font = this.options.list.font;
                                    var dMaxWidth = optionsOverride.wizard.options.comboButtonLeft + 20;
                                    for (var i = 1; i < this.options.list.items.length; i++) {
                          
                                        // Get the ith text.
                                        var strText = this.options.list.items[i].text;
                                        var sizeText = optionsOverride.context.measureText(strText);
                          
                                        if (sizeText.width > dMaxWidth) {
                          
                                            dMaxWidth = sizeText.width;
                                        }
                                    }

                                    this.options.width = dMaxWidth + 2 + 15;	// Account for left + right borders and marginLeftRight.
                                
                                } catch (e) {
                          
                                    alert(e.message);
                                }
                            },
                            left: 10,
                            top: optionsOverride.wizard.options.pausedTop,
                            opacity: 1,
                            list: {

                                marginLeftRight: 5,
                                items: optionsOverride.wizard.options.popupList
                            },
                            fill0thStyle: "#6d1b3e",
                            border: {
                            	
                            	enabled: true,
                            	strokeStyle: "#464646"
                            }
                        }
                    },
                    comboButton: {
                    
                        type: "RegionButtonCombo",
                        options: {
                        
                            click: function () {

                                try {
                          
                                    // Tell the wizard to close the popup page.
                                    var exceptionRet = self.options.wizard.destroyPopupPage();
                                    if (exceptionRet !== null) {
                          
                                        throw exceptionRet;
                                    }
                                } catch (e) {
                          
                                    alert(e.message);
                                }
                            },
                            open: true,
                            left: optionsOverride.wizard.options.comboButtonLeft,
                            opacity: 1,
                            top: optionsOverride.wizard.options.pausedTop
                        }
                    }
                }
            }.inject(optionsOverride));
        };

        // One-time injection.
        functionRet.inherits(Page);

        // Return constructor function.
        return functionRet;
    });
