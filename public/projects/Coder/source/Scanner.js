//////////////////////////////////
// Scans Blockly for changes and write out to designer surface.
//
// Return constructor function.
//

"use strict";

// Define module.
define(["converter", "processor"],
    function (converter, processor) {

        // Define constructor function.
        var functionRet = function Scanner() {

            var self = this;

            ///////////////////////////
            // Public methods

            // Attach Blockly scanner.
            self.create = function () {

                try {

                    // Listen in on changes to process primary chain.
                    Blockly.mainWorkspace.addChangeListener(function () {

                    	try {

                    		// 
                    		var exceptionRet = m_functionOnChange();
                    		if (exceptionRet) {

                    			throw exceptionRet;
                    		}
                    	} catch (e) {

                    		alert(e.message);
                    	}
                    });

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ///////////////////////////
            // Private methods.

            // .
            var m_functionOnChange = function () {

            	try {

                    // .
                    var objectWorkspace = processor.getWorkspaceJSONObject();
                    if (!objectWorkspace) {

                        throw { messgage: "Failed to get the workspace object." };
                    }

                    // Get the block with which to work.
                    var objectPrimaryBlockChain = processor.getPrimaryBlockChain(objectWorkspace);

            		// Clear designer.
            		var objectResult = {};

            		// Scan.
	                var objectCursor = objectPrimaryBlockChain;
	                if (objectCursor) {

	    	            do {

		            		//	Look for "new_" and "set_".
		            		//	Set in designer.
		            		var arrayMatches = objectCursor.type.match(/App_set(.+?)Instance/);
		            		if (arrayMatches &&
		            			arrayMatches.length > 1) {

		            			objectResult[arrayMatches[1]] = {};
		            		} else {

			            		if (objectCursor.type.match(/_setX/)) {

			            			// Get the thing to set.
			            			var objectToSet = objectCursor.children[0].children[0];
			            			var strTypeToSet = objectToSet.type;
			            			var arrayTypes = strTypeToSet.match(/App_get(.+?)Instance/);
			            			var strTheType = arrayTypes[1];

			            			var objectValue = objectCursor.children[1].children[0].children[0];
			            			var strValue = objectValue.contents;

			            			objectResult[strTheType]["X"] = strValue;
			            		}
		            		}

	        	            objectCursor = objectCursor.next
	            	    } while (objectCursor)
	            	}

	            	document.title = JSON.stringify(objectResult);

            		return null;
            	} catch (e) {

            		return e;
            	}
            };

            ////////////////////////
            // Private fields.
        };

        // Return instance.
        return functionRet;
    });
