///////////////////////////////////////
// Block module.
//
// A linked list of Statement instances.
//

"use strict";

// AMD includes.
define(["./Statement"],
    function (Statement) {

        try {

            // Block constructor function.
        	var functionRet = function Block() {

                try {

            		var self = this;      // Uber closure.

                    /////////////////////////
                    // Public.

                    // Create instance.
            		self.create = function () {

            			try {

            				return null;
            			} catch (e) {

            				return e;
            			}
            		};

                    /////////////////////////
                    // Private.

                    // Indicates if the block is open or closed.
                    var m_bOpen = false;
                    // Collection of contained statements.
                    var m_arrayStatements = [];
                } catch (e) {

                    alert(e.message);
                }
        	};

            // Return Require module component.
        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
