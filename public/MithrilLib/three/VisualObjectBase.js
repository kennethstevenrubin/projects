////////////////////////////////////////
// VisualObjectBase is the base class for all visual objects.
//
// Returns function constructor.

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js"],
    function (THREE) {

        // Define constructor function.
        var functionConstructor = function Text() {

            var self = this;            // Uber closure.

            ////////////////////////////
            // Public fields.

            // The mesh--exposed for direct manipulation.
            self.mesh = null;
            // The geometry--exposed for direct manipulation.
            self.geometry = null;
            // The geometry--exposed for direct manipulation.
            self.Material = null;

            ////////////////////////////
            // Public methods.

            // Set the matrix that transforms (translates, 
            // rotates or scales) the underlying geometry.
            self.transformGeometry = function (m4Transformation) {

                try {

                    // Update geometry.
                    self.geometry.applyMatrix(m4Transformation);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method adds the specified visual object base 
            // instance as a child of this object instance.
            self.addChild = function (vobChild) {

                try {

                    // Add child to mesh.
                    self.mesh.add(vobChild);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method removes the specified visual object base 
            // instance as a child of this object instance.
            self.removeChild = function (vobChild) {

                try {

                    // Add child to mesh.
                    self.mesh.remove(vobChild);

                    return null;
                } catch (e) {

                    return e;
                }
            };

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

            // Method translates the position of the mesh along the X-axis.
            self.translateX = function (dMagnitude) {

                try {

                    // Update mesh.
                    self.mesh.translateX(dMagnitude);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method translates the position of the mesh along the Y-axis.
            self.translateY = function (dMagnitude) {

                try {

                    // Update mesh.
                    self.mesh.translateY(dMagnitude);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method translates the position of the mesh along the Z-axis.
            self.translateZ = function (dMagnitude) {

                try {

                    // Update mesh.
                    self.mesh.translateZ(dMagnitude);

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
        };

        // Return constructor function.
        return functionConstructor;
    });
