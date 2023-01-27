// Plumvo Plan Wizard

"use strict";

define([],
		function () {
	
	// Define the constructor function.
	var functionConstructor = function Wizard(optionsOverride) {
		
		var self = this;					// Uber-closure.

		// Public method create the wizard.
		self.create = function () {
			
			try {
				
	            // Get the parent references.
	            m_jqParent = $(m_options.host.selector);
	            if (m_jqParent.length === 0) {
	
	                throw { message: "Failed to select parent element." };
	            }
	            
	            // Create the render canvas.
	            m_canvasRender = document.createElement("canvas");
	            m_canvasRender.id = "Render";
	            m_contextRender = m_canvasRender.getContext("2d");
	            m_jqParent.append(m_canvasRender);
	            m_jqCanvas = $(m_canvasRender);
	
	            // Hook the resize to update the size of the dashboard when the browser is resized.
	            $(window).bind("resize",
	                m_functionWindowResize);
	
	            // Call prime render.
	            return m_functionRender();
			} catch (e) {
				
				return e;
			} finally {

                // Cause a resize to get all parts lined up.
                setTimeout(m_functionWindowResize,
                    50);				
			}
		};
		
        // Destroy object.
        self.destroy = function () {

            try {

                // Un-hook the resize to update the size of the dashboard when the browser is resized.
                $(window).unbind("resize",
                    m_functionWindowResize);

                return null;
            } catch (e) {

                return e;
            }
        };

        ////////////////////////////////////////////
        // Private event handlers.

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
                var dWidth = m_jqParent.width();
                if (dWidth === undefined || dWidth === 0) {

                	dWidth = 800;
                }

                // The required height of the control is the sum of all the sections heights.
                var dTotal = 800;

                // Resize the parent element height.
                m_jqParent.height(dTotal);

                // Update canvas sizes.
                m_canvasRender.width = dWidth;
                m_canvasRender.height = dTotal;
                self.width = dWidth;
                self.height = dTotal;

                // These pipes are clean.
                m_bDirty = false;

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

				m_contextRender.fillStyle = "blue"; 
				m_contextRender.fillRect(0,0,100,100);
				
				return null;
			} catch (e) {
				
				return e;
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
        // Define the dirty state.
        var m_bDirty = true;

        // Options configuration.
        var m_options = {

            host: {

                selector: "#Host"           // The host selector.
            }
        };

        // Allow constructor parameters to override default settings.
        m_options.inject(optionsOverride);

	};
	
	// Return the constructor function.
	return functionConstructor;
});