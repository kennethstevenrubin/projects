////////////////////////////////////////
// PageHeadMinimal -- The page shown in pause mode.
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/Page"],
    function (prototypes,
        Page) {

        // Define constructor function.
        var functionRet = function PageHeadMinimal(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from Page.
            self.inherits(Page, {

                headerPage: true,
                configuration: {
                
                	// These are drawn with initial rendering
                    planName: {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: optionsOverride.wizard.options.planName,
                                lineHeight: 28,
                                font: "27px Helvetica",
                                fillStyle: "#ffffff"
                            },
                            positionMethod: function (dNewWidth) {
                                
                                try {
                          
                                	// Ellipsize plan name if necessary
                                    optionsOverride.context.font = "27px Helvetica";
                                	var strEllPlanName = optionsOverride.wizard.fitStringToWidth(
                                			optionsOverride.wizard.options.planName,
                                			optionsOverride.context.font,
                                			optionsOverride.wizard.options.comboButtonLeft - 10
                                	);
                                	this.options.label.text = strEllPlanName;
                                	
                                    // Calculate the width of the label.text.
                                    var sizeText = Math.max(optionsOverride.wizard.options.comboButtonLeft,
                                    		optionsOverride.context.measureText(strEllPlanName).width);
                                    this.options.width = sizeText;
                                    
                                } catch (e) {
                          
                                    alert(e.message);
                                }
                            },
                            left: 10,
                            top: 30,
                            width: 300,
                            height: 50,
                            opacity: 1
                        }
                    },
                    planDelHyperlink: {
                        
                        type: "RegionButtonLabel",
                        options: {
                        
                            label: {
                          
                                text: "Delete",
                                lineHeight: 24,
                                font: "11px Arial",
                                fillStyle: "#FFCCCC"
                            },
                            left: 10,
                            top: 75,
                            width: 31,
                            height: 15,
                            opacity: 1,
                            click: function () {
                            	
                            	try {

                            		self.options.wizard.onDeleteClick({});
                            		
                            	} catch (e) {
                            		
                            		alert(e.message);
                            	}
                            }
                        }
                    },
                    or1: {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: "|",
                                lineHeight: 24,
                                font: "11px Arial",
                                fillStyle: "#FFCCCC"
                            },
                            left: 45,
                            top: 75,
                            width: 10,
                            height: 15,
                            opacity: 1
                        }
                    },
                    planPropsHyperlink: {
                        
                        type: "RegionButtonLabel",
                        options: {
                        
                            label: {
                          
                                text: "Properties",
                                lineHeight: 0,
                                font: "11px Arial",
                                fillStyle: "#FFCCCC"
                            },
                            left: 52,
                            top: 75,
                            width: 50,
                            height: 15,
                            opacity: 1,
                            click: function () {
                            	
                            	try {

                            		self.options.wizard.onPropertiesClick({});
                            	} catch (e) {
                            		
                            		alert(e.message);
                            	}
                            }
                        }
                    },
                    comboButton: {
                    
                        type: "RegionButtonCombo",
                        options: {
                        
                            click: function () {

                                try {

                                    // Tell the wizard to show a popup page.
                                	// Going to construct the list of plans here and pass it in.
                                	// The first item in the list will be the currently selected plan.
                                	// The rest of the items in the list will be all of the plans.
                                	// Thus, the current selected plan will be both in the 0th position and again down below.
                                	// When the RegionComboList is drawn, background color and text color will depend on
                                	// whether we're drawing item[0], item[i].selected or all other items.
                                	optionsOverride.wizard.options.popupList = [];
                                	for (var i = 0; i < optionsOverride.wizard.options.plansList.length; i++) {
                          
                                		optionsOverride.wizard.options.popupList.push(optionsOverride.wizard.options.plansList[i]);
                                	}
                                	optionsOverride.wizard.options.popupList.sort(function(a,b){
                                		if (a.text > b.text)
                                			return 1;
                                		if (a.text < b.text)
                                			return -1;
                                		return 0;
                                	});
                                	
                                	// insert current planName into popupList[0]
                                	optionsOverride.wizard.options.popupList.unshift({
                                		
                                		planId: 0,
                                		selected: false,
                                		text: optionsOverride.wizard.options.planName
                                	});
                                    var exceptionRet = self.options.wizard.createPopupPage("PageComboPopup");
                                    if (exceptionRet !== null) {
                          
                                        throw exceptionRet;
                                    }
                                } catch (e) {
                          
                                    alert(e.message);
                                }
                            },
                            left: optionsOverride.wizard.options.comboButtonLeft,
                            top: optionsOverride.wizard.options.pausedTop,
                            opacity: 1
                        }
                    },
                    addPlanButton: {
                    
                        type: "RegionButtonAddPlan",
                        options: {
                        
                            left: optionsOverride.wizard.options.addPlanButtonLeft,
                            top: optionsOverride.wizard.options.pausedTop,
                            opacity: 1,
                            click: function () {
                            	
                            	try {

                            		self.options.wizard.onAddPlanClick();
                            		
                            	} catch (e) {
                            		
                            		alert(e.message);
                            	}
                            }
                        }
                    },
                }
            }.inject(optionsOverride));
        };

        // One-time injection.
        functionRet.inherits(Page);

        // Return constructor function.
        return functionRet;
    });
