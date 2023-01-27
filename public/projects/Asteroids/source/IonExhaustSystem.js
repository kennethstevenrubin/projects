////////////////////////////////////////
// IonExhaustSystem is a particle system that simulates flocking behavior.
// Returns function constructor.

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js"],
    function (THREE) {

        // Define IonExhaustSystem constructor function.
        var functionIonExhaustSystem = function IonExhaustSystem(objectVisualParent,
            strTextureURL) {

            var self = this;            // Uber closure.

            ////////////////////////////
            // Public fields.

            // The particle system.
            self.particles = null;
            // The geometry.
            self.geometry = null;
            // The material.
            self.material = null;
            // The partcle collection.
            self.IonExhaustSystem = [];

            self.theta = 0;
            self.phi = Math.PI;
            self.position = new THREE.Vector3(0, 0, 0);

            // Speed.
            self.velocity = 8;
            // Time to live.
            self.lifeSeconds = 1;
            // Radius of particle origin.
            self.particleSize = 12;
            // Radius of particle origin.
            self.worldRadius = 0.4;
            // Number of particles.
            self.numberOfIons = 1024;
            // The texture.
            self.textureURL = strTextureURL || "/media/i2.png";

            ////////////////////////////
            // Public methods.

            // Update the engine.
            self.update = function (context) {

                try {

                    // Multiply movement by time slice.
                    var dDelta = context.delta;
                    var dTime = (new Date()).getTime();

                    //new THREE.Matrix4().makeTranslation(self.position)
                    self.particles.matrix = new THREE.Matrix4().makeRotationY(self.theta).multiply(new THREE.Matrix4().makeRotationZ(self.phi));
                    self.particles.rotation.setEulerFromRotationMatrix(self.particles.matrix);
                    self.particles.position = self.position;

                    // Update position of ions.
                    for (var i = 0; i < self.IonExhaustSystem.length; i++) {

                        // Get next ion.
                        var ionIth = self.IonExhaustSystem[i];

                        // Regenerate, if time's up.
                        if (dTime > ionIth.expiration) {

                            var dTheta = Math.PI * 2 * Math.random();
                            var dRadius = self.worldRadius * Math.random();

                            ionIth.position.x = dRadius * Math.sin(dTheta);
                            ionIth.position.y = 0;
                            ionIth.position.z = dRadius * Math.cos(dTheta);
                            ionIth.velocity = new THREE.Vector3(ionIth.position.x / 10,
                                self.velocity * (self.worldRadius - dRadius) * Math.random(),
                                ionIth.position.z / 10);
                            ionIth.expiration = dTime + self.lifeSeconds * 1000 * Math.random();

                            continue;
                        }

                        // Get its velocity.
                        var v3Velocity = new THREE.Vector3(ionIth.velocity.x,
                            ionIth.velocity.y,
                            ionIth.velocity.z);

                        // Scale down the velocity to a speed per second factor.
                        v3Velocity.multiplyScalar(dDelta);

                        // Update the position by the scaled velocity.
                        ionIth.position.add(v3Velocity);
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private methods.

            // Method called to generate and return a landscape mesh.
            var m_functionGenerateParticles = function () {

                try {

                    // Create geometry which holds all boid positions.
                    self.geometry = new THREE.Geometry();

                    // The sprite texture, stolen from google images....
                    var textureSprite = THREE.ImageUtils.loadTexture(self.textureURL);

                    // Create a whole bunch of ions add to geometry.
                    var arrayColors = [];
                    for (var i = 0; i < self.numberOfIons; i++) {

                        // Place randomly in 3-space in the unit cube.
                        var vertex = new THREE.Vector3();
                        var dTheta = Math.PI * 2 * Math.random();
                        var dRadius = self.worldRadius * Math.random();
                        vertex.x = dRadius * Math.sin(dTheta);
                        vertex.y = 0;
                        vertex.z = dRadius * Math.cos(dTheta);

                        self.IonExhaustSystem.push({

                            position: vertex,
                            velocity: new THREE.Vector3(0,
                                Math.random(),
                                0),
                            expiration: 0
                        });

                        arrayColors[i] = new THREE.Color(0x000000);
                        arrayColors[i].setHSV(3 * Math.random() / 10,
                            1,
                            1);

                        // Add to geometry.
                        self.geometry.vertices.push(vertex);
                    }

                    // Hook up the colors to the geometry.
                    self.geometry.colors = arrayColors;

                    // Allocate the material for the particles, 
                    // note: alpha-vertex colors are enabled.
                    self.material = new THREE.ParticleBasicMaterial({

                        size: self.particleSize,
                        map: textureSprite,
                        vertexColors: true,
                        transparent: true
                    });

                    // Finally, create the particle system 
                    // with the built geometry and material.
                    self.particles = new THREE.ParticleSystem(self.geometry,
                        self.material);
                    self.particles.sortParticles = true;

                    // Lastly, add particles to visual parent.
                    objectVisualParent.add(self.particles);

                    self.particles.matrix = new THREE.Matrix4().makeRotationY(self.theta).multiply(new THREE.Matrix4().makeRotationZ(self.phi));
                    if (!self.particles.rotation) {

                        self.particles.rotation = new THREE.Vector3(0, 1, 0);
                    }
                    self.particles.rotation.setEulerFromRotationMatrix(self.particles.matrix);
                    self.particles.position = self.position;

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
        return functionIonExhaustSystem;
    });