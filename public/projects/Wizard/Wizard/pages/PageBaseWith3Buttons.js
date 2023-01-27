////////////////////////////////////////
// PageWelcome -- The welcome page.
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/Page"],
    function (prototypes,
        Page) {

        // Define constructor function.
        var functionRet = function PageBaseWith3Buttons(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from Page.
            self.inherits(Page, {

                configuration: {
                
                    hhRoundedButton: {
                        
                        type: "RegionButtonRounded",
                        options: {
                        
                        	enabled: false,
                            click: function () {

                                if (this.options.enabled) {

                                    try {
                                        
                                    	// Jump back to beginning of section.
                                    	var pageId = self.options.wizard.getNextPageId("household");
                                        var exceptionRet = self.options.wizard.loadPage(pageId);
                                        if (exceptionRet !== null) {
                              
                                            throw exceptionRet;
                                        }
                                    } catch (e) {
                              
                                        alert(e.message);
                                    }
                                }
                            },
                            allowFadeInOut: false,
                            bigLabel: {
                            	text: "Household"
                            },
                            smallLabel: {
                            	text: "You and your family"
                            },
                            left: 10,
                            top: 446
                        }
                    },
                    asRoundedButton: {
                        
                        type: "RegionButtonRounded",
                        options: {
                        
                        	enabled: false,
                            click: function () {

                                if (this.options.enabled) {

                                    try {
                                        
                                    	// Jump back to beginning of section.
                                    	
                                    	// Revert to this when all of assets is done
                                    	var pageId = self.options.wizard.getNextPageId("assetsRetirement");
                                        var exceptionRet = self.options.wizard.loadPage(pageId);
                                        if (exceptionRet !== null) {
                              
                                            throw exceptionRet;
                                        }
                                    } catch (e) {
                              
                                        alert(e.message);
                                    }
                                }
                            },
                            allowFadeInOut: false,
                            bigLabel: {
                            	text: "Assets"
                            },
                            smallLabel: {
                            	text: "Investments and cash"
                            },
                            left: 272,
                            top: 446
                        }
                    },
                    elRoundedButton: {
                        
                        type: "RegionButtonRounded",
                        options: {
                        
                        	enabled: false,
                            click: function () {

                                if (this.options.enabled) {

                                    try {
                                        
                                    	// Jump back to beginning of section.
                                    	var pageId = "Page5a_1";
                                        var exceptionRet = self.options.wizard.loadPage(pageId);
                                        if (exceptionRet !== null) {
                              
                                            throw exceptionRet;
                                        }
                                    } catch (e) {
                              
                                        alert(e.message);
                                    }
                                }
                            },
                            allowFadeInOut: false,
                            bigLabel: {
                            	text: "Everyday Living"
                            },
                            smallLabel: {
                            	text: "Income, expense and saving"
                            },
                            left: 534,
                            top: 446
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
