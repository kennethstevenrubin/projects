/////////////////////////////
// Processor - processes Blockly workspaces.
//
// Return object instance.
//

"use strict";

// Define module.
define(["converter"],
    function (converter) {

        // Define constructor function.
        var functionRet = function Processor() {

            var self = this;

            ///////////////////////////
            // Public methods

            // Method returns the blockly workspace as a JSON object.
            self.getWorkspaceJSONObject = function () {

                // Get the workspace from blockly.
                var objectWorkspaceDOM = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
                if (!objectWorkspaceDOM) {

                    throw new Error("Failed to extract workspace DOM from Blockly.");
                }

                // Convert to Xml string.
                var strWorkspaceXml = Blockly.Xml.domToText(objectWorkspaceDOM);
                if (!strWorkspaceXml) {

                    throw new Error("Failed to convet workspace DOM to XML.");
                }

                // Convert xml to json.
                return converter.toJSON(strWorkspaceXml);
            };

            // Method returns the block with which to work given the workspace JSON object.
            self.getWorkBlock = function (objectJSON) {

                // Get just the primary block chain.
                var objectPrimaryBlockChain = self.getPrimaryBlockChain(objectJSON);
                if (!objectPrimaryBlockChain) {

                    return null;
                }

                // Get the last block.
                return self.getLastBlock(objectPrimaryBlockChain);
            };

            // Extract the last block from the primary block chain.
            self.getLastBlock = function (objectPrimaryBlockChain) {

                // Just return if null.
                if (!objectPrimaryBlockChain) {

                    return null;
                }

                // Get the last next.
                var objectCursor = objectPrimaryBlockChain;
                while (objectCursor.next) {

                    objectCursor = objectCursor.next
                }

                // Return it.
                return objectCursor;
            }

            // Extract the primary block chain from the JSON object.
            self.getPrimaryBlockChain = function (objectJSON) {

                // Do something to scan the object for the primary block chain:

                // Are there no chains at all?  (Return an empty, non-null statement-chain.)

                // Is there just one chain?

                // No?, then get the list of chains that only contain 
                // commands for adding objects and setting property values.

                if (!objectJSON.children ||
                    !objectJSON.children.length) {

                    return null;
                }

                // Take the first one that is not a variables_get.
                for (var i = 0; i < objectJSON.children.length; i++) {

                    var block = objectJSON.children[i];
                    if (block.type !== "variables_get") {

                        return block;
                    }
                }
                return null;
            };
        };

        // Return instance.
        return new functionRet();
    });
