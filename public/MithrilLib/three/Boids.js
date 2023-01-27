////////////////////////////////////////
// Boids is a particle system that simulates flocking behavior.
// Returns function constructor.

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js",
    "/MithrilLib/three/VisualObjectBase.js"],
    function (THREE,
        VisualObjectBase) {

        // Define Boids constructor function.
        var functionConstructor = function Boids(objectVisualParent,
            strTextureURL,
            iNumberOfBoids,
            dParticleSize,
            dCOMScalarDividor,
            dAvoidScalarDivier,
            dVelocityScalarDividor,
            dCenterScalarDividor,
            dMaximumVelocity,
            dMinimumDistance,
            dWorldRadius) {

            var self = this;            // Uber closure.

            // Inherit from base class.
            self.inherits(VisualObjectBase);

            ////////////////////////////
            // Public fields.

            // The texture to show for each particle.
            self.textureURL = strTextureURL ||
                "/media/ball.png";
            // The number of boids.
            self.numberOfBoids = iNumberOfBoids || 32;
            // Size of each texture in world coordinates.
            self.particleSize = dParticleSize || 1;
            // The divider of the center of mass force.
            self.comScalarDivider = dCOMScalarDividor || 20;
            // The divider of the avoid force.
            self.avoidScalarDivider = dAvoidScalarDivier || 8;
            // The divider of the velocity force.
            self.velocityScalarDivider = dVelocityScalarDividor || 18;
            // The divider of the center world force.
            self.centerScalarDivider = dCenterScalarDividor || 512;
            // The maximum permitted velocity.
            self.maximumVelocity = dMaximumVelocity || 10;
            // The minimum distance betwixt any two boids.
            self.minimumDistance = dMinimumDistance || 1;
            // The extent of the world (for initialization).
            self.worldRadius = dWorldRadius || 20;

            // The particle system.
            self.particles = null;

            // The collection of boids.
            self.boids = [];

            ////////////////////////////
            // Public methods.

            // Update the Vane.
            self.update = function (context) {

                try {

                    // Multiply movement by time slice.
                    var dDelta = context.delta;

                    // Update velocities of a few, choosen boids.
                    for (var i = 0; i < self.boids.length; i++) {

                        // Get random boid.
                        var boid = self.boids[i];//Math.floor(Math.random() * self.boids.length)];

                        // Compute the following values:
                        var v3CenterOfMass = new THREE.Vector3();
                        var v3Avoid = new THREE.Vector3();
                        var v3Velocity = new THREE.Vector3();

                        // Loop over all boids.
                        for (var j = 0; j < self.boids.length; j++) {

                            // Get inner vertex.
                            var boidInner = self.boids[j];
                            if (boidInner === boid) {

                                continue;
                            }

                            v3CenterOfMass.add(boidInner.position);

                            var dDistance = boidInner.position.distanceTo(boid.position);
                            if (dDistance < self.minimumDistance) {

                                v3Avoid.sub(boidInner.position);
                                v3Avoid.add(boid.position);
                            }

                            v3Velocity.add(boidInner.velocity);
                        }

                        v3CenterOfMass.divideScalar(self.boids.length - 1);
                        v3CenterOfMass.sub(boid.position);
                        v3CenterOfMass.divideScalar(self.comScalarDivider);

                        v3Avoid.divideScalar(self.avoidScalarDivider);

                        v3Velocity.divideScalar(self.boids.length - 1);
                        v3Velocity.sub(boid.velocity);
                        v3Velocity.divideScalar(self.velocityScalarDivider);

                        var v3Center = new THREE.Vector3(0, 0, 0);
                        v3Center.sub(boid.position);
                        v3Center.divideScalar(self.centerScalarDivider);

                        // Update velocity.
                        boid.velocity.add(v3CenterOfMass);
                        boid.velocity.add(v3Avoid);
                        boid.velocity.add(v3Velocity);
                        boid.velocity.add(v3Center);

                        var dMagnitude = boid.velocity.length();
                        if (dMagnitude > self.maximumVelocity) {

                            boid.velocity.setLength(self.maximumVelocity);
                        }

                        var v3Velocity = new THREE.Vector3(boid.velocity.x,
                            boid.velocity.y,
                            boid.velocity.z);
                        v3Velocity.multiplyScalar(dDelta);

                        boid.position.add(v3Velocity);

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

                    // Create a whole bunch of particles add to geometry.
                    for (var i = 0; i < self.numberOfBoids; i++) {

                        // Place randomly in 3-space in the unit cube.
                        var vertex = new THREE.Vector3();
                        vertex.x = self.worldRadius * Math.random() - (self.worldRadius / 2);
                        vertex.y = self.worldRadius * Math.random() - (self.worldRadius / 2);
                        vertex.z = self.worldRadius * Math.random() - (self.worldRadius / 2);

                        self.boids.push({

                            position: vertex,
                            velocity: new THREE.Vector3(Math.random() * self.maximumVelocity - self.maximumVelocity / 2,
                                Math.random() * self.maximumVelocity - self.maximumVelocity / 2,
                                Math.random() * self.maximumVelocity - self.maximumVelocity / 2)
                        });

                        // Add to geometry.
                        self.geometry.vertices.push(vertex);
                    }

                    // Allocate the material for the particles, 
                    // note: alpha-vertex colors are enabled.
                    self.material = new THREE.ParticleBasicMaterial({

                        size: self.particleSize,
                        map: textureSprite,
                        vertexColors: false,
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
            // Executor code.

            // Invoke the generate mesh function save output in accessible field.
            var exceptionRet = m_functionGenerateParticles();
            if (exceptionRet !== null) {

                alert(exceptionRet.message);
            }
        };

        // Do function injection.
        functionConstructor.inheritsFrom(VisualObjectBase);

        // Return constructor function.
        return functionConstructor;
    });