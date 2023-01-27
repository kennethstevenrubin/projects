////////////////////////////////////////
// PageComboRLPopup -- The combos popup drop-down for the user Response Line (thus the 'RL').
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/Page"],
    function (prototypes,
        Page) {

        // Define constructor function.
        var functionRet = function PageComboRLPopup(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from Page.
            self.inherits(Page, {

                headerPage: true,
                configuration: {
                
                    comboDropDown: {
                    
                        type: "RegionComboRLList",
                        options: {
                        
                            select: function (item) {

                                try {
                                	
                                	// set a selected item  -- if the user clicks on an item in the list
                                	if (item !== null) {
                                		
                                		self.options.wizard.options.page.instance.options.configuration.comboSelection.instance.options.label.text = item.text;
                                		self.options.wizard.options.page.instance.options.configuration.nextBtn.instance.options.enabled = true;
                                		self.options.wizard.options.rlPopup.haveSelection = item.text;
                                	}
                                	
                                	// A click in or out of the list always destroys the popup page.
                                    // Tell the wizard to make it so.
                                    var exceptionRet = self.options.wizard.destroyPopupPage();
                                    if (exceptionRet !== null) {
	                          
                                        throw exceptionRet;
                                    }
                                } catch (e) {
                          
                                    alert(e.message);
                                }
                            },
                            positionMethod: function (dNewWidth) {
                            	
                            	try {

                            		this.options.top = Math.min(optionsOverride.wizard.options.rlPopup.buttonTop/* - 2*/,
                                        446 + optionsOverride.wizard.headHeight() - 5 /* border... */ - this.options.list.items.length * this.options.list.lineHeight);
                            		this.options.width = optionsOverride.wizard.options.rlPopup.buttonLeft - 25;
                            	} catch (e) {
                            		
                            		alert(e.message);
                            	}
                            },
                            left: 20,
                            opacity: 1,
                            list: {

                                marginLeftRight: 5,
                                items: optionsOverride.wizard.options.rlPopup.rlList
                            },
                            haveSelection: optionsOverride.wizard.options.rlPopup.haveSelection,
                            border: {
                            	
                            	enabled: true,
                            	strokeStyle: "#D1D1D1",
                            	lineWidth: 2
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
                            showSquare: true,
                            open: true,
                            height: 30,
                            positionMethod: function (dNewWidth) {
                            	
                            	try {

                            		this.options.top = optionsOverride.wizard.options.rlPopup.buttonTop;
                            		this.options.left = optionsOverride.wizard.options.rlPopup.buttonLeft;
                            		
                            	} catch (e) {
                            		
                            		alert(e.message);
                            	}
                            },
                            opacity: 1,
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
