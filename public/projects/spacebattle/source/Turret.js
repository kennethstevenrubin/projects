////////////////////////////////////////
// Turret.
// Returns function constructor.

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js",
    "Explosion"],
    function (THREE,
        Explosion) {

        // Define Landscape constructor function.
        var functionTurret = function Turret(application,
            bComputer,
            dBarrelPitch,
            dBarrelYaw,
            dSphereRadius) {

            var self = this;            // Uber closure.

            ////////////////////////////
            // Public fields.

            // Indicates computer controlled.
            self.isComputer = bComputer || false;
            // Orientation of barrel.
            self.barrelPitch = dBarrelPitch || 0;
            self.barrelYaw = dBarrelYaw || 0;
            self.sphereRadius = dSphereRadius || 0.25;
            // The mesh.
            self.mesh = null;
            // Not dead yet!
            self.isDead = false;

            ////////////////////////////
            // Publix methods.

            self.removeAllProjectilesAndExplosions = function (context) {

                for (var i = 0; i < m_arrayProjectiles.length; i++) {

                    var meshIth = m_arrayProjectiles[i];
                    context.scene.remove(meshIth);
                }
                m_arrayProjectiles = [];
                
                for (var i = 0; i < m_arrayExplosions.length; i++) {

                    var explosionIth = m_arrayExplosions[i];
                    context.scene.remove(explosionIth.particles);
                }
                m_arrayExplosions = [];
            }

            // Update the turret.
            self.update = function (context) {

                try {

                    m_meshBarrel.rotation.z = self.barrelPitch;
                    m_meshBarrel.rotation.y = self.barrelYaw;
       
                    // Update all projectiles.
                    for (var i = 0; i < m_arrayProjectiles.length; i++) {
       
                        // Get the ith projectile.
                        var meshIth = m_arrayProjectiles[i];
                        var dElapsed = context.elapsed - meshIth.creationTime;
                        var dRadius = meshIth.initialRadius + meshIth.velocity * dElapsed;
       
                        meshIth.position.x = meshIth.initialX + dRadius * Math.sin(meshIth.yaw) * Math.sin(meshIth.pitch);
                        meshIth.position.y = meshIth.initialY + dRadius * Math.cos(meshIth.pitch) - dElapsed * dElapsed * 2;
                        meshIth.position.z = meshIth.initialZ + dRadius * Math.cos(meshIth.yaw) * Math.sin(meshIth.pitch);

                        // Check bounds.
                        if (meshIth.position.x < -application.world.x / 2 ||
                            meshIth.position.x > application.world.x / 2 ||
                            meshIth.position.z < -application.world.z / 2 ||
                            meshIth.position.z > application.world.z / 2) {
       
                            context.scene.remove(meshIth);
                            m_arrayProjectiles.splice(i, 1);
                            i--;
                            continue;
                        }
       
                        // Get the height of the perlin plane at the projectile.
                        var dHeight = application.heightFromPosition(meshIth.position);
       
                        // Check ground.
                        if (meshIth.position.y < dHeight) {

                            // Do some dammage.
                            if (self.isComputer) {

                                // Computer bomb against the human turret.

                                // Get Human Turret.
                                const humanTurret = application.getHumanTurret();
                                const humanTurretPosition = humanTurret.mesh.position;

                                const distanceFromBombToHuman = Math.sqrt(Math.pow(humanTurretPosition.x - meshIth.position.x, 2) + 
                                    Math.pow(humanTurretPosition.y - meshIth.position.y, 2) + 
                                    Math.pow(humanTurretPosition.z - meshIth.position.z, 2));

                                const distanceSquared = Math.pow(distanceFromBombToHuman, 2);
                                const force = 1 / distanceSquared;

                                application.addToShieldMeterLevel(force);

                                application.audioContainer.play("TerrainHit");
                            } else {

                                // Human bomb against the computer turrets.

                                // Get Computer Turrets.
                                const computerTurrets = application.getComputerTurrets();

                                computerTurrets.forEach((turret) => {

                                    const computerTurretPosition = turret.mesh.position;

                                    const distanceFromBombToComputer = Math.sqrt(Math.pow(computerTurretPosition.x - meshIth.position.x, 2) + 
                                        Math.pow(computerTurretPosition.y - meshIth.position.y, 2) + 
                                        Math.pow(computerTurretPosition.z - meshIth.position.z, 2));

                                    const distanceSquared = Math.pow(distanceFromBombToComputer, 2);
                                    const force = 1 / distanceSquared;

                                    if (!turret.dammage) {

                                        turret.dammage = 0;
                                    }
                                    turret.dammage += force;

                                    application.audioContainer.play("ComputerHit");

                                    if (turret.dammage > 1) {

                                        turret.isDead = true;
                                        turret.removeAllProjectilesAndExplosions(context);
                                        context.scene.remove(turret.mesh);
                                    }
                                });
                                
                                self.isDead
                            }                            
                            
                            var de = new Explosion(context,
                                meshIth.position);
                            m_arrayExplosions.push(de);

                            context.scene.remove(meshIth);
                            m_arrayProjectiles.splice(i, 1);
                            i--;
                            continue;
                        }
                    }

                    // Update explosions.
                    for (var i = 0; i < m_arrayExplosions.length; i++) {
       
                        var explosionIth = m_arrayExplosions[i];
       
                        var exceptionRet = explosionIth.update(context);
                        if (exceptionRet !== null) {
       
                            return exceptionRet;
                        }
       
                        if (explosionIth.dead) {

                            m_arrayExplosions.splice(i, 1);
                            i--;
                            continue;
                        }
                    }
                    return null;
                } catch (e) {

                    return e;
                }
            };
       
            // Fire off a projectile.  Onward towards battle!
            self.fire = function (context,
                dPower) {
       
                try {
       
                    // Now, create the bullet.
                    var geometry = new THREE.SphereGeometry(self.sphereRadius,
                        8,
                        8);
                    var material = new THREE.MeshPhongMaterial({

                        color: (self.isComputer ? 0xffff00 : 0xff00ff),
                        specular: 0xffffff,
                        ambient: 0xff5555
                    });
                    var meshSphere = new THREE.Mesh(geometry,
                        material);

                    var dRadius = 2.5;
                    var dCorrectedYaw = self.barrelYaw - Math.PI / 2;
                    var dPitch = self.barrelPitch;
                    meshSphere.position.x = self.mesh.position.x + dRadius * Math.sin(dCorrectedYaw) * Math.sin(dPitch);
                    meshSphere.position.y = self.mesh.position.y + dRadius * Math.cos(dPitch);
                    meshSphere.position.z = self.mesh.position.z + dRadius * Math.cos(dCorrectedYaw) * Math.sin(dPitch);

                    // Set mesh state fields.
                    meshSphere.initialRadius = dRadius;
                    meshSphere.yaw = dCorrectedYaw;
                    meshSphere.pitch = dPitch;
                    meshSphere.velocity = 10 + 5 * dPower;
                    meshSphere.creationTime = context.elapsed;
                    meshSphere.initialX = self.mesh.position.x;
                    meshSphere.initialY = self.mesh.position.y;
                    meshSphere.initialZ = self.mesh.position.z;

                    // Add to scene.
                    context.scene.add(meshSphere);

                    // Add projectile to collection.
                    m_arrayProjectiles.push(meshSphere);

                    return null;
                } catch (e) {
       
                    return e;
                }
            };

            ////////////////////////////
            // Private methods.

            // Method called to generate and return a landscape mesh.
            var m_functionGenerateMesh = function () {

                // Create base cylinder.
                var geometry = new THREE.CylinderGeometry(0.25,
                    0.25,
                    1,
                    40,
                    2,
                    false);
                geometry.applyMatrix(new THREE.Matrix4().translate(new THREE.Vector3(0, -0.5, 0)));
                var material = new THREE.MeshPhongMaterial({

                    color: (self.isComputer ? 0xffff88 : 0xff88ff),
                    specular: 0x000088,
                    ambient: 0x000022
                });
                var meshBase = new THREE.Mesh(geometry,
                    material);

                // Now, create the dome (a sphere) and add to the base mesh.
                geometry = new THREE.SphereGeometry(0.23,
                    40,
                    40);
                material = new THREE.MeshPhongMaterial({

                    color: (self.isComputer ? 0x88ffff : 0xffff88),
                    specular: 0x880000,
                    ambient: 0x000022
                });
                geometry.applyMatrix(new THREE.Matrix4().translate(new THREE.Vector3(0, 0, 0)));
                var meshSphere = new THREE.Mesh(geometry,
                    material);
                meshBase.add(meshSphere);

                // Now, create the barrel (a cylinder) and add to the base mesh.
                geometry = new THREE.CylinderGeometry(0.06,
                    0.1,
                    0.5,
                    20,
                    2,
                    false);
                geometry.applyMatrix(new THREE.Matrix4().translate(new THREE.Vector3(0, 0.25, 0)));
                material = new THREE.MeshPhongMaterial({

                    color: (self.isComputer ? 0xffff88 : 0xff88ff),
                    specular: 0x000088,
                    ambient: 0x000022
                });
                m_meshBarrel = new THREE.Mesh(geometry,
                    material);
                meshBase.add(m_meshBarrel);

                // Return instance.
                return meshBase;
            };

            ////////////////////////////
            // Private fields.

            // The mesh for the barrel that is rotated.
            var m_meshBarrel = null;
            // The array for the meshes of projectiles.
            var m_arrayProjectiles = [];
            // .
            var m_arrayExplosions = [];

            // Invoke the generate mesh function save output in accessible field.
            self.mesh = m_functionGenerateMesh();
        };

        // Return constructor function.
        return functionTurret;
    });