////////////////////////////////////////
// Laser is a particle system that simulates a laser.
//
// Returns function constructor.

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js"],
    function (THREE) {

        // Define Laser constructor function.
        var functionLaser = function Laser(objectVisualParent) {

            var self = this;            // Uber closure.

            ////////////////////////////
            // Public fields.

            self.geometries = [];
            self.materials = [];
            self.meshes = [];

            self.radius = 1;
            self.detail = 0;

            ////////////////////////////
            // Public methods.

            // Update the engine.
            self.update = function (context) {

                try {

                    // Multiply movement by time slice.
                    var dDelta = context.delta;

                    if (self.meshes.length > 0) {

                        self.meshes[0].rotation = new THREE.Vector3(0,
                            context.elapsed * 2,
                            0);
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private methods.

            // Method called to generate and return a laser.
            var m_functionGenerateParticles = function () {

                try {

                    var geometry = new THREE.TetrahedronGeometry(self.radius, self.detail);
                    geometry.applyMatrix(new THREE.Matrix4().translate(new THREE.Vector3(0,
                        self.beamLength / 2,
                        0)));
                    var material = new THREE.MeshLambertMaterial({

                        emissive: new THREE.Color(0x888888),
                        color: new THREE.Color(0xffff00)
                    });
                    var mesh = new THREE.Mesh(geometry,
                        material);

                    objectVisualParent.add(mesh);

                    self.geometries.push(geometry);
                    self.materials.push(material);
                    self.meshes.push(mesh);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Executor code.

            // Invoke the generate mesh function save output in accessible field.
            var exceptionRet = m_functionGenerateParticles();
            if (exceptionRet !== null) {

                alert(exceptionRet.message);
            }
        };

        // Return constructor function.
        return functionLaser;
    });