////////////////////////////////////////
// Three-dee text.
//
// Returns function constructor.
//
// objectVisualParent - The visual parent of the mesh.  May be null.
// strText - The text to use to build the mesh.
// iCurveSegments - Number of segments used to generate curves.  [2..40].
// strLineAlignment - Positions horizontal origin point.  [left, center, right].
// strBaselineAlignment - Positions vertical origin point.  [top, center, bottom].
// strDepthAlignment - Positions depth origin point.  [front, center, back].

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js",
    "/MithrilLib/three/core/helvetiker.js"],
    function (THREE,
        helvetiker) {

        // Define Text constructor function.
        var functionText = function Text(objectVisualParent,
            strText,
            iCurveSegments,
            strLineAlignment,
            strBaselineAlignment,
            strDepthAlignment,
            bBevel) {

            var self = this;            // Uber closure.

            ////////////////////////////
            // Public fields.

            // The text mesh--exposed for manipulation.
            self.mesh = null;
            // The text geometry--exposed for manipulation.
            self.geometry = null;

            ////////////////////////////
            // Public methods.

            // Method sets the position of the mesh.
            self.setPosition = function (v3Position) {

                try {

                    // Update mesh.
                    self.mesh.position = v3Position;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method sets the rotation of the mesh.
            self.setRotation = function (v3Rotation) {

                try {

                    // Update mesh.
                    self.mesh.rotation = v3Rotation;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method sets the scale of the mesh.
            self.setScale = function (v3Scale) {

                try {

                    // Update mesh.
                    self.mesh.scale = v3Scale;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private methods.

            // Method called to generate text.
            var m_functionGenerateTextMesh = function () {

                try {

                    // Generate text geometry.
                    self.geometry = new THREE.TextGeometry(strText, {

                        size: m_dCharacterSize,
                        height: m_dCharacterSize / 4,
                        curveSegments: iCurveSegments,
                        font: "helvetiker",
                        bevelEnabled: bBevel || true,
                        bevelThickness: m_dCharacterSize / 20,
                        bevelSize: m_dCharacterSize / 20
                    });

                    // Set some helper values.
                    self.geometry.computeBoundingBox();
                    self.geometry.computeVertexNormals();

                    // Compute the horizontal and vertical offsets.
                    var dHorizontalExtent = (self.geometry.boundingBox.max.x - self.geometry.boundingBox.min.x);
                    var dVerticalExtent = (self.geometry.boundingBox.max.y - self.geometry.boundingBox.min.y);
                    var dDepthExtent = (self.geometry.boundingBox.max.z - self.geometry.boundingBox.min.z);
                    var dHorizontalOffset = 0;
                    var dVerticalOffset = 0;
                    var dDepthOffset = 0;
                    if (strLineAlignment === "center") {

                        dHorizontalOffset = -0.5 * dHorizontalExtent
                    } else if (strLineAlignment === "right") {

                        dHorizontalOffset = -1 * dHorizontalExtent
                    }
                    if (strBaselineAlignment === "center") {

                        dVerticalOffset = -0.5 * dVerticalExtent
                    } else if (strBaselineAlignment === "top") {

                        dVerticalOffset = -1 * dVerticalExtent
                    }
                    if (strDepthAlignment === "center") {

                        dDepthOffset = -0.5 * dDepthExtent
                    } else if (strDepthAlignment === "front") {

                        dDepthOffset = -1 * dDepthExtent
                    }

                    // Translate the geometry.
                    self.geometry.applyMatrix(new THREE.Matrix4().translate(new THREE.Vector3(dHorizontalOffset,
                        dVerticalOffset,
                        dDepthOffset)));

                    // Build the mesh from the geometry.
                    self.mesh = new THREE.Mesh(self.geometry,
                        new THREE.MeshNormalMaterial());

                    // Add to scene, if scene provided.
                    if (objectVisualParent !== null) {

                        objectVisualParent.add(self.mesh);
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private fields.

            // Size of a character.
            var m_dCharacterSize = 1;

            ////////////////////////////
            // Executor code.

            // Invoke the generate mesh function save output in accessible field.
            var exceptionRet = m_functionGenerateTextMesh();
            if (exceptionRet !== null) {

                throw exceptionRet;
            }
        };

        // Return constructor function.
        return functionText;
    });
