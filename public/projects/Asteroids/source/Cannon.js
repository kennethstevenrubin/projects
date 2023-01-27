////////////////////////////////////////
// Cannon is a bomb animation device.
//
// Returns function constructor.

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js"],
    function (THREE) {

        // Define bomb constructor function.
        var functionCannon = function Cannon() {

            var self = this;            // Uber closure.

            ////////////////////////////
            // Public fields.

            self.bombs = [];
            self.bombStore = [];

            self.radius = 1;
            self.detail = 0;
            self.coordinateCutoff = 500;
            self.material = new THREE.MeshBasicMaterial({

                color: new THREE.Color(0xffff00)
            });

            ////////////////////////////
            // Public methods.

            // Add a new missle to the collection.
            self.fire = function (objectVisualParent,
                dTheta,
                dPhi,
                v3Position,
                v3VelocityMagnitude) {

                try {

                    var bomb = null;
                    if (self.bombStore.length > 0) {

                        bomb = self.bombStore[0];
                        self.bombStore.splice(0, 1);
                    } else {

                        var geometry = new THREE.TetrahedronGeometry(self.radius,
                            self.detail);
                        geometry.applyMatrix(new THREE.Matrix4().makeRotationY(2 * Math.PI * Math.random()));
                        var mesh = new THREE.Mesh(geometry,
                            self.material);
                        mesh.scale = new THREE.Vector3(1,5,1);

                        bomb = {

                            mesh: mesh,
                            geometry: geometry
                        };
                    }

                    bomb.visualParent = objectVisualParent;
                    bomb.theta = dTheta;
                    bomb.phi = dPhi;
                    bomb.velocityMagnitude = v3VelocityMagnitude;

                    bomb.mesh.matrix = new THREE.Matrix4().makeRotationY(dTheta).multiply(new THREE.Matrix4().makeRotationZ(dPhi));
                    bomb.mesh.rotation.setEulerFromRotationMatrix(bomb.mesh.matrix);
                    bomb.mesh.position = v3Position;

                    objectVisualParent.add(bomb.mesh);

                    self.bombs.push(bomb);

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

                    // Process each bomb
                    var arrayIndiciesToRemove = [];
                    for (var i = 0; i < self.bombs.length; i++) {

                        var bombIth = self.bombs[i];

                        bombIth.mesh.translateY(bombIth.velocityMagnitude * dDelta);

                        var v3Position = bombIth.mesh.position;
                        if (v3Position.x > self.coordinateCutoff ||
                            v3Position.x < -self.coordinateCutoff ||
                            v3Position.y > self.coordinateCutoff ||
                            v3Position.y < -self.coordinateCutoff ||
                            v3Position.z > self.coordinateCutoff ||
                            v3Position.z < -self.coordinateCutoff) {

                            arrayIndiciesToRemove.push(i);
                            bombIth.visualParent.remove(bombIth.mesh);
                            self.bombStore.push(bombIth);
                        }
                    }

                    // Delete out of bounds.
                    arrayIndiciesToRemove.reverse();
                    for (var i = 0  ; i < arrayIndiciesToRemove.length; i++) {

                        self.bombs.splice(arrayIndiciesToRemove[i], 1);
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };
        };

        // Return constructor function.
        return functionCannon;
    });