////////////////////////////////////////
// LaserCannon is a bomb animation particle system.
//
// Returns function constructor.

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js"],
    function (THREE) {

        // Define laser cannon constructor function.
        var functionLaserCannon = function LaserCannon(objectVisualParent,
            strTextureURL,
            iNumberOfParticles,
            dParticleSize,
            dMaximumDurationMS,
            dPercentJumpers,
            dJumpMultiplier,
            dRadiusMultiplierStart,
            dRadiusMultiplierRange,
            dPercentRadiusMultiplierJumper,
            dRadiusMultiplierJumpMultiplier,
            dHueStart,
            dHueRange,
            dSaturationStart,
            dSaturationRange) {

            var self = this;            // Uber closure.

            ////////////////////////////
            // Public fields.

            // The texture to show for each particle.
            self.textureURL = strTextureURL ||
                "/media/t0.png";
            // The number of particles in the system.
            self.numberOfParticles = iNumberOfParticles || 128;
            // Size of each texture in world coordinates.
            self.particleSize = dParticleSize || 130;
            // Maximum nominal lifetime of particle in MS.
            self.maximumDurationMS = dMaximumDurationMS || 1000;
            // Percent of partciles which jump out.
            self.percentJumpers = dPercentJumpers || 5;
            self.percentJumpers /= 100;
            // Multiplier effecting radius of jumper.
            self.jumpMultiplier = dJumpMultiplier || 5;
            // The radius multipler ranges around 1 and is the distance of movement.
            self.radiusMultiplierStart = dRadiusMultiplierStart || 0.2;
            self.radiusMultiplierRange = dRadiusMultiplierRange || 0.6;
            // Percent of partciles which jump out.
            self.percentRadiusMultiplierJumper = dPercentRadiusMultiplierJumper || 5;
            self.percentRadiusMultiplierJumper /= 100;
            // Multiplier effecting the radius multiplier of jumper.
            self.radiusMultiplierJumpMultiplier = dRadiusMultiplierJumpMultiplier || 10;
            // Define the set of colors for the verticies.
            self.hueStart = dHueStart || 0.6;
            self.hueRange = dHueRange || 0.2;
            self.saturationStart = dSaturationStart || 0.45;
            self.saturationRange = dSaturationRange || 0.5;

            // The particles.
            self.particles = [];
            // The geometry.
            self.geometry = null;
            // The material.
            self.material = null;
            // The mesh, actually it's a particle system.
            self.mesh = null;

            ////////////////////////////
            // Public methods.

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
                        if (particleIth.expiration < iNowMS) {

                            // Re-generate.
                            var dDuration = self.maximumDurationMS * Math.random();
                            if (Math.random() < self.percentJumpers) {
                                dDuration *= self.jumpMultiplier;
                            }
                            particleIth.duration = dDuration;

                            particleIth.multiplier = self.radiusMultiplierStart + self.radiusMultiplierRange * Math.random();
                            if (Math.random() < self.percentRadiusMultiplierJumper) {

                                particleIth.multiplier *= self.radiusMultiplierJumpMultiplier;
                            }

                            particleIth.position.x = 0;
                            particleIth.position.y = 0;
                            particleIth.position.z = 0;

                            particleIth.nowMS = iNowMS;
                            particleIth.expiration = iNowMS + dDuration;
                        } else {

                            // Calculate time percent.
                            var dPercent = ((iNowMS - particleIth.nowMS) / particleIth.duration);

                            var dMultiplier = particleIth.multiplier * dPercent;

                            // Update position.
                            particleIth.position.x = dMultiplier * Math.sin(particleIth.theta) * Math.cos(particleIth.phi);
                            particleIth.position.y = dMultiplier * Math.sin(particleIth.theta) * Math.sin(particleIth.phi);
                            particleIth.position.z = dMultiplier * Math.cos(particleIth.theta);
                        }
                    }

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

                        // Place at origin.
                        var v3Position = new THREE.Vector3(0, 0, 0);

                        self.particles.push({

                            expiration: 0,
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

        // Return constructor function.
        return functionLaserCannon;
    });