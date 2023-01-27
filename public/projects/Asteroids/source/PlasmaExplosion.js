////////////////////////////////////////
// PlasmaExplosion is a bomb animation particle system.
//
// Returns function constructor.

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js",
    "/MithrilLib/three/VisualObjectBase.js"],
    function (THREE,
        VisualObjectBase) {

        // Define laser cannon constructor function.
        var functionPlasmaExplosion = function PlasmaExplosion(objectVisualParent,
            numberOfParticles) {

            var self = this;            // Uber closure.

            // Inherit from base class.
            self.inherits(VisualObjectBase);

            ////////////////////////////
            // Public fields.

            // The texture to show for each particle.
            self.textureURL = "/media/burst.png";
            // The number of particles in the system.
            self.numberOfParticles = 128;
            // Size of each texture in world coordinates.
            self.particleSize = 500;
            // Size of entire system.
            self.systemSize = 300;
            // Nominal lifetime of particle in MS.
            self.baseDuration = 100;
            // Options lifetime of particle in MS.
            self.optionalDuration = 400;
            // Define the set of colors for the verticies.
            self.hueStart = 0.0;
            self.hueRange = 0.1;
            self.saturationStart = 0.95;
            self.saturationRange = 0.05;

            // The particles.
            self.particles = [];

            ////////////////////////////
            // Public methods.

            // Called to stop and clean up.
            self.destroy = function (objectVisualParent) {

                try {

                    // Just remove from renderer.
                    objectVisualParent.remove(self.mesh);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Update the engine.
            self.update = function (context) {

                try {

                    // Multiply movement by time slice.
                    var dDelta = context.delta;

                    // Get now.
                    var iNowMS = (new Date()).getTime();

                    // Process each particle.
                    for (var i = 0; i < self.particles.length; i++) {

                        // Get the ith particle.
                        var particleIth = self.particles[i];
                        if (!particleIth) {

                            continue;
                        }

                        // Test the age of the particle.
                        if (particleIth.expiration > iNowMS) {

                            // Calculate time percent.
                            var dPercent = ((iNowMS - particleIth.nowMS) / particleIth.duration);

                            var dMultiplier = self.systemSize * dPercent;

                            // Update position.
                            particleIth.position.x = dMultiplier * Math.sin(particleIth.theta) * Math.cos(particleIth.phi);
                            particleIth.position.y = dMultiplier * Math.sin(particleIth.theta) * Math.sin(particleIth.phi);
                            particleIth.position.z = dMultiplier * Math.cos(particleIth.theta);
                        } else {

                        }
                    }

                    self.material.size *= 0.9;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private methods.

            // Create the system.
            var m_functionGenerateParticles = function () {

                try {

                    // Create geometry which holds all boid positions.
                    self.geometry = new THREE.Geometry();

                    // The sprite texture, stolen from google images....
                    var texture = THREE.ImageUtils.loadTexture(self.textureURL);

                    // Get now.
                    var iNowMS = (new Date()).getTime();

                    // Define the collection which is mapped to the vertex colors.
                    var arrayColors = [];

                    // Create a whole bunch of particles add to geometry.
                    for (var i = 0; i < self.numberOfParticles; i++) {

                        // Create and store the color.
                        var color = new THREE.Color();
                        color.setHSV(self.hueStart + self.hueRange * Math.random(),
                            self.saturationStart + self.saturationRange * Math.random(),
                            1);
                        arrayColors[i] = color;

                        // Calculate lifetime for this particle.
                        var dDuration = self.baseDuration + Math.random() * self.optionalDuration;

                        // Place at origin.
                        var v3Position = new THREE.Vector3(0, 0, 0);

                        self.particles.push({

                            expiration: iNowMS + dDuration,
                            nowMS: iNowMS,
                            duration: dDuration,
                            color: color,
                            position: v3Position,
                            phi: 2 * Math.PI * Math.random(),
                            theta: Math.PI * Math.random()
                        });

                        // Add to geometry.
                        self.geometry.vertices.push(v3Position);
                    }

                    // Hook up the colors to the geometry.
                    self.geometry.colors = arrayColors;

                    // Allocate the material for the particles, 
                    // note: alpha-vertex colors are enabled.
                    self.material = new THREE.ParticleBasicMaterial({

                        size: self.particleSize,
                        map: texture,
                        vertexColors: true,
                        transparent: true
                    });

                    // Finally, create the particle system 
                    // with the built geometry and material.
                    self.mesh = new THREE.ParticleSystem(self.geometry,
                        self.material);
                    self.mesh.sortParticles = true;

                    // Lastly, add particles to visual parent.
                    objectVisualParent.add(self.mesh);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private fields.

            // Particle system geometry.
            var m_geometry = null;

            ////////////////////////////
            // Executor code.

            // Invoke the generate mesh function save output in accessible field.
            var exceptionRet = m_functionGenerateParticles();
            if (exceptionRet !== null) {

                alert(exceptionRet.message);
            }

        };

        // Do function injection.
        functionPlasmaExplosion.inheritsFrom(VisualObjectBase);

        // Return constructor function.
        return functionPlasmaExplosion;
    });