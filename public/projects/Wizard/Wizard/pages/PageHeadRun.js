////////////////////////////////////////
// PageHeadRun -- The running head page.
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/Page"],
    function (prototypes,
        Page) {

        // Define constructor function.
        var functionRet = function PageHeadRun(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from Page.
            self.inherits(Page, {

                headerPage: true,
                configuration: {
                
                    planName: {
                    
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: optionsOverride.wizard.options.planName,
                                lineHeight: 28,
                                font: "27px Helvetica",
                                fillStyle: "#ffffff"
                            },
                            left: 10,
                            top: 20,
                            width: 600,
                            height: 50,
                            opacity: 1
                        }
                    },
                    pauseButton: {
                    
                        type: "RegionButtonRoundedPause",
                        options: {
                        
                            click: function () {

                                try {
                          
                                    var exceptionRet = self.options.wizard.doHeaderAnimation("pause");
                                    if (exceptionRet !==  null) {
                          
                                        throw exceptionRet;
                                    }
                                } catch (e) {
                          
                                    alert(e.message);
                                }
                            },
                            positionMode: "right",
                            right: 30,
                            top: 14,
                            opacity: 1
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
