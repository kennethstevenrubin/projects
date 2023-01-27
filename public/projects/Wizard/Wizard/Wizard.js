//////////////////////////////////
// Plumvo Plan Wizard
//
// Return constructor function.

"use strict";

define(["App/prototypes",
        "Wizard/regions/RegionButtonRounded",
        "Wizard/pages/PageHeadRun",
        "Wizard/pages/PageHeadMinimal",
        "Wizard/pages/PageHeadPause",
        "Wizard/pages/PageHeadResumePaused",
        "Wizard/pages/PageHeadStop",
        "Wizard/pages/PageWelcome"],
    function (prototypes,
        RegionButtonRounded,
        PageHeadRun,
        PageHeadMinimal,
        PageHeadPause,
        PageHeadResumePaused,
        PageHeadStop,
        PageWelcome) {
        
        // Define the constructor function.
        var functionConstructor = function Wizard(optionsOverride) {
            
            var self = this;					// Uber-closure.

            ////////////////////////////
            // Public events.
            
            // Set up holders of event handlers for those events that are handled externally.
            self.onPropertiesClick = null;
            self.onDeleteClick = null;
            self.onAddPlanClick = null;
            self.onExitingWizard = null;
            self.onPlanComboSelectionChange = null;
            self.onQuestionCompleted = null;

            ////////////////////////////
            // Public methods.

            // Create the wizard.
            self.create = function () {

                try {

                    // Get the parent references.
                    m_jqParent = $(self.options.host.selector);
                    if (m_jqParent.length === 0) {

                        throw { message: "Failed to select parent element." };
                    }

                    // Create the render canvas.
                    m_canvasRender = document.createElement("canvas");
                    m_canvasRender.id = "Render";
                    m_canvasRender.tabIndex = "1";
                    m_contextRender = m_canvasRender.getContext("2d");
                    m_jqCanvas = $(m_canvasRender);
                    m_jqCanvas.css({

                            position: "absolute",
                            top: "0px",
                            left: "0px"
                        });
                    m_jqParent.append(m_canvasRender);

                    // Hook the resize to update the size of the dashboard when the browser is resized.
                    $(window).bind("resize",
                        m_functionWindowResize);

                    // Wire events to canvas.
                    m_jqCanvas.bind("click",
                        m_functionClick);
                    m_jqCanvas.bind("mousemove",
                        m_functionMouseMove);
                    m_jqCanvas.bind("mousedown",
                        m_functionMouseDown);
                    m_jqCanvas.bind("mouseup",
                        m_functionMouseUp);
                    m_jqCanvas.bind("mouseout",
                        m_functionMouseOut);
                    m_jqCanvas.bind("keydown",
                        m_functionKeyDown);
                    m_jqCanvas.bind("keypress",
                        m_functionKeyPress);
                    m_jqCanvas.bind("keyup",
                        m_functionKeyUp);

                    // Some constants -- Ken may move these elsewhere
                    self.options.comboButtonLeft = 180;
                    self.options.addPlanButtonLeft = 220;
                    self.options.pausedTop = 32;
       
                    // Prepare array for plan change combo list entries
                    self.options.plansList = [];
                    
                    // Scan the input data for the active plan name.
                    for (var i = 0; i < self.options.plumPalette.plans.length; i++) {

                        var planIth = self.options.plumPalette.plans[i];

                        var selected = planIth.selectedPlan;
                        if (selected) {

                            self.options.planName = planIth.planName;       // Name of the current plan.
                        }
                        
                    	self.options.plansList[i] = {
                    			
                    			text: planIth.planName, 
                    			selected: selected,
                    			planId: planIth.planId
                    	};
                    }

                    // Creating wizard determine page and state that we should open in.
                    var exceptionRet = null;
                    if (self.options.wizData.lastQuestionPage === "NewPlanFirst"){
                    	
                    	self.options.page.id = "PageWelcome";
       
                        self.options.postRequirePageConfigureMode = "run";
                        exceptionRet = self.setHeadPageFromMode(self.options.postRequirePageConfigureMode, {
                        
                                wizard: self,
                                context: m_contextRender
                            });
                    } else if (self.options.wizData.lastQuestionPage === "NewPlanDB"){
                    	
                       	self.options.page.id = "PageWelcome";
                    	self.options.head.height = 118;
                    	self.options.head.targetHeight = 118;

                        self.options.postRequirePageConfigureMode = "resumeRunningDB";
                        exceptionRet = self.setHeadPageFromMode(self.options.postRequirePageConfigureMode, {
                        
                                wizard: self,
                                context: m_contextRender
                            });
                    } else if (self.options.wizData.lastQuestionPage === "NewPlanWiz"){
                    	
                       	self.options.page.id = "PageWelcome";
                    	self.options.head.height = 118;
                    	self.options.head.targetHeight = 118;

                        self.options.postRequirePageConfigureMode = "resumeRunningWiz";
                        exceptionRet = self.setHeadPageFromMode(self.options.postRequirePageConfigureMode, {
                        
                                wizard: self,
                                context: m_contextRender
                            });
                    } else {
                    	
                    	// Switched from Dashboard or Wizard combo drop list to wizard plan beyond PageWelcome
                    	self.options.page.id = self.options.wizData.lastQuestionPage;
                    	self.options.head.height = 118;
                    	self.options.head.targetHeight = 118;
                    	
                        m_jqPause = $("<div></div>");
                        m_jqPause.css({
       
                            position: "absolute",
                            width: m_dWidth + "px",
                            height: (m_dHeight - self.options.head.height) + "px",
                            top: self.options.head.height + "px",
                            opacity: self.options.pauseOverlayOpacity,
                            background: "#ffffff",
                            "z-index": 10,
                            "border-bottom-left-radius": self.options.body.cornerRadius,
                            "border-bottom-right-radius": self.options.body.cornerRadius
                        });
                        
                        // Add to m_jqParent.
                        m_jqParent.append(m_jqPause);

                        self.options.postRequirePageConfigureMode = "resumePaused";
                        exceptionRet = self.setHeadPageFromMode(self.options.postRequirePageConfigureMode, {
                        
                                wizard: self,
                                context: m_contextRender
                            });
                    }

                    // Test exceptionRet set in a condition from the if/else/else/else above.
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // TODO: get and check return value....
                    exceptionRet = self.options.head.page.create();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Require page and load into manager and re-render wizard.
                    return self.loadPage(self.options.page.id);
                    
                } catch (e) {
                    
                    return e;
                }
            };
       
            // Set the head page based on the mode about to enter.
            self.setHeadPageFromMode = function (strMode,
                option) {
       
                try {

                    // The page head is really the same for pause and resumePaused, but the transitions that the user
                    // sees are different.
                    self.options.head.page = (strMode === 'run' ? new PageHeadRun(option)
                    	: strMode === 'resumeRunningWiz' ? new PageHeadPause(option)
                		: strMode === 'resumeRunningDB' ? new PageHeadMinimal(option)
                    	: strMode === 'pause' ? new PageHeadPause(option)
                    	: strMode === 'resumePaused' ? new PageHeadResumePaused(option)
                    	: new PageHeadStop(option));
                    return null;
                } catch (e) {
       
                    return e;
                }
            };
            
            self.configureMode = function (strMode) {

                try {

                    // Want next render to calculate layout.
                    m_bDirty = true;
                    
                    // Pass this into page.
                    var option = {
       
                        wizard: self,
                        context: m_contextRender
                    };
       
                    // If "pause" create translucent grey overlay div.
                    if (strMode === "pause") {
       
                    	if (m_jqPause === null) {
                    		
	                        m_jqPause = $("<div></div>");
	                        m_jqPause.css({
	       
	                            position: "absolute",
	                            width: m_dWidth + "px",
	                            height: (m_dHeight - self.options.head.height) + "px",
	                            top: self.options.head.height + "px",
	                            opacity: self.options.pauseOverlayOpacity,
	                            background: "#ffffff",
	                            "z-index": 10,
	                            "border-bottom-left-radius": self.options.body.cornerRadius,
	                            "border-bottom-right-radius": self.options.body.cornerRadius
	                        });
	
	                        // Add to m_jqParent.
	                        m_jqParent.append(m_jqPause);
                    	}
                    	
                    } else {

                        // Remove overlay--if it exists--and we're not in the just jumped into middle of Wizard case.
                        if (m_jqPause && strMode !== 'resumePaused') {
       
                            // Remove from m_jqParent.
                            m_jqPause.remove();
                            m_jqPause = null;
                        }
                    }

                    // Allocate page.
                    var exceptionRet = self.setHeadPageFromMode(strMode,
                        option);
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }

                    if (strMode === "resumeRunningDB") {
                    	
                    	var exceptionRet = self.options.head.page.create(function () {
                        
                                self.doHeaderAnimation("resumeRunningDB");
                            });
                    	if (exceptionRet !== null){
                    		
                    		throw exceptionRet;
                    	}
                    } else if (strMode === "resumeRunningWiz") {
                    	
                        var exceptionRet = self.options.head.page.create(function () {
                        
                                self.doHeaderAnimation("run");
                            });
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                    } else if (strMode === "pause") {
       
                        var exceptionRet = self.options.head.page.create(function () {
                        
                                self.doHeaderAnimation("postPause");
                            });
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                    } else if (strMode === "resumePaused") {
                    	
                        var exceptionRet = self.options.head.page.create(function () {
                        
                                self.doHeaderAnimation("resumePaused");
                            });
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                    } else if (strMode === "run") {
                    	
                        var exceptionRet = self.options.head.page.create();
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                    } else if (strMode === "stop") {
                    	
                        var exceptionRet = self.options.head.page.create();
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                    }
                    
                    return null;
                    
                } catch (e) {

                    return e;
                }
            };
       
            // Begin changing mode.
            self.doHeaderAnimation = function (strMode) {

                try {

                    // Initialize state.
                    var dStartTime = new Date().getTime();
                    var dDuration = 300;

                    var arrayAnimate = [];
                    
                    if (strMode === "resumeRunningDB") {
                    	
                        arrayAnimate.push({
                            
                            target: self.options.head.page.options.configuration.or1.instance.options,
                            property: "opacity",
                            startValue: 1,
                            targetValue: 0
                        });
                        arrayAnimate.push({
       
                            target: self.options.head.page.options.configuration.planDelHyperlink.instance.options,
                            property: "opacity",
                            startValue: 1,
                            targetValue: 0
                        });
                        arrayAnimate.push({
       
                            target: self.options.head.page.options.configuration.planPropsHyperlink.instance.options,
                            property: "opacity",
                            startValue: 1,
                            targetValue: 0
                        });
                        arrayAnimate.push({
       
                            target: self.options.head.page.options.configuration.comboButton.instance.options,
                            property: "opacity",
                            startValue: 1,
                            targetValue: 0
                        });
                        arrayAnimate.push({
       
                            target: self.options.head.page.options.configuration.addPlanButton.instance.options,
                            property: "opacity",
                            startValue: 1,
                            targetValue: 0
                        });
                    } else if (strMode === "postResumeRunningDB") {
                    	
                        arrayAnimate.push({
                            
                            target: self.options.head,
                            property: "height",
                            startValue: self.options.head.targetHeight,
                            targetValue: self.options.head.startHeight
                        });
                        arrayAnimate.push({
                            
                            target: self.options.head.page.options.configuration.planName.instance.options,
                            property: "top",
                            startValue: 30,
                            targetValue: 20
                        });
                    } else if (strMode === "resumePaused") {

                    	arrayAnimate.push({
                    		
                    		target: self.options.head.page.options.configuration.stopButton.instance.options,
                    		property: "opacity",
                    		startValue: 0,
                    		targetValue: 1
                    	});
                    	arrayAnimate.push({
                    		
                    		target: self.options.head.page.options.configuration.playButton.instance.options,
                    		property: "opacity",
                    		startValue: 0,
                    		targetValue: 1
                    	});
                    } else if (strMode === "postResumePaused") {	
                    	
                        arrayAnimate.push({
                            
                            target: self.options.head.page.options.configuration.youCanSwitch.instance.options,
                            property: "opacity",
                            startValue: 0,
                            targetValue: 1
                        });
                        arrayAnimate.push({
       
                            target: self.options.head.page.options.configuration.clickEnd.instance.options,
                            property: "opacity",
                            startValue: 0,
                            targetValue: 1
                        });
                    } else if (strMode === "pause") {
       
                        arrayAnimate.push({
       
                            target: self.options.head,
                            property: "height",
                            startValue: self.options.head.startHeight,
                            targetValue: self.options.head.targetHeight
                        });
                        arrayAnimate.push({
       
                            target: self.options.head.page.options.configuration.pauseButton.instance.options,
                            property: "top",
                            startValue: 14,
                            targetValue: 34
                        });
                        arrayAnimate.push({
       
                            target: self.options.head.page.options.configuration.planName.instance.options,
                            property: "top",
                            startValue: 20,
                            targetValue: 30
                        });
                    } else if (strMode === "postPause") {
                    	
                    	arrayAnimate.push({
                    		
                    		target: self.options.head.page.options.configuration.planDelHyperlink.instance.options,
                    		property: "opacity",
                    		startValue: 0,
                    		targetValue: 1
                    	});
                    	arrayAnimate.push({
                    		
                    		target: self.options.head.page.options.configuration.or1.instance.options,
                    		property: "opacity",
                    		startValue: 0,
                    		targetValue: 1
                    	});
                    	arrayAnimate.push({
                    		
                    		target: self.options.head.page.options.configuration.planPropsHyperlink.instance.options,
                    		property: "opacity",
                    		startValue: 0,
                    		targetValue: 1
                    	});
                    	arrayAnimate.push({
                    		
                    		target: self.options.head.page.options.configuration.comboButton.instance.options,
                    		property: "opacity",
                    		startValue: 0,
                    		targetValue: 1
                    	});
                    	arrayAnimate.push({
                    		
                    		target: self.options.head.page.options.configuration.addPlanButton.instance.options,
                    		property: "opacity",
                    		startValue: 0,
                    		targetValue: 1
                    	});
                    	arrayAnimate.push({
                    		
                    		target: self.options.head.page.options.configuration.stopButton.instance.options,
                    		property: "opacity",
                    		startValue: 0,
                    		targetValue: 1
                    	});
                    	arrayAnimate.push({
                    		
                    		target: self.options.head.page.options.configuration.planDelHyperlink.instance.options,
                    		property: "opacity",
                    		startValue: 0,
                    		targetValue: 1
                    	});
                    	
                    } else if (strMode === "postPostPause") {
       
                        arrayAnimate.push({
       
                            target: self.options.head.page.options.configuration.youCanSwitch.instance.options,
                            property: "opacity",
                            startValue: 0,
                            targetValue: 1
                        });
                        arrayAnimate.push({
       
                            target: self.options.head.page.options.configuration.clickEnd.instance.options,
                            property: "opacity",
                            startValue: 0,
                            targetValue: 1
                        });
                    } else if (strMode === "run" || strMode === "stop") {
       
                        arrayAnimate.push({
       
                            target: self.options.head.page.options.configuration.stopButton.instance.options,
                            property: "opacity",
                            startValue: 1,
                            targetValue: 0
                        });
                        arrayAnimate.push({
       
                            target: self.options.head.page.options.configuration.or1.instance.options,
                            property: "opacity",
                            startValue: 1,
                            targetValue: 0
                        });
                        arrayAnimate.push({
       
                            target: self.options.head.page.options.configuration.planDelHyperlink.instance.options,
                            property: "opacity",
                            startValue: 1,
                            targetValue: 0
                        });
                        arrayAnimate.push({
       
                            target: self.options.head.page.options.configuration.youCanSwitch.instance.options,
                            property: "opacity",
                            startValue: 1,
                            targetValue: 0
                        });
                        arrayAnimate.push({
       
                            target: self.options.head.page.options.configuration.clickEnd.instance.options,
                            property: "opacity",
                            startValue: 1,
                            targetValue: 0
                        });
                        arrayAnimate.push({
       
                            target: self.options.head.page.options.configuration.planPropsHyperlink.instance.options,
                            property: "opacity",
                            startValue: 1,
                            targetValue: 0
                        });
                        arrayAnimate.push({
       
                            target: self.options.head.page.options.configuration.comboButton.instance.options,
                            property: "opacity",
                            startValue: 1,
                            targetValue: 0
                        });
                        arrayAnimate.push({
       
                            target: self.options.head.page.options.configuration.addPlanButton.instance.options,
                            property: "opacity",
                            startValue: 1,
                            targetValue: 0
                        });
                    } else if (strMode === "postRun" || strMode === "postStop") {
                    	
                        arrayAnimate.push({
                            
                            target: self.options.head,
                            property: "height",
                            startValue: self.options.head.targetHeight,
                            targetValue: self.options.head.startHeight
                        });
                        arrayAnimate.push({
                            
                            target: self.options.head.page.options.configuration.playButton.instance.options,
                            property: "top",
                            startValue: 34,
                            targetValue: 14
                        });
                        arrayAnimate.push({
       
                            target: self.options.head.page.options.configuration.planName.instance.options,
                            property: "top",
                            startValue: 30,
                            targetValue: 20
                        });
                    }

                    var functionUpdate = function () {
                    
                        try {
                        
                            // Get percent.
                            var dCurrentTime = new Date().getTime();
                            var dEllapsedTime = dCurrentTime - dStartTime;
                            var dPercent = dEllapsedTime / dDuration;

                            if (dPercent < 1) {

                                // Still processing...
       
                                // Update.
                                for (var i = 0; i < arrayAnimate.length; i++) {
       
                                    var objectAnimate = arrayAnimate[i];
                                    if (objectAnimate === null) {
       
                                        continue;
                                    }
                                    objectAnimate.target[objectAnimate.property] = objectAnimate.startValue +
                                        (objectAnimate.targetValue - objectAnimate.startValue) * dPercent;
                                }

                                // Display.
                                var exceptionRet = m_functionRender();
                                if (exceptionRet !== null) {
       
                                    throw exceptionRet;
                                }

                                // Not done, continue for another loop.
                                setTimeout(functionUpdate,
                                    10);
                            } else {

                                // Done, finish up.
       
                                // Update.
                                for (var i = 0; i < arrayAnimate.length; i++) {
       
                                    var objectAnimate = arrayAnimate[i];
                                    if (objectAnimate === null) {
       
                                        continue;
                                    }
                                    objectAnimate.target[objectAnimate.property] = objectAnimate.targetValue;
                                }

                                // Display.
                                var exceptionRet = m_functionRender();
                                if (exceptionRet !== null) {
                                    
                                    throw exceptionRet;
                                }
                                
                                if (strMode === "resumeRunningDB") {
                                	
                                	exceptionRet = self.doHeaderAnimation("postResumeRunningDB");
                                    if (exceptionRet !== null) {
                                        
                                        throw exceptionRet;
                                    }
       
                                } else if (strMode === "postResumeRunningDB") {
                                	
                                	exceptionRet = self.configureMode("run");
                                    if (exceptionRet !== null) {
                                        
                                        throw exceptionRet;
                                    }
       
                                } else if (strMode === "pause") {
                                	
                                	exceptionRet = self.configureMode("pause");
                                    if (exceptionRet !== null) {
                                        
                                        throw exceptionRet;
                                    }
       
                                } else if (strMode === "postPause") {
                                	
                                	exceptionRet = self.doHeaderAnimation("postPostPause");
                                    if (exceptionRet !== null) {
                                        
                                        throw exceptionRet;
                                    }
       
                                } else if (strMode === "postPostPause"){
                                	
                                	return;
                                
                                } else if (strMode === "run") {
                                	
                                	exceptionRet = self.doHeaderAnimation("postRun");
                                    if (exceptionRet !== null) {
                                        
                                        throw exceptionRet;
                                    }
       
                                } else if (strMode === "postRun") {
                                
                                	exceptionRet = self.configureMode("run");
                                    if (exceptionRet !== null) {
                                        
                                        throw exceptionRet;
                                    }
       
                                } else if (strMode === "resumePaused") {
                                    
                                	exceptionRet = self.doHeaderAnimation("postResumePaused");
                                    if (exceptionRet !== null) {
                                        
                                        throw exceptionRet;
                                    }
       
                                } else if (strMode === "postResumePaused") {
                                	
                                	return;
                                	
                                } else if (strMode === "stop") {
                                	
                                	exceptionRet = self.doHeaderAnimation("postStop");
                                    if (exceptionRet !== null) {
                                        
                                        throw exceptionRet;
                                    }
       
                                } else if (strMode === "postStop") {
                                	
                                	exceptionRet = self.configureMode("stop");
                                    if (exceptionRet !== null) {
                                        
                                        throw exceptionRet;
                                    }
       
                                }
                            }
                        } catch (e) {

                            alert(e.message);
                        }
                    };

                    // Kick the process off.
                    setTimeout(functionUpdate,
                        10);

                    return null;
                } catch (e) {

                    return e;
                }
            };
            
            ////////////////////////////////////////////////////////////
            //
            // List widther
            //
            ///////////////////////////////////////////////////////////
           
            // Calculate and return size of max item
            // in list given font implicit in context.
        	self.calculateMaxWidthOfList = function (list,
                context) {

                // Note: as this is essentially a "get" accessor, no exception handling.
                var dMaxWidth = context.measureText("Select...").width;
       
                // Loop over each item in the list.
                for (var i = 0; i < list.length; i++) {
       
                    // Ask the context to measure the string.
                    var sizeText = context.measureText(list[i].text);
       
                    // Preserve the maximum width.
                    if (sizeText.width > dMaxWidth)
                        dMaxWidth = sizeText.width;
                }

                // Return result.
                return dMaxWidth;
        	};
            
            ////////////////////////////////////////////////////////////
            //
            // End of list widther
            //
            ///////////////////////////////////////////////////////////
            
            ////////////////////////////////////////////////////////////
            //
            // Validators
            //
            ///////////////////////////////////////////////////////////
            
            // A very specialized year string validator. If any problems with
            // entry, error message is returned as the message part of an Error,
            // else null is returned. 
            self.validateDate = function (entry, from, thru) {
            	
            	// entry must be 4 numeric chars >= from and <= thru
            	if (entry === undefined || entry === null || entry === "")
            		return new Error("You must enter a year.");
            	
            	if (isNaN(entry))
            		return new Error("You must enter a properly formatted year.");
            	
            	if (entry < from || entry > thru)
            		return new Error("The year must be between " + from + " and " + thru + ".");
            	
            	return null;
            };
            
            // Very specialized: negatives not allowed, although 0 is.
            // Tests for; all numeric except possible $,.; 2 decimal or none.
            // Also, "$" is rejected.
            self.validateMoney = function(entry) {
            	
            	if (entry === "$")
            		return new Error("An amount is required.");
            	
            	if (!entry.match(/^\$?(([0-9]{1,3},?([0-9]{3},?)*)[0-9]{3}|[0-9]{0,3})(\.[0-9]{2})?$/))
            		return new Error("The amount you entered is not formatted correctly.");
            	
            	return null;
            };
            
            // After validating a user-entered currency string,
            // this method will be called with the entry
            // to format it to a standard for easier processing
            // in the server bean.
            self.standardizeMoney = function(entry) {
            	
            	// Strip out $,.
            	var n = Number(entry.replace(/[^0-9\.]/g, ''));
            	return "$" + n.toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
            };
            
            // Everything is ok except the empty string.
            self.validateString = function(entry) {
            	
            	if (entry === undefined || entry === null || entry === "")
            		return new Error("Your entry must not be blank.");
            	
            	return null;
            };

            ////////////////////////////////////////////////////////////
            //
            // End of Validators
            //
            ///////////////////////////////////////////////////////////
            
            // Return the string which fits in the size.
            self.fitStringToWidth = function (strDescription,
                fontRender,
                dWidth) {

                // First just fall out.
                var dFirstSize = strDescription.size(fontRender).width;
                if (dFirstSize <= dWidth) {

                    return strDescription;
                }

                // Chop off one character at a time.
                strDescription = strDescription.substring(0, strDescription.length - 1);
                var strUse = strDescription + "...";
                while (strUse.size(fontRender).width > dWidth) {

                    strDescription = strDescription.substring(0, strDescription.length - 1);
                    strUse = strDescription + "...";
                }
                return strUse;
            };
            
            // General routine to handle decision making about which page to nav to in a variety of
            // cases--all based on presence or absence of data.
            self.getNextPageId = function (section) {
            	
            	if (section === "self") {

            		return (!self.options.wizData.household.self.selfIsComplete) ? "Page2_1"
            				: self.getNextPageId("household");
            	
            	} else if (section === "household") {
	            		
            		return (self.options.wizData.household.dbDataExists) ? "Page1_1" 
            				: ((self.options.wizData.household.self.maritalStatus === "Married") ? "Page2_5" : "Page3_0");
	            		
            	} else if (section === "assetsRetirement") {

            		return (self.options.wizData.assets.retirementAccounts.userMayGoThruSection) ? "Page4_2" : "Page4_1";
	
            	} else if (section === "assetsCollege") {
            		
            		if (!self.options.wizData.assets.collegeAccounts.userMayGoThruSection)
            			return "Page4_12";
            		
            		// Special work here to get qualified to go to 4_13.
            		if (self.anyChildrenLT30() === true)
                   		return "Page4_13";

            		return self.getNextPageId("assetsOtherInvestment");
	
            	} else if (section === "assetsOtherInvestment") {
	            		
            		return (self.options.wizData.assets.otherInvestmentAccounts.userMayGoThruSection) ? "Page5_2" :	"Page5_1";
	
            	} else if (section === "assetsBank") {
            		
            		return (self.options.wizData.assets.otherBankAccounts.userMayGoThruSection) ? "Page5_8" : "Page5_7";

            	// below is/are special navigation cases, not section-skipping cases	
            	} else if (section === "elEmpMarried") {
            		
            		return (self.options.wizData.household.self.maritalStatus === "Married") ? "Page5a_3" : "Page5a_5";
	
            	} else {
	            		
            		throw { message: "Bad section name passed to wizard.getNextPageId." };
            	}
            };
            
            self.anyChildrenLT30 = function() {
            	
                var thirtyYearsAgo = (new Date().getFullYear() - 30).toString();
                for (var i = 0; i < self.options.wizData.children.length; i++) {
                	
                	var childIth = self.options.wizData.children[i];
                	if (!(childIth.dob < thirtyYearsAgo)) {
                		
                		return true;
                	}
                }
            	
                return false;
            };
            
            // Begin load page into wizard.
            self.loadPage = function (strPageId) {

                try {
                	
                	// Whenever a page is loaded, set that in wizData and send wizData to Bean -- UNLESS
                	// user is on PageConfirmStop.
                	//
                	// Also, if a beginning of section page is being loaded, set corresponding bool in wizData
                	// to enabled that section's section button.
                	//
                	// And also, if we reach one of the 'yay' end of section pages, set its createDatabaseEntities = true.
                	if (strPageId !== "PageConfirmStop") {
	                	self.options.wizData.lastQuestionPage = strPageId;
	                	
	                	if (strPageId === "Page1_1" || strPageId === "Page2_1" || strPageId === "Page2_5" || strPageId === "Page3_0")
	                		self.options.wizData.household.sectionButtonEnabled = true;
	                	
	                	if (strPageId === "Page4_1" || strPageId === "Page4_2")
	                		self.options.wizData.assets.sectionButtonEnabled = true;

	                	// The following two lines will e removed when all pages are done.
	                	if (strPageId === "Page5_7" || strPageId === "Page5_8")
	                		self.options.wizData.assets.sectionButtonEnabled = true;
	                	
	                	if (strPageId === "Page5a_1")
	                		self.options.wizData.everydayLife.sectionButtonEnabled = true;
	                	
	                	self.onQuestionCompleted({wizData: self.options.wizData});
                	}

                    // Fade out the old page, then...
                    self.fadePage(false,
                        function () {
                    	
                    		try {
                    			
	                            // ...require page and load into manager and re-render wizard.
	                            var strPageUri = self.options.page.basePath + strPageId + self.options.page.extension;
	                            require([strPageUri],
	                                m_functionRequirePage);
	                            return null;
                    		
                    		} catch(e) {
                    		
                    			return e;
                    		}
                        });
                    return null;
                } catch (e) {

                    return e;
                }
            };
       
            // Destroy object.
            self.destroy = function () {

                try {

                    // Wire events to canvas.
                    m_jqCanvas.unbind("click",
                        m_functionClick);
                    m_jqCanvas.unbind("mousemove",
                        m_functionMouseMove);
                    m_jqCanvas.unbind("mousedown",
                        m_functionMouseDown);
                    m_jqCanvas.unbind("mouseup",
                        m_functionMouseUp);
                    m_jqCanvas.unbind("mouseout",
                        m_functionMouseOut);
                    m_jqCanvas.unbind("keydown",
                        m_functionOnKeyDown);
                    m_jqCanvas.unbind("keypress",
                        m_functionOnKeyPress);
                    m_jqCanvas.unbind("keyup",
                        m_functionOnKeyUp);

                    // Un-hook the resize to update the size of the dashboard when the browser is resized.
                    $(window).unbind("resize",
                        m_functionWindowResize);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Begin load page into wizard.
            self.forceRender = function (bClean) {

                try {

                    // Default to false.
                    if (bClean === undefined) {
       
                        bClean = false;
                    }
       
                    // Cause recalculate of layout.
                    m_bDirty = !bClean;
                    
                    return m_functionRender();
                } catch (e) {

                    return e;
                }
            };
       
            // Fade-in/out regions on page.
            self.fadePage = function (bIn,
                functionCallback) {
       
                try {
       
                    // If no page, then call callback immediately.
                    if (!self.options.page.instance) {
       
                        if ($.isFunction(functionCallback)) {
       
                            functionCallback();
                        }
                        return null;
                    }
       
                    // Initialize state.
                    var dStartTime = new Date().getTime();
                    var dDuration = 500;
       
                    var functionUpdate = function () {
                    
                        try {
                        
                            // Get percent.
                            var dCurrentTime = new Date().getTime();
                            var dEllapsedTime = dCurrentTime - dStartTime;
                            var dPercent = dEllapsedTime / dDuration;
       
                            // If not in, then out...
                            if (!bIn) {
       
                                dPercent = 1 - dPercent;
                            }

                            // Check for inside bounds.
                            if ((bIn && dPercent < 1) ||
                                (!bIn && dPercent > 0)) {

                                // Update.
                                var exceptionRet = self.options.page.instance.fadePage(dPercent);
                                if (exceptionRet !== null) {
                                    
                                    return exceptionRet;
                                }

                                // Display.
                                exceptionRet = m_functionRender();
                                if (exceptionRet !== null) {
                                    
                                    return exceptionRet;
                                }
       
                                setTimeout(functionUpdate,
                                    10);
                            } else {
       
                                // Finish.
                                var exceptionRet = self.options.page.instance.fadePage(bIn ? 1 : 0);
                                if (exceptionRet !== null) {
                                    
                                    return exceptionRet;
                                }

                                // Display.
                                exceptionRet = m_functionRender();
                                if (exceptionRet !== null) {
                                    
                                    return exceptionRet;
                                }
       
                                // Invoke the callback....
                                if ($.isFunction(functionCallback)) {
       
                                    var exceptionRet = functionCallback();
                                    if (exceptionRet !== null) {
       
                                        alert(exceptionRet.message);
                                    }
                                }
                            }
                        } catch (e) {
                        
                            alert(e.message);
                        }
                    };

                    setTimeout(functionUpdate,
                        10);

                    return null;
                } catch (e) {
       
                    return e;
                }
            };

            // Return the height of the head object.
            self.headHeight = function () {
       
                return self.options.body.top;
            };
       
            // Create an overlay canvas and page hosted on it.  Page
            // covers head and body and takes primacy for input events.
            self.createPopupPage = function (strPageId) {
       
                try {

                    // Require overlay page.
                    var strPageUri = self.options.page.basePath + strPageId + self.options.page.extension;
                    require([strPageUri],
                        m_functionRequirePopupPage);

                    return null;
                } catch (e) {
       
                    return e;
                }
            };

            // Destroy overlay page.
            self.destroyPopupPage = function () {
       
                try {

                    // Destroy.
                    self.options.popup.instance = null;
                    m_jqPopup.remove();
                    m_jqPopup = null;
                    m_canvasPopup = null;
                    m_contextPopup = null;

                    // Render.
                    return self.forceRender();
                } catch (e) {
       
                    return e;
                }
            };
            
            ////////////////////////////////////////////
            // Public fields.

            // Options configuration.
            self.options = {

                planName: "aaa",
                postRequirePageConfigureMode: null,
                page: {
       
                    instance: null,             // Instance of page.
                    id: "PageWelcome",          // The page to load.
                    basePath: "Wizard/pages/",  // Location of pages.
                    extension: ""				// Type to append to the end of the composed require resource.
                },                              // The page of questions.
                popup: {
       
                    instance: null              // Instance of popup page.
                },                              // The page of questions.
                fillAmbient: "#333333",         // Ambient background color.
                pauseOverlayOpacity: 0.5,       // How greyed is the overlay during pause mode.
                head: {

                    fillBackground: "#464646",
                    left: 0,
                    top: 0,
                    width: 800,
                    height: 81,
                    startHeight: 81,
                    targetHeight: 118,
                    page: null
                },                              // The head, banner, area on the wizard.
                body: {
                    
                    cornerRadius: 20,
                    fillBackground: "#ffffff",
                    left: 0,
                    top: 81,
                    width: 800,
                    height: 524,
                    roundedButton: new RegionButtonRounded()
                },                              // The body, client, area on the wizard.
                host: {

                    selector: "#Host"           // The host selector.
                }
            };

            ////////////////////////////////////////////
            // Private methods.

            // Calculate e.offsetX and e.offsetY if they are undefined (as in Firefox)
        	var m_functionPossibleFirefoxAdjustment = function (e) {

        		try {
        			
        			if (e.offsetX !== undefined &&
                        e.offsetY !== undefined)
	        			return null;
	        		
	        		e.offsetX = e.pageX - m_jqParent.offset().left;
	        		e.offsetY = e.pageY - m_jqParent.offset().top;

                    return null;
        		} catch (e) {
        			
        			return e;
        		}
        	};
            
            // Invoked when the browser is resized.
            // Implemented to recalculate the regions.
            var m_functionWindowResize = function (e) {

                try {

                    m_bDirty = true;
       
                    // Cause a render.
                    var exceptionRet = m_functionRender();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            // Calculate the section rectangles.
            var m_functionCalculateLayout = function () {

                try {

                    // Get the width from the container.
                    m_dWidth = m_jqParent.width();
                    if (m_dWidth === undefined || m_dWidth === 0) {

                        m_dWidth = 800;
                    }

                    // The required height of the control is the sum of all the sections heights.
                    var dTotal = self.options.head.startHeight +    // Use start height because the actual height changes.
                        self.options.body.height;

                    // Resize the parent element height.
                    m_jqParent.height(dTotal);

                    // Size the banner and client widths (all other parameters are set and fixed).
                    self.options.head.width = m_dWidth;
                    self.options.body.width = m_dWidth;

                    // These pipes are clean.
                    m_bDirty = false;

                    // Update the header page.
                    var exceptionRet = null;
                    if (self.options.head.page) {
       
                        exceptionRet = self.options.head.page.calculateLayout(m_dWidth);
                        if (exceptionRet !== null) {

                            return exceptionRet;
                        }
                    }

                    // If there is a page, then calculate its layout.
                    if (self.options.page.instance !== null) {

                        exceptionRet = self.options.page.instance.calculateLayout(m_dWidth);
                        if (exceptionRet !== null) {
       
                            return exceptionRet;
                        }
                    }

                    // Resize the overlay div, if extant.
                    if (m_jqPause) {
       
                        m_jqPause.css({
       
                            width: m_dWidth + "px",
                            height: (dTotal - self.options.head.height) + "px"
                        });
                    }

                    // Finally, resize the popup canvas and page, if extant.
                    if (m_canvasPopup) {

                        // Update canvas sizes.
                        m_canvasPopup.width = m_dWidth;
                        m_canvasPopup.height = m_dHeight;

                        exceptionRet = self.options.popup.instance.calculateLayout(m_dWidth);
                        if (exceptionRet !== null) {

                            return exceptionRet;
                        }
                    }

                    // Update canvas sizes--do this last to minimize the time that the canvas is blank.
                    m_canvasRender.width = m_dWidth;
                    m_canvasRender.height = dTotal;
                    m_dHeight = dTotal;
                    
                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render out the wizard.
            var m_functionRender = function () {
                
                try {
       
                    var exceptionRet = null;
       
                    // Calculate the layout whenever dirty.
                    if (m_bDirty) {

                        exceptionRet = m_functionCalculateLayout();
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
                    }

                    // Render body.
                    exceptionRet = m_functionRenderBody();
                    if (exceptionRet !== null) {
                        
                        return exceptionRet;
                    }

                    // Drop out if page instance is null.
                    if (!self.options.page.instance) {
       
                        return null;
                    }

                    // Render out the manager/page/regions.
                    exceptionRet = self.options.page.instance.render();
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }
       
                    // Render head.
                    exceptionRet = m_functionRenderHead();
                    if (exceptionRet !== null) {
                        
                        return exceptionRet;
                    }
       
                    // Render head regions.
                    exceptionRet = self.options.head.page.render();
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }

                    // Render the popup page.
                    if (self.options.popup.instance) {
       
                        // Clear the popup canvas.
                        m_contextPopup.fillStyle = "transparent";
                        m_contextPopup.fillRect(0,
                            0,
                            m_dWidth,
                            m_dHeight);

                        // Render out the popup regions.
                        exceptionRet = self.options.popup.instance.render();
                        if (exceptionRet !== null) {
       
                            return exceptionRet;
                        }
                    }
       
                    return null;
                } catch (e) {
                    
                    return e;
                }
            };

            // Render out the head.
            var m_functionRenderHead = function () {
                
                try {
                    
                    m_contextRender.fillStyle = self.options.head.fillBackground;
                    m_contextRender.fillRect(self.options.head.left,
                        self.options.head.top,
                        self.options.head.width,
                        self.options.head.height);
                    
                    return null;
                } catch (e) {
                    
                    return e;
                }
            };

            // Render out the body.
            var m_functionRenderBody = function () {

                try {
                	
//                	alert('m_dWidth=' + m_dWidth.toString() + '; options.width=' + self.options.body.width.toString());
                	
                	
                    // Clear out background.
                    m_contextRender.fillStyle = self.options.fillAmbient; 
                    m_contextRender.fillRect(0, 
                            m_dHeight - self.options.body.cornerRadius,
                            m_dWidth, 
                            self.options.body.cornerRadius);

                    // Draw the rounded body background.
                    m_contextRender.beginPath();
                    m_contextRender.moveTo(self.options.body.left,
                            self.options.body.top);
                    m_contextRender.lineTo(self.options.body.left,
                            self.options.body.top + self.options.body.height - self.options.body.cornerRadius);
                    m_contextRender.quadraticCurveTo(self.options.body.left,
                            self.options.body.top + self.options.body.height,
                            self.options.body.left + self.options.body.cornerRadius,
                            self.options.body.top + self.options.body.height);

                    m_contextRender.lineTo(self.options.body.left + self.options.body.width - self.options.body.cornerRadius,
                            self.options.body.top + self.options.body.height);

                    m_contextRender.quadraticCurveTo(self.options.body.left + self.options.body.width,
                            self.options.body.top + self.options.body.height,
                            self.options.body.left + self.options.body.width,
                            self.options.body.top + self.options.body.height - self.options.body.cornerRadius);

                    m_contextRender.lineTo(self.options.body.left + self.options.body.width,
                            self.options.body.top);

                    m_contextRender.closePath();
                      
                    m_contextRender.fillStyle = self.options.body.fillBackground;
                    m_contextRender.fill();
       
                    // Render the rounded buttons so there is no flash when a new page is rendered.
                    self.options.body.roundedButton.options.context = m_contextRender;
                    self.options.body.roundedButton.options.opacity = 1;
                    self.options.body.roundedButton.options.top = 446 + self.options.body.top;
                    self.options.body.roundedButton.options.bigLabel.text = "Household";
                    self.options.body.roundedButton.options.smallLabel.text = "You and your family";
                    self.options.body.roundedButton.options.left = 10;
                    self.options.body.roundedButton.options.enabled = self.options.wizData.household.sectionButtonEnabled;
                    var exceptionRet = self.options.body.roundedButton.render();
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }

                    self.options.body.roundedButton.options.bigLabel.text = "Assets";
                    self.options.body.roundedButton.options.smallLabel.text = "Investments and cash";
                    self.options.body.roundedButton.options.left = 272;
                    self.options.body.roundedButton.options.enabled = self.options.wizData.assets.sectionButtonEnabled;
                    exceptionRet = self.options.body.roundedButton.render();
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }

                    self.options.body.roundedButton.options.bigLabel.text = "Everyday Living";
                    self.options.body.roundedButton.options.smallLabel.text = "Income, expense and saving";
                    self.options.body.roundedButton.options.left = 534;
                    self.options.body.roundedButton.options.enabled = self.options.wizData.everydayLife.sectionButtonEnabled;
                    exceptionRet = self.options.body.roundedButton.render();
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }
                    return null;
                } catch (e) {
                    
                    return e;
                }
            };
       
            // Method invoked when a new page is required.
            var m_functionRequirePage = function (Page) {
       
                try {

                    // Want next render to calculate layout.
                    m_bDirty = true;
       
                    // Pass this into page.
                    var option = {

                        wizard: self,
                        context: m_contextRender
                    };

                    // Allocate page.
                    self.options.page.instance = new Page(option);

                    // Build the page.
                    return self.options.page.instance.create(function () {
                    
                         self.fadePage(true,
                            function () {
                            
                                try {
                                
                                    // If a post require page confiure mode was specified, then invoke it.
                                    if (self.options.postRequirePageConfigureMode) {
                                    
                                        var exceptionRet = self.configureMode(self.options.postRequirePageConfigureMode);
                                        if (exceptionRet !== null) {
                                        
                                            throw exceptionRet;
                                        }
                                       
                                        // Clear out so next page works differently.
                                        self.options.postRequirePageConfigureMode = null;
                                    }
                                    
                                    return null;
                                } catch (e) {
                                
                                    return e;
                                }
                            });
                        });
                } catch (e) {
                            
                    alert(e.message);
                }
            };
            
            // Method invoked when a new overlay page is required.
            var m_functionRequirePopupPage = function (Page) {
       
                try {

                    // Want next render to calculate layout.
                    m_bDirty = true;
       
                    // Allocate popup-canvas.
                    m_canvasPopup = document.createElement("canvas");
                    m_canvasPopup.id = "Popup";
                    m_contextPopup = m_canvasPopup.getContext("2d");
                    m_jqPopup = $(m_canvasPopup);
                    m_jqPopup.css({
       
                            "z-index": 20,
                            position: "absolute",
                            top: "0px",
                            left: "0px"
                        });
                    m_jqParent.append(m_canvasPopup);
       
                    // Wire events to canvas.
                    m_jqPopup.bind("click",
                        m_functionClick);
                    m_jqPopup.bind("mousemove",
                        m_functionMouseMove);
                    m_jqPopup.bind("mouseup",
                        m_functionMouseUp);
                    m_jqPopup.bind("mouseout",
                        m_functionMouseOut);
                    m_jqPopup.bind("mousedown",
                        m_functionMouseDown);
                    m_jqPopup.bind("keypress",
                        m_functionKeyPress);
                    m_jqPopup.bind("keydown",
                        m_functionKeyDown);
                    m_jqPopup.bind("keyup",
                        m_functionKeyUp);
       
                    // Pass this into page.
                    var option = {
       
                        wizard: self,
                        context: m_contextPopup
                    };

                    // Allocate page.
                    self.options.popup.instance = new Page(option);

                    // Build the page.
                    return self.options.popup.instance.create();
                    
                } catch (e) {
                            
                    alert(e.message);
                }
            };
            
            // Invoked when the canvas is clicked by the user.
            // Implemented to pass on to managed regions.
            var m_functionClick = function (e) {

                try {
       
                    // Possibly adjust offset for firefox.
                    var exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }
       
                    // If the popup is extant, then funnel input events to it.
                    if (self.options.popup.instance) {
                    	
                        // Also pass on to header page.
                        exceptionRet = self.options.popup.instance.onClick(e);
                        if (exceptionRet !== null) {
       
                            throw exceptionRet;
                        }
                        
                        // If the popup is still open, then destroy it--user clicked off it.
                        if (self.options.popup.instance) {
                        	
                        	exceptionRet = self.destroyPopupPage();
                            if (exceptionRet !== null) {
                                
                                throw exceptionRet;
                            }
                        }

                        return null;
                    }
       
                    // Can only render a valid page.
                    if (!self.options.page.instance) {
       
                        return null;
                    }
       
                    // Pass on to page.
                    exceptionRet = self.options.page.instance.onClick(e);
                    if (exceptionRet !== null) {
       
                        throw exceptionRet;
                    }
       
                    // Also pass on to header page.
                    exceptionRet = self.options.head.page.onClick(e);
                    if (exceptionRet !== null) {
       
                        throw exceptionRet;
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            // Invoked when the mouse is moved over the canvas.
            // Implemented to pass on to managed regions.
            var m_functionMouseMove = function (e) {

                try {

                    // Possibly adjust offset for firefox.
                    var exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }
       
                    // If the popup is extant, then funnel input events to it.
                    if (self.options.popup.instance) {
       
                        // Also pass on to header page.
                        var strCursor = self.options.popup.instance.onMouseMove(e);
                        if (strCursor) {

                            m_jqPopup.css("cursor",
                                strCursor);
                        } else {
       
                            // If here, then no control serviced the mouse move.
                            m_jqPopup.css("cursor",
                                "default");
                        }

                        return;
                    }
       
                    // Can only render a valid page.
                    if (!self.options.page.instance) {
       
                        return;
                    }
       
                    // Pass on to page.
                    var strCursor = self.options.page.instance.onMouseMove(e);
                    if (strCursor) {

                        m_jqCanvas.css("cursor",
                            strCursor);
                    } else {
       
                        strCursor = self.options.head.page.onMouseMove(e);
                        if (strCursor) {

                            m_jqCanvas.css("cursor",
                                strCursor);
                        } else {
       
                            // If here, then no control serviced the mouse move.
                            m_jqCanvas.css("cursor",
                                "default");
                        }
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            // Invoked when the mouse is let up over the canvas.
            // Implemented to pass on to managed regions.
            var m_functionMouseUp = function (e) {

                try {

                    // Possibly adjust offset for firefox.
                    var exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                    if (exceptionRet !== null) {
       
                        throw exceptionRet;
                    }
       
                    // If the popup is extant, then funnel input events to it.
                    if (self.options.popup.instance) {
       
                        exceptionRet = self.options.popup.instance.onMouseUp(e);
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                        return;
                    }
       
                    // Can only render a valid page.
                    if (self.options.page.instance) {
       
                        exceptionRet = self.options.page.instance.onMouseUp(e);
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                    }
       
                    // Let the header get a crack at it too.
                    if (self.options.head.page) {
       
                        exceptionRet = self.options.head.page.onMouseUp(e);
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                    }
                } catch (e) {

                    alert(e.message);
                }
            };
       
            // Invoked when the mouse is moved away from the canvas.
            // Implemented to pass on to managed regions.
            var m_functionMouseOut = function (e) {

                try {

                    // Possibly adjust offset for firefox.
                    var exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                    if (exceptionRet !== null) {
       
                        throw exceptionRet;
                    }
       
                    // If the popup is extant, then funnel input events to it.
                    if (self.options.popup.instance) {
       
                        exceptionRet = self.options.popup.instance.onMouseOut(e);
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                        return;
                    }
       
                    // Can only render a valid page.
                    if (self.options.page.instance) {
       
                        exceptionRet = self.options.page.instance.onMouseOut(e);
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                    }
       
                    // Let the header get a crack at it too.
                    if (self.options.head.page) {
       
                        exceptionRet = self.options.head.page.onMouseOut(e);
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                    }
                } catch (e) {

                    alert(e.message);
                }
            };
       
            // Invoked when the mouse is pressed down over the canvas.
            // Implemented to pass on to managed regions.
            var m_functionMouseDown = function (e) {

                try {

                    // Possibly adjust offset for firefox.
                    var exceptionRet = m_functionPossibleFirefoxAdjustment(e);
                    if (exceptionRet !== null) {
       
                        throw exceptionRet;
                    }
       
                    // If the popup is extant, then funnel input events to it.
                    if (self.options.popup.instance) {
       
                        exceptionRet = self.options.popup.instance.onMouseDown(e);
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                        return;
                    }
       
                    // Can only render a valid page.
                    if (self.options.page.instance) {
       
                        exceptionRet = self.options.page.instance.onMouseDown(e);
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                    }
       
                    // Let the header get a crack at it too.
                    if (self.options.head.page) {
       
                        exceptionRet = self.options.head.page.onMouseDown(e);
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                    }
                } catch (e) {

                    alert(e.message);
                }
            };
       
            // Invoked when a key is depressed over the canvas.
            // Implemented to pass on to managed regions.
            var m_functionKeyDown = function (e) {

                try {

                    // If the popup is extant, then funnel input events to it.
                    var exceptionRet = null;
                    if (self.options.popup.instance) {
       
                        exceptionRet = self.options.popup.instance.onKeyDown(e);
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                        return;
                    }
       
                    // Can only render a valid page.
                    if (self.options.page.instance) {
       
                        exceptionRet = self.options.page.instance.onKeyDown(e);
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                    }
       
                    // Let the header get a crack at it too.
                    if (self.options.head.page) {
       
                        exceptionRet = self.options.head.page.onKeyDown(e);
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            // Invoked when a key is let up over the canvas.
            // Implemented to pass on to managed regions.
            var m_functionKeyUp = function (e) {

                try {

                    // If the popup is extant, then funnel input events to it.
                    var exceptionRet = null;
                    if (self.options.popup.instance) {
       
                        exceptionRet = self.options.popup.instance.onKeyUp(e);
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                        return;
                    }
       
                    // Can only render a valid page.
                    if (self.options.page.instance) {
       
                        exceptionRet = self.options.page.instance.onKeyUp(e);
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                    }
       
                    // Let the header get a crack at it too.
                    if (self.options.head.page) {
       
                        exceptionRet = self.options.head.page.onKeyUp(e);
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                    }
                } catch (e) {

                    alert(e.message);
                }
            };
       
            // Invoked when a key is pressed over the canvas.
            // Implemented to pass on to managed regions.
            var m_functionKeyPress = function (e) {

                try {

                    // If the popup is extant, then funnel input events to it.
                    var exceptionRet = null;
                    if (self.options.popup.instance) {
       
                        exceptionRet = self.options.popup.instance.onKeyPress(e);
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                        return;
                    }
       
                    // Can only render a valid page.
                    if (self.options.page.instance) {
       
                        exceptionRet = self.options.page.instance.onKeyPress(e);
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                    }
       
                    // Let the header get a crack at it too.
                    if (self.options.head.page) {
       
                        exceptionRet = self.options.head.page.onKeyPress(e);
                        if (exceptionRet !== null) {
           
                            throw exceptionRet;
                        }
                    }
                } catch (e) {

                    alert(e.message);
                }
            };
       
            ////////////////////////////////////////////
            // Private fields.

            // jQuery object wrapping the parent DOM element.
            var m_jqParent = null;
            // jQuery object wrapping the child (render) DOM element.
            var m_jqCanvas = null;
            // The rendering canvas.
            var m_canvasRender = null;
            // The rendering canvas's render context.
            var m_contextRender = null;
            // jQuery object wrapping the popup DOM element.
            var m_jqPopup = null;
            // The popup canvas.
            var m_canvasPopup = null;
            // The popup canvas's render context.
            var m_contextPopup = null;
            // Define the dirty state.
            var m_bDirty = true;
            // Width of object.
            var m_dWidth = 0;
            // Height of object.
            var m_dHeight = 0;
            // Pause mode overlay.
            var m_jqPause = null;

            // Allow constructor parameters to override default settings.
            self.options.inject(optionsOverride);
        };
        
        // Return the constructor function.
        return functionConstructor;
    });