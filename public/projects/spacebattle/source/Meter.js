////////////////////////////////////////
// Level meter component.
//
// Returns function constructor.

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js"],
    function (THREE) {

        // Define constructor function.
        var functionRet = function Meter(scene,
            v3Position,
            colorLevel,
            dInitialPercent,
            dRodRadius,
            dRodLength,
            dSphereRadius) {

            var self = this;            // Uber closure.

            ////////////////////////////
            // Public fields.

            // The landscape mesh.
            self.object = null;
            // The radii of the rods.
            self.rodRadius = dRodRadius || 0.1;
            // The length of the rods.
            self.rodLength = dRodLength || 10;
            // The radius of the sphere.
            self.sphereRadius = dSphereRadius || 0.8;

            ////////////////////////////
            // Public methods.

            // Update the turret.
            self.update = function (context,
                dPercent) {

                try {

                    // Set the percent of the level.
                    return m_functionSetLevel(dPercent);
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private methods.
       
            // Helper method sets the level mesh's position from the level percent.
            var m_functionSetLevel = function (dPercent) {
       
                try {

                    // Percent must be [0..1].
                    if (dPercent < 0) {
       
                        dPercent = 0;
                    } else if (dPercent > 1) {
       
                        dPercent = 1;
                    }
       
                    // Set it.
                    m_meshLevel.position.y = self.rodLength * dPercent - self.rodLength;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Method called to generate and return the object.
            var m_functionGenerateObject = function () {

                // Create the bounding cylinder.
                var geometry = new THREE.CylinderGeometry(self.rodRadius,
                    self.rodRadius,
                    self.rodLength,
                    10,
                    1,
                    false);
                geometry.applyMatrix(new THREE.Matrix4().translate(new THREE.Vector3(0, -self.rodLength / 2, 0)));
                var material = new THREE.MeshPhongMaterial({

                    color: 0x888888,
                    specular: 0xffffff,
                    ambient: 0x000022
                });
                var meshPost = new THREE.Mesh(geometry,
                    material);

                // Now create the level sphere.
                geometry = new THREE.SphereGeometry(self.sphereRadius,
                    10,
                    10);
                material = new THREE.MeshPhongMaterial({

                    color: colorLevel,
                    specular: 0xffffff,
                    ambient: 0x000022
                });
                m_meshLevel = new THREE.Mesh(geometry,
                    material);
       
                // Set the level of the level....
                var exceptionRet =  m_functionSetLevel(dInitialPercent);
                if (exceptionRet !== null) {
       
                    throw exceptionRet;
                }

                var objectRet = new THREE.Object3D();
                objectRet.add(meshPost);
                objectRet.add(m_meshLevel);

                // Return instance.
                return objectRet;
            };

            ////////////////////////////
            // Private fields.

            // The level sphere, isolated to its own field
            // so it can be independently manipulated.
            var m_meshLevel = null;

            // Invoke the generate object method save output in accessible field.
            self.object = m_functionGenerateObject();
       
            // Add to scene and position into place.
            self.object.position = v3Position;
            scene.add(self.object);
        };

        // Return constructor function.
        return functionRet;
    });