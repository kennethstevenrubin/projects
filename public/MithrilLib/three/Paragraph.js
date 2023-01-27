////////////////////////////////////////
// Paragraph object.  Used to quickly build 
// strings that would otherwise be time-
// consuming in generating the text mesh.
//
// Returns constructor function.
//
// o3dVisualParent              -- scene.
// strText                      -- The text to build into a paragraph.
// v3ParagraphPosition          -- The position of the paragraph in world space.
// v3ParagraphRotation          -- The rotation of the paragraph in world space.
// strParagraphAlignmentWidth   -- The alignment across the paragraph width: left, center, right.
// strParagraphAlignmentHeight  -- The alignment across the paragraph height: top, center, bottom.
// strParagraphAlignmentDepth   -- The alignment across the paragraph depth: front, center, back.
// v2Increment                  -- The amount by which letters and lines are separated.
// dXLimit                      -- The maximal x-displacement of the start of a word.

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js",
    "/MithrilLib/three/VisualObjectBase.js",
    "/MithrilLib/three/core/helvetiker.js",
    "/MithrilLib/three/TextGeometryCache.js"],
    function (THREE,
        VisualObjectBase,
        helvetiker,
        textGeometryCache) {

        // Define constructor function.
        var functionConstructor = function Paragraph(o3dVisualParent,
            strText,
            v3ParagraphPosition,
            v3ParagraphRotation,
            strParagraphAlignmentWidth,
            strParagraphAlignmentHeight,
            strParagraphAlignmentDepth,
            v2Increment,
            dXLimit) {

            var self = this;            // Uber closure.

            // Inherit from base class.
            self.inherits(VisualObjectBase);

            ////////////////////////////
            // Fix up "missing" input parameters.

            if (!strText) {

                strText = "The quick brown fox jumps over the lazy dog.";
            }
            if (!v3ParagraphPosition) {

                v3ParagraphPosition = new THREE.Vector3(0, 0, 0);
            }
            if (!v3ParagraphRotation) {

                v3ParagraphRotation = new THREE.Vector3(0, 0, 0);
            }
            if (!strParagraphAlignmentWidth) {

                strParagraphAlignmentWidth = "center";
            }
            if (!strParagraphAlignmentHeight) {

                strParagraphAlignmentHeight = "center";
            }
            if (!strParagraphAlignmentDepth) {

                strParagraphAlignmentDepth = "center";
            }
            if (!v2Increment) {

                v2Increment = new THREE.Vector2(1,
                    1.5);
            }
            if (!dXLimit) {

                dXLimit = 50;
            }

            ////////////////////////////
            // Public fields.

            // Bounding box.
            self.boundingBox = {

                min: new THREE.Vector3(Infinity, Infinity, Infinity),
                max: new THREE.Vector3(-Infinity, -Infinity, -Infinity),
            };

            ////////////////////////////
            // Public methods.

            self.destroy = function () {

                try {

                    o3dVisualParent.remove(self.mesh);
                } catch (e) {

                    return e;
                }
            };

            // Update paragraph.
            self.update = function (context) {

                try {

                    return null;
                } catch (e) {

                    return e;
                }
            };
       
            self.setOpacity = function (dOpacity) {
       
                m_state.material.opacity = dOpacity;
            };

            ////////////////////////////
            // Private methods.

            // Helper method builds up the specified paragraph.
            var m_functionBuildParagraph = function () {

                try {

                    m_state.material.transparent = true;
                    self.mesh = new THREE.Object3D();

                    // Add -3/4th of the line height to 
                    // seed the cursor position...but why?
                    var v2Cursor = new THREE.Vector3(0,
                        -3 * v2Increment.y / 4);    

                    // Loop over every character.
                    for (var i = 0; i < strText.length; i++) {

                        // Extract the ith character.
                        var charIth = strText[i];
                        if (charIth === undefined ||
                            charIth === null) {

                            continue;
                        }

                        // Space is special...just move over.
                        // Also check for out-of-bounds on 
                        // a new word separation boundary.
                        if (charIth === " ") {

                            if (v2Cursor.x == 0) {

                                // Probably the double-space at the 
                                // end of a sentence.  Just skip.
                                continue;
                            }

                            v2Cursor.x += v2Increment.x;
                            if (v2Cursor.x > dXLimit) {

                                v2Cursor.x = 0;
                                v2Cursor.y -= v2Increment.y;
                            }
                            continue;
                        }

                        // Get or create the geometry.
                        var geometry = null;
                        if (textGeometryCache.geometries[charIth] === undefined) {

                            // Must create a new geometry.
                            geometry = new THREE.TextGeometry(charIth, {

                                size: 1,
                                height: 1 / 4,
                                curveSegments: 20,
                                font: "helvetiker",
                                bevelEnabled: true,
                                bevelThickness: 1 / 20,
                                bevelSize: 1 / 20
                            });

                            // Set some helper values.
                            geometry.computeBoundingBox();
                            geometry.computeVertexNormals();

                            // Store for next need.
                            textGeometryCache.geometries[charIth] = geometry;
                        } else {

                            // Just extract stored value.
                            geometry = textGeometryCache.geometries[charIth];
                        }

                        // Adjust bounding box.
                        if (geometry.boundingBox.min.x + v2Cursor.x < self.boundingBox.min.x) {

                            self.boundingBox.min.x = geometry.boundingBox.min.x + v2Cursor.x;
                        }
                        if (geometry.boundingBox.max.x + v2Cursor.x > self.boundingBox.max.x) {

                            self.boundingBox.max.x = geometry.boundingBox.max.x + v2Cursor.x;
                        }
                        if (geometry.boundingBox.min.y + v2Cursor.y < self.boundingBox.min.y) {

                            self.boundingBox.min.y = geometry.boundingBox.min.y + v2Cursor.y;
                        }
                        if (geometry.boundingBox.max.y + v2Cursor.y > self.boundingBox.max.y) {

                            self.boundingBox.max.y = geometry.boundingBox.max.y + v2Cursor.y;
                        }
                        if (geometry.boundingBox.min.z < self.boundingBox.min.z) {

                            self.boundingBox.min.z = geometry.boundingBox.min.z;
                        }
                        if (geometry.boundingBox.max.z > self.boundingBox.max.z) {

                            self.boundingBox.max.z = geometry.boundingBox.max.z;
                        }

                        // Make the digit mesh.
                        var meshLetter = new THREE.Mesh(geometry,
                            m_state.material);
                        meshLetter.position = new THREE.Vector3(v2Cursor.x,
                            v2Cursor.y,
                            0);

                        // Add to container.
                        self.mesh.add(meshLetter);

                        // Move over for this letter.
                        v2Cursor.x += (geometry.boundingBox.max.x - geometry.boundingBox.min.x + v2Increment.x / 10);
                    }

                    var v3Extent = new THREE.Vector3(self.boundingBox.max.x - self.boundingBox.min.x,
                        self.boundingBox.max.y - self.boundingBox.min.y,
                        self.boundingBox.max.z - self.boundingBox.min.z);

                    /* Comment in to add wireframe bounding box.
                    var geometryBoundingBox = new THREE.CubeGeometry(v3Extent.x,
                        v3Extent.y,
                        v3Extent.z);
                    var materialBoundingBox = new THREE.MeshNormalMaterial({

                        wireframe: true
                    });
                    var meshBoundingBox = new THREE.Mesh(geometryBoundingBox,
                        materialBoundingBox);
                    meshBoundingBox.position = new THREE.Vector3(v3Extent.x / 2,
                        -v3Extent.y / 2,
                        v3Extent.z / 2);
                    self.mesh.add(meshBoundingBox);
                    */

                    // Calculate alignment offsets.
                    var dWidthOffset = 0;
                    var dHeightOffset = 0;
                    var dDepthOffset = 0;
                    if (strParagraphAlignmentWidth === "center") {

                        dWidthOffset = -0.5 * v3Extent.x;
                    } else if (strParagraphAlignmentWidth === "right") {

                        dWidthOffset = -1 * v3Extent.x;
                    }
                    if (strParagraphAlignmentHeight === "center") {

                        dHeightOffset = -0.5 * v3Extent.y;
                    } else if (strParagraphAlignmentHeight === "bottom") {

                        dHeightOffset = -1 * v3Extent.y;
                    }
                    if (strParagraphAlignmentDepth === "center") {

                        dDepthOffset = -0.5 * v3Extent.z;
                    } else if (strParagraphAlignmentDepth === "front") {

                        dDepthOffset = -1 * v3Extent.z;
                    }

                    // Also position in world space.
                    for (var i = 0; i < self.mesh.children.length; i++) {

                        // Get the ith mesh.
                        var meshIth = self.mesh.children[i];
                        if (!meshIth) {

                            continue;
                        }
                        meshIth.translateX(dWidthOffset);
                        meshIth.translateY(-dHeightOffset);
                        meshIth.translateZ(dDepthOffset);
                    }

                    // Rotate in world space.
                    self.mesh.position = new THREE.Vector3(v3ParagraphPosition.x,
                        v3ParagraphPosition.y,
                        v3ParagraphPosition.z);
                    self.mesh.rotation = new THREE.Vector3(v3ParagraphRotation.x,
                        v3ParagraphRotation.y,
                        v3ParagraphRotation.z);

                    // Add to visual parent.
                    if (o3dVisualParent) {

                        o3dVisualParent.add(self.mesh);
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private fields.

            // Holds state for main object.
            var m_state = {

                material: new THREE.MeshNormalMaterial()    // Define one material up front.
            };

            ////////////////////////////
            // Post-definition code invocation.

            // Invoke the buildstring method.
            var exceptionRet = m_functionBuildParagraph();
            if (exceptionRet !== null) {

                throw exceptionRet;
            }
        };

        // Do function injection.
        functionConstructor.inheritsFrom(VisualObjectBase);

        // Return constructor function.
        return functionConstructor;
    });
