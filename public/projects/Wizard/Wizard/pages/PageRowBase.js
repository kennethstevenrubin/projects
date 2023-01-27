////////////////////////////////////////
// PageRowBase -- Base class for a managed collection of rows--organizing collections of pages.
//
// Return constructor function.

"use strict";

define(["App/prototypes",
    "Wizard/pages/PageBaseWith3Buttons"],
    function (prototypes,
        PageBaseWith3Buttons) {

        // Define constructor function.
        var functionRet = function PageRowBase(optionsOverride) {

            var self = this;            // Uber closure.

            // Inherit from RegionButton.
            self.inherits(PageBaseWith3Buttons, {

                breadcrumb: null,
                question: null,
                additionalInfo: null,
                errorMessage: null,
                userAction: [],
                whyQuestion: null,
                whyAnswer: null,
                previousQuestion: null,
                or2: null,
                skipQuestion: null
            }.inject(optionsOverride));

            ////////////////////////////
            // Public methods.

            // Invoked when the canvas is resized.  Overrides method defined in Page.js.
            self.calculateLayout = function (dNewWidth) {

                try {

                    // Calculate each row's position from the previous row's height.

                    //////////////////////
                    // 0 - Breadcrumb row starts at head height + 15px.
                    var dCursorY = self.options.wizard.headHeight() + 15;
                    self.options.breadcrumb.instance.options.top = dCursorY;
                    dCursorY += (self.options.breadcrumb.instance.getCalculatedHeight() + 25);

                    //////////////////////
                    // 1 - Question.
                    self.options.question.instance.options.top = dCursorY;
                    dCursorY += (self.options.question.instance.getCalculatedHeight());

                    //////////////////////
                    // 2 - Additional info.
                    var dErrorMessageTopGap = 30;
                    var dUserActionTopGap = 30;
                    if (self.options.additionalInfo.instance.options.visible) {
       
                        dCursorY += 30;
                        self.options.additionalInfo.instance.options.top = dCursorY;
                        dCursorY += (self.options.additionalInfo.instance.getCalculatedHeight());

                        dErrorMessageTopGap = 25;
                        dUserActionTopGap = 25;
                    }

                    //////////////////////
                    // 3 - Error message.
                    if (self.options.errorMessage.instance.options.visible) {
       
                        dCursorY += dErrorMessageTopGap;
                        self.options.errorMessage.instance.options.top = dCursorY;
                        dCursorY += (self.options.errorMessage.instance.getCalculatedHeight());

                        dUserActionTopGap = 25;
                    } else if (m_state.errorMessage.opening) {
       
                        // Do something if opening....
                        dCursorY += (m_state.errorMessage.percent * (self.options.errorMessage.instance.getCalculatedHeight() + dErrorMessageTopGap -
                            5));        // Subtract 5 to compensate for the change from 30 to 25....
                    }
       
                    //////////////////////
                    // 4 - User action.
                    dCursorY += dUserActionTopGap;
                    for (var i = 0; i < self.options.userAction.length; ++i) {
       
                        // Get the ith region.
                        var regionIth = self.options.userAction[i];
       
                        // Set the top, TODO: may have to center...
                        regionIth.instance.options.top = dCursorY;
                    }
                    dCursorY += 30;   // User action is always 30 high.

                    //////////////////////
                    // 5 - Why question.
                    if (self.options.whyQuestion.instance.options.visible) {
       
                        dCursorY += 25;
                        self.options.whyQuestion.instance.options.top = dCursorY;
                        dCursorY += (self.options.whyQuestion.instance.getCalculatedHeight() +
                            8.4);   // 8.4 is the extra space for the last line.
                                    // Since the answer needs to look like a continuation
                                    // this gap completes the illusion.
                    }

                    //////////////////////
                    // 6 - Why answer.
                    if (self.options.whyAnswer.instance.options.visible) {

                        self.options.whyAnswer.instance.options.top = dCursorY;
                        dCursorY += (self.options.whyAnswer.instance.getCalculatedHeight());
                    } else if (m_state.whyAnswer.opening) {
       
                        // Do something if opening....
                        dCursorY += (m_state.whyAnswer.percent * self.options.whyAnswer.instance.getCalculatedHeight());
                    }

                    //////////////////////
                    // 7 - Previous and skip links.
                    dCursorY += (38);
                    if (self.options.previousQuestion.instance.options.visible) {
       
                        self.options.previousQuestion.instance.options.top = dCursorY;
                    }
                    if (self.options.or2.instance.options.visible) {
       
                        self.options.or2.instance.options.top = dCursorY;
                    }
                    if (self.options.skipQuestion.instance.options.visible) {
       
                        if (!self.options.previousQuestion.instance.options.visible) {
           
                            self.options.skipQuestion.instance.options.left = self.options.previousQuestion.instance.options.left;
                        }
                        self.options.skipQuestion.instance.options.top = dCursorY;
                    }
       
                    // Call "protected" method.
                    return self.innerCalculateLayout(dNewWidth);
                } catch (e) {

                    return e;
                }
            };

            // Set error in page.
            self.setErrorMessage = function (strErrorMessage) {
       
                try {
       
                	// The follow setLabel call will force recalculation of lines[].
                    var exceptionRet = self.options.errorMessage.instance.setLabel(strErrorMessage);
                    if (exceptionRet !== null) {
                    	
                    	throw exceptionRet;
                    }
       
                    return m_functionShowElement("errorMessage");
                    
                } catch (e) {
       
                    return e;
                }
            };

            ////////////////////////////
            // Protected methods.

            // Define virtual stub for just-pre-creation function.
            self.innerCreate = function () {
       
                try {
       
                    // Create the configuration elements.

                    //////////////////////
                	// 0 - The Breadcrumb (mandatory).
                    self.options.configuration.breadcrumbLabel = {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: self.options.rows.breadcrumb.text,
                                lineHeight: 12,
                                font: "12px Arial",
                                fillStyle: "#666666"
                            },
                            left: 20,
                            top: 15,
                            width: 300,
                            height: 12
                        }
                    };
                    self.options.breadcrumb = self.options.configuration.breadcrumbLabel;

                    //////////////////////
                    // 1 - The Question (mandatory).
                    self.options.configuration.questionLabel = {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: self.options.rows.question.text,
                                lineHeight: 46,
                                font: "300 42px Open Sans",
                                fillStyle: "#7FB062"
                            },
                            left: 20,
                            top: 46,
                            width: 700,
                            height: 88
                        }
                    };
                    self.options.question = self.options.configuration.questionLabel;

                    //////////////////////
                    // 2 - Additional info (optional).
                    self.options.configuration.addtlInfoLabel = {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: self.options.rows.additionalInfo.text,
                                lineHeight: 24,
                                font: "300 18px Open Sans",
                                fillStyle: "#666666"
                            },
                            visible: self.options.rows.additionalInfo.visible,
                            left: 20,
                            top: 153,
                            width: 700,
                            height: 42
                        }
                    };
                    self.options.additionalInfo = self.options.configuration.addtlInfoLabel;

                    //////////////////////
                    // 3 - Error message (optional).
                    self.options.configuration.errMsgLabel = {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: "",
                                lineHeight: 11,
                                font: "11px Arial",
                                fillStyle: "#EF6F07"
                            },
                            visible: false,
                            left: 20,
                            top: 213,
                            width: 400,
                            height: 11
                        }
                    };
                    self.options.errorMessage = self.options.configuration.errMsgLabel;

                    //////////////////////
                    // 4 - User action.
       
                    // Loop over children of the rows.userAction.configuration node.
                    var arrayConfigurationKey = Object.keys(self.options.rows.userAction.configuration);

                    // Loop over all fields to add.
                    for (var i = 0; i < arrayConfigurationKey.length; i++) {

                        // Get the ith key.
                        var strKeyIth = arrayConfigurationKey[i];
       
                        // Grab the element.
                        var regionUserAction = self.options.rows.userAction.configuration[strKeyIth];
       
                        // Add to self.options.configuration.
                        self.options.configuration[strKeyIth] = regionUserAction;
       
                        // Add to self.options.userAction too.
                        self.options.userAction.push(regionUserAction);
                    }

                    //////////////////////
                    // 5 - Why is this important?
                    self.options.configuration.whyImptQuestLabel = {
                        
                        type: "RegionButtonLabel",
                        options: {
                        
                            label: {
       
                                text: "Why is this important?",
                                lineHeight: 12,
                                font: "12px Arial",
                                fillStyle: "#934962"
                            },
                            visible: self.options.rows.whyQuestion.visible,
                            left: 20,
                            top: 303,
                            width: 150,
                            height: 12,
                            click: function() {

                                try {
       
                                    var exceptionRet = null;
                                    if (!m_state["whyAnswer"].open) {
           
                                        exceptionRet = m_functionShowElement("whyAnswer");
                                    } else {
           
                                        exceptionRet = m_functionHideElement("whyAnswer");
                                    }
                                    if (exceptionRet !== null) {
       
                                        throw exceptionRet;
                                    }
                                } catch (e) {
       
                                    alert(e.message);
                                }
                            }
                        }
                    };
                    self.options.whyQuestion = self.options.configuration.whyImptQuestLabel;

                    //////////////////////
                    // 6 - Why answer.
                    self.options.configuration.whyImptAnswerLabel = {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: self.options.rows.whyAnswer.text,
                                lineHeight: 18,
                                font: "12px Arial",
                                fillStyle: "#666666"
                            },
                            visible: false,
                            left: 20,
                            top: 320,
                            width: 400,
                            height: 30
                        }
                    };
                    self.options.whyAnswer = self.options.configuration.whyImptAnswerLabel;

                    //////////////////////
                    // 7 - Navigation backward and forward.
                    self.options.configuration.previousQuestionHyperlink = {
                        
                        type: "RegionButtonLabel",
                        options: {
                        
                            label: {
                          
                                text: "Previous question",
                                lineHeight: 24,
                                font: "12px Arial",
                                fillStyle: "#934962"
                            },
                            visible: self.options.rows.previousSkipLinks.previousVisible,
                            left: 20,
                            top: 424,
                            width: 100,
                            height: 15,
                            click: self.options.rows.previousSkipLinks.previousClick
                        }
                    };
                    self.options.previousQuestion = self.options.configuration.previousQuestionHyperlink;

                    self.options.configuration.or2 = {
                        
                        type: "RegionLabel",
                        options: {
                        
                            label: {
                          
                                text: "|",
                                lineHeight: 24,
                                font: "12px Arial",
                                fillStyle: "#934962"
                            },
                            visible: self.options.rows.previousSkipLinks.previousVisible & self.options.rows.previousSkipLinks.skipVisible,
                            left: 123,
                            top: 424,
                            width: 10,
                            height: 15
                        }
                    };
                    self.options.or2 = self.options.configuration.or2;
       
                    self.options.configuration.skipQuestionHyperlink = {
                        
                        type: "RegionButtonLabel",
                        options: {
                        
                            label: {
                          
                                text: "Skip this question",
                                lineHeight: 12,
                                font: "12px Arial",
                                fillStyle: "#934962"
                            },
                            visible: self.options.rows.previousSkipLinks.skipVisible,
                            left: 130,
                            top: 424,
                            width: 100,
                            click: self.options.rows.previousSkipLinks.skipClick
                        }
                    };
                    self.options.skipQuestion = self.options.configuration.skipQuestionHyperlink;

                    return null;
                } catch (e) {
       
                    return e;
                }
            };
       
            ////////////////////////////
            // Private methods.

            // Set state and call wizard beginAnimateOpen.
            var m_functionHideElement = function (strElement) {
       
                try {

                    if (!m_state[strElement].open) {

                    	if (strElement !== "errorMessage")
                    		return null;
                    	
                    	// Error message has been changed.
                    	// Re-render the page.
                    	return self.options.wizard.forceRender();
                    }
                    m_state[strElement].open = false;

                    // Initialize state.
                    m_state[strElement].opening = true;
       
                    var dStartTime = new Date().getTime();
                    var dDuration = 500;
       
                    var functionUpdate = function () {
                    
                        try {
                        
                            // Get percent.
                            var dCurrentTime = new Date().getTime();
                            var dEllapsedTime = dCurrentTime - dStartTime;
                            m_state[strElement].percent = 2 - dEllapsedTime / dDuration;

                            // Check for inside bounds.
                            var exceptionRet = null;
                            if (m_state[strElement].percent < 1 &&
                                m_state[strElement].percent > 0) {

                                self.options[strElement].instance.options.visible = false;

                                // Display.
                                exceptionRet = self.options.wizard.forceRender();
                                if (exceptionRet !== null) {
                                    
                                    return exceptionRet;
                                }

                                // Continue processing open.
                                setTimeout(functionUpdate,
                                    10);
                            } else if (m_state[strElement].percent > 1) {
       
                                // Update state to complete.
                                self.options[strElement].instance.options.opacity = m_state[strElement].percent - 1;

                                // Display.
                                exceptionRet = self.options.wizard.forceRender();
                                if (exceptionRet !== null) {
                                    
                                    return exceptionRet;
                                }

                                // Continue processing open.
                                setTimeout(functionUpdate,
                                    1);
                            } else {
       
                                // Update state to complete.
                                self.options[strElement].instance.options.opacity = 0;
                                self.options[strElement].instance.options.visible = false;

                                // Display.
                                exceptionRet = self.options.wizard.forceRender(true);
                                if (exceptionRet !== null) {
                                    
                                    return exceptionRet;
                                }
                            }
                        } catch (e) {
                        
                            alert(e.message);
                        }
                    };

                    // Start the process.
                    setTimeout(functionUpdate,
                        1);

                    return null;
                } catch (e) {
       
                    return e;
                }
            };

            // Set state and call wizard beginAnimateOpen.
            var m_functionShowElement = function (strElement) {
       
                try {

                    if (m_state[strElement].open) {

                    	if (strElement !== "errorMessage")
                    		return null;
                    	
                    	// Error message has been changed.
                    	// Re-render the page.
                    	return self.options.wizard.forceRender();
                    }
                    m_state[strElement].open = true;

                    // Initialize state.
                    m_state[strElement].opening = true;
       
                    var dStartTime = new Date().getTime();
                    var dDuration = 500;
       
                    var functionUpdate = function () {
                    
                        try {
                        
                            // Get percent.
                            var dCurrentTime = new Date().getTime();
                            var dEllapsedTime = dCurrentTime - dStartTime;
                            m_state[strElement].percent = dEllapsedTime / dDuration;

                            // Check for inside bounds.
                            var exceptionRet = null;
                            if (m_state[strElement].percent < 1) {

                                // Display.
                                exceptionRet = self.options.wizard.forceRender();
                                if (exceptionRet !== null) {
                                    
                                    return exceptionRet;
                                }

                                // Continue processing open.
                                setTimeout(functionUpdate,
                                    10);
                            } else if (m_state[strElement].percent < 2) {
       
                                // Update state to complete.
                                self.options[strElement].instance.options.visible = true;
                                self.options[strElement].instance.options.opacity = m_state[strElement].percent - 1;

                                // Display.
                                exceptionRet = self.options.wizard.forceRender();
                                if (exceptionRet !== null) {
                                    
                                    return exceptionRet;
                                }

                                // Continue processing open.
                                setTimeout(functionUpdate,
                                    1);
                            } else {
       
                                // Update state to complete.
                                self.options[strElement].instance.options.opacity = 1;

                                // Display.
                                exceptionRet = self.options.wizard.forceRender(true);
                                if (exceptionRet !== null) {
                                    
                                    return exceptionRet;
                                }
                            }
                        } catch (e) {
                        
                            alert(e.message);
                        }
                    };

                    // Start the process.
                    setTimeout(functionUpdate,
                        1);

                    return null;
                } catch (e) {
       
                    return e;
                }
            };

            ////////////////////////////
            // Private fields.
            var m_state = {
       
                whyAnswer: {
       
                    opening: false,
                    open: false,
                    percent: 0
                },
                errorMessage: {
       
                    opening: false,
                    open: false,
                    percent: 0
                }
            };
        };

        // One-time injection.
        functionRet.inherits(PageBaseWith3Buttons);

        // Return constructor function.
        return functionRet;
    });
