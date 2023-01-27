////////////////////////////////////////
// Page -- Base class for a managed collection of regions comprising a wizard question.
//
// Return constructor function.

"use strict";

define(["App/prototypes"],
    function (prototypes) {

        // Define constructor function.
        var functionRet = function Page(optionsOverride) {

            var self = this;            // Uber closure.

            ////////////////////////////
            // Public methods.

            // Invoked when the canvas is resized.
            self.calculateLayout = function (dNewWidth) {

                // Call "protected" method.
                return self.innerCalculateLayout(dNewWidth);
            };
       
            // Add the page's regions to the manager.
            self.create = function (functionCompleted) {

                try {
       
                    // Give derived classes a chance to handle the create call before this (class does).
                    var exceptionRet = self.innerCreate();
                    if (exceptionRet !== null) {
       
                        return exceptionRet;
                    }
       
                    // Build configuration.
                    var arrayConfigurationKey = Object.keys(self.options.configuration);
       
                    // Maintain a counter of the number of fields to create.
                    var iCounter = arrayConfigurationKey.length;
       
                    // Loop over all fields.
                    for (var i = 0; i < arrayConfigurationKey.length; i++) {

                        // Get the ith key.
                        var strKeyIth = arrayConfigurationKey[i];
                        if (!strKeyIth) {
       
                            continue;
                        }
       
                        // Get the ith region.
                        var regionIth = self.options.configuration[strKeyIth];
                        if (!regionIth) {
       
                            continue;
                        }
       
                        // Extract the type and options.
                        var typeRegion = regionIth.type;
                        var optionsRegion = regionIth.options;
                        var functionPostInitialization = regionIth.postInitialization;
       
                        // Define a method that affords a closure for the parameters.
                        var functionCreateAndInitializeRegion = function (strKeyIth,
                            type,
                            options,
                            functionPostInitialization) {
       
                            try {
       
                                // Require the region and store.
                                var strRegionUri = "Wizard/regions/" + type;
                                require([strRegionUri],
                                    function (Region) {
                                    
                                        try {
                                        
                                            // If not header.
                                            if (!self.options.headerPage) {
                                        
                                                // Always add the head height.
                                                var dOffsetHeight = self.options.wizard.headHeight();
                                        
                                                // Fix up the top of the regions.
                                                options.top += dOffsetHeight;
                                            }
                                        
                                            // Allocate Region.
                                            var regionNew = new Region(options);
                                        
                                            // Add the region to the collection (of regions).
                                            self.options.regions.push(regionNew);
                                        
                                            // Set the key in the region as an id.
                                            regionNew.options.id = strKeyIth;
                                        
                                            // Add the region instance to the configuration node.
                                            self.options.configuration[strKeyIth].instance = regionNew;
                                            
                                            // Also set this.
                                            var exceptionRet = regionNew.setPage(self);
                                            if (exceptionRet !== null) {
                               
                                                throw exceptionRet;
                                            }

                                            // And set the context.
                                            exceptionRet = regionNew.setContext(self.options.context);
                                            if (exceptionRet !== null) {
                               
                                                throw exceptionRet;
                                            }
                                        
                                            // Process post-initialization function, if specified.
                                            if ($.isFunction(functionPostInitialization)) {
                                        
                                                functionPostInitialization.call(regionNew);
                                            }
                                        
                                            // Count the count.  Force render for last region on page.
                                            if (--iCounter === 0) {
                                        
                                                // Invoked completed callback if specified.
                                                if ($.isFunction(functionCompleted)) {
                                        
                                                    functionCompleted();
                                                }
                                        
                                                // Indicate created.
                                                self.options.created = true;
                                        
                                                // Force render.
                                                exceptionRet = self.options.wizard.forceRender();
                                                if (exceptionRet !== null) {
                                   
                                                    throw exceptionRet;
                                                }
                                            }
                                        } catch (e) {
                                        
                                            alert(e.message);
                                        }
                                    });
                            } catch (e) {
       
                                alert(e.message);
                            }
                        };
       
                        // Invoke the callback--this gives each iteration a closure for all passed parameters.
                        functionCreateAndInitializeRegion(strKeyIth,
                            typeRegion,
                            optionsRegion,
                            functionPostInitialization);
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Render out the regions.
            self.render = function () {

                try {

                    // Drop out if create is not complete.
                    if (!self.options.created) {
       
                        return null;
                    }
       
                    // Loop over children and render.
                    for (var i = 0; i < self.options.regions.length; i++) {
       
                        // Get the ith control.
                        var regionIth = self.options.regions[i];
                        if (!regionIth) {
       
                            continue;
                        }
       
                        // Ask it to render itself.
                        var exceptionRet = regionIth.render();
                        if (exceptionRet !== null) {
       
                            return exceptionRet;
                        }
                    }
       
                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Fade-in all regions.
            self.fadePage = function (dPercent) {

                try {

                    // Drop out if create is not complete.
                    if (!self.options.created) {
       
                        return null;
                    }
       
                    // Loop over children and ask them to fade-in.
                    for (var i = 0; i < self.options.regions.length; i++) {

                        // Get the ith control.
                        var regionIth = self.options.regions[i];
                        if (!regionIth) {

                            continue;
                        }

                        regionIth.options.opacity = 
                        	 ((regionIth.options.allowFadeInOut !== undefined) && (!regionIth.options.allowFadeInOut)) ? 1 : dPercent;
                    }
       
                    return null;
                    
                } catch (e) {

                    return e;
                }
            };

            // Invoked when the canvas is clicked by the user.
            // Implemented to pass on to managed regions.
            self.onClick = function (e) {

                try {

                    // Drop out if create is not complete.
                    if (!self.options.created) {
       
                        return null;
                    }
       
                    // Loop over children and ask them to handle the click.
                    for (var i = 0; i < self.options.regions.length; i++) {

                        // Get the ith control.
                        var regionIth = self.options.regions[i];
                        if (!regionIth) {

                            continue;
                        }

                        // Ask it to handle the click.
                        regionIth.click(e);
                    }
       
                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Invoked when the mouse is moved over the canvas.
            // Implemented to pass on to managed regions.
            self.onMouseMove = function (e) {

                try {

                    // Drop out if create is not complete.
                    if (!self.options.created) {
       
                        return null;
                    }
       
                    // Loop over children and ask them to handle the mouse move.
                    for (var i = 0; i < self.options.regions.length; i++) {
       
                        // Get the ith control.
                        var regionIth = self.options.regions[i];
                        if (!regionIth) {
       
                            continue;
                        }
       
                        // Ask it to handle the mouse move.
                        var strCursor = regionIth.mouseMove(e);
                        if (strCursor) {

                            return strCursor;
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };
       
            // Event handler method.
            // Implemented to pass on to managed regions.
            self.onMouseDown = function (e) {

                try {

                    // Drop out if create is not complete.
                    if (!self.options.created) {
       
                        return null;
                    }
       
                    // Loop over children and ask them to handle the mouse move.
                    for (var i = 0; i < self.options.regions.length; i++) {
       
                        // Get the ith control.
                        var regionIth = self.options.regions[i];
                        if (!regionIth) {
       
                            continue;
                        }
       
                        // Ask it to handle the mouse move.
                        var exceptionRet = regionIth.mouseDown(e);
                        if (exceptionRet !== null) {

                            return exceptionRet;
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };
       
            // Event handler method.
            // Implemented to pass on to managed regions.
            self.onMouseUp = function (e) {

                try {

                    // Drop out if create is not complete.
                    if (!self.options.created) {
       
                        return null;
                    }
       
                    // Loop over children and ask them to handle the mouse move.
                    for (var i = 0; i < self.options.regions.length; i++) {
       
                        // Get the ith control.
                        var regionIth = self.options.regions[i];
                        if (!regionIth) {
       
                            continue;
                        }
       
                        // Ask it to handle the mouse move.
                        var exceptionRet = regionIth.mouseUp(e);
                        if (exceptionRet !== null) {

                            return exceptionRet;
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Event handler method.
            // Implemented to pass on to managed regions.
            self.onMouseOut = function (e) {

                try {

                    // Drop out if create is not complete.
                    if (!self.options.created) {
       
                        return null;
                    }
       
                    // Loop over children.
                    for (var i = 0; i < self.options.regions.length; i++) {
       
                        // Get the ith control.
                        var regionIth = self.options.regions[i];
                        if (!regionIth) {
       
                            continue;
                        }
       
                        // Clear the "capture" state.
                        regionIth.options.clickedDownInThisRegion = false;
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Event handler method.
            // Implemented to pass on to managed regions.
            self.onKeyPress = function (e) {

                try {

                    // Drop out if create is not complete.
                    if (!self.options.created) {
       
                        return null;
                    }
       
                    // Loop over children and ask them to handle the mouse move.
                    for (var i = 0; i < self.options.regions.length; i++) {
       
                        // Get the ith control.
                        var regionIth = self.options.regions[i];
                        if (!regionIth) {
       
                            continue;
                        }
       
                        // Ask it to handle the mouse move.
                        var exceptionRet = regionIth.keyPress(e);
                        if (exceptionRet !== null) {

                            return exceptionRet;
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Event handler method.
            // Implemented to pass on to managed regions.
            self.onKeyUp = function (e) {

                try {

                    // Drop out if create is not complete.
                    if (!self.options.created) {
       
                        return null;
                    }
       
                    // Loop over children and ask them to handle the mouse move.
                    for (var i = 0; i < self.options.regions.length; i++) {
       
                        // Get the ith control.
                        var regionIth = self.options.regions[i];
                        if (!regionIth) {
       
                            continue;
                        }
       
                        // Ask it to handle the mouse move.
                        var exceptionRet = regionIth.keyUp(e);
                        if (exceptionRet !== null) {

                            return exceptionRet;
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Event handler method.
            // Implemented to pass on to managed regions.
            self.onKeyDown = function (e) {

                try {

                    // Drop out if create is not complete.
                    if (!self.options.created) {
       
                        return null;
                    }
       
                    // Loop over children and ask them to handle the mouse move.
                    for (var i = 0; i < self.options.regions.length; i++) {
       
                        // Get the ith control.
                        var regionIth = self.options.regions[i];
                        if (!regionIth) {
       
                            continue;
                        }
       
                        // Ask it to handle the mouse move.
                        var exceptionRet = regionIth.keyDown(e);
                        if (exceptionRet !== null) {

                            return exceptionRet;
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Protected methods.

            // Invoked when the canvas is resized.
            self.innerCalculateLayout = function (dNewWidth) {

                try {

                    // Drop out if create is not complete.
                    if (!self.options.created) {
       
                        return null;
                    }

                    // Loop over children and move if position mode is "center" or "right".
                    for (var i = 0; i < self.options.regions.length; i++) {

                        // Get the ith control.
                        var regionIth = self.options.regions[i];
                        if (!regionIth) {

                            continue;
                        }

                        // If the region has a positionMethod, then use that to calculate the position.
                        if ($.isFunction(regionIth.options.positionMethod)) {
       
                            regionIth.options.positionMethod.call(regionIth,
                                dNewWidth);
                        } else {
       
                            // Position mode is second.
                            if (regionIth.options.positionMode === "center") {

                                // Figure out where it should go.
                                // E.g. what should be the left.
                                regionIth.options.left = (dNewWidth - regionIth.options.width) / 2;
                            } else if (regionIth.options.positionMode === "right") {

                                // Figure out where it should go.
                                // E.g. what should be the left.
                                regionIth.options.left = dNewWidth - regionIth.options.width - regionIth.options.right;
                            }
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };
       
            // Define virtual stub for just-pre-creation function.
            self.innerCreate = function () {
       
                try {
       
                    return null;
                } catch (e) {
       
                    return e;
                }
            }

            ////////////////////////////
            // Protected fields.

            // Options configuration object.
            self.options = {

                created: false,         // Indicates that create completed successfully.
                wizard: null,           // Wizard manager for this object.
                context: null,          // Rendering context set by manager.
                configuration: null,    // The region configuration.
                regions: [],            // Collection of regions.
                activeRegion: null      // Current active region.
            };

            // Allow constructor parameters to override default settings.
            self.options.inject(optionsOverride);
        };

        // Return constructor function.
        return functionRet;
    });
