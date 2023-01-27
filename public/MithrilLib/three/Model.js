////////////////////////////////////////
// 3D Model.
//
// Returns function constructor.
//

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js",
    "/MithrilLib/three/VisualObjectBase.js"],
    function (THREE,
        VisualObjectBase) {

        // Define Model constructor function.
        var functionConstructor = function Model(objectVisualParent,
            strApplication,
            strModelFileName,
            strModelTexture,
            callbackLoaded) {

            var self = this;            // Uber closure.

            // Inherit from base class.
            self.inherits(VisualObjectBase);

            ////////////////////////////
            // Public methods.

            self.destroy = function () {

                try {

                    objectVisualParent.remove(self.mesh);
                } catch (e) {

                    return e;
                }
            };

            // Set the 
            self.setGeometryTranslationMatrix = function (m4GeometryTranslation) {

                try {

                    // Update geometry.
                    if (self.geometry !== null) {

                        self.geometry.applyMatrix(m4GeometryTranslation);
                    } else {

                        m_m4CacheGeometryTranslation = m4GeometryTranslation;
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method gets the position of the mesh.
            self.getPosition = function () {

                return self.mesh.position;
            };

            // Method sets the position of the mesh.
            self.setPosition = function (v3Position) {

                try {

                    // Update mesh.
                    if (self.mesh !== null) {

                        self.mesh.position = v3Position;
                    } else {

                        m_v3CachePosition = v3Position;
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method sets the rotation of the mesh.
            self.setRotation = function (v3Rotation) {

                try {

                    // Update mesh.
                    if (self.mesh !== null) {

                        self.mesh.rotation = v3Rotation;
                    } else {

                        m_v3CacheRotation = v3Rotation;
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method sets the scale of the mesh.
            self.setScale = function (v3Scale) {

                try {

                    // Update mesh.
                    if (self.mesh !== null) {

                        self.mesh.scale = v3Scale;
                    } else {

                        m_v3CacheScale = v3Scale;
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private methods.

            // Method called to generate text.
            var m_functionGenerateMesh = function () {

                try {

                    // Load up the model.
                    var loader = new THREE.JSONLoader();
                    loader.load("http://" +
                        window.location.host +
                        "/" + strApplication + strModelFileName,
                            function (geometry) {

                                self.geometry = geometry;
                                self.material = new THREE.MeshLambertMaterial({

                                    map: THREE.ImageUtils.loadTexture("http://" +
                                        window.location.host +
                                        "/media" + strModelTexture)
                                    });
                                self.mesh = new THREE.Mesh(self.geometry,
                                    self.material);
                                objectVisualParent.add(self.mesh);

                                if (m_v3CachePosition !== null) {

                                    self.mesh.position = m_v3CachePosition;
                                }
                                if (m_v3CacheRotation !== null) {

                                    self.mesh.rotation = m_v3CacheRotation;
                                }
                                if (m_v3CacheScale !== null) {

                                    self.mesh.scale = m_v3CacheScale;
                                }
                                if (m_m4CacheGeometryTranslation !== null) {

                                    self.geometry.applyMatrix(m_m4CacheGeometryTranslation);
                                }

                                if ($.isFunction(callbackLoaded)) {

                                    callbackLoaded();
                                }
                            });

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private fields.

            var m_v3CachePosition = null;
            var m_m4CacheGeometryTranslation = null;
            var m_v3CacheRotation = null;
            var m_v3CacheScale = null;

            ////////////////////////////
            // Executor code.

            // Invoke the generate mesh function save output in accessible field.
            var exceptionRet = m_functionGenerateMesh();
            if (exceptionRet !== null) {

                throw exceptionRet;
            }
        };

        // Do function injection.
        functionConstructor.inheritsFrom(VisualObjectBase);

        // Return constructor function.
        return functionConstructor;
    });
