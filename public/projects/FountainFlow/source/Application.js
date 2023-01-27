////////////////////////////////////////
// Application object.
//
// Returns singelton.

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js",
    "/MithrilLib/three/ApplicationBase.js"],
    function (THREE,
        ApplicationBase) {

        // Define Application class.
        var functionApplication = function Application() {

            var self = this;            // Uber closure.

            // Inherit from base class.
            self.inherits(ApplicationBase);

            ////////////////////////////
            // Update public properties.

            self.camera.position = new THREE.Vector3(0,
                    100,
                    100);

            self.axis = {

                enabled: false
            }

            ////////////////////////////
            // Public methods.

            // Create application.
            self.create = function (context) {

                try {

                    var plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial({

                        color: 0x223344
                    }));
                    plane.overdraw = true;
                    plane.rotation.x = -Math.PI / 2;
                    context.scene.add(plane);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Update application.
            self.update = function (context) {

                try {

                    // Update positions and velocities of projectiles.
                    var arrayRemove = [];
                    for (var i = 0; i < m_state.projectiles.length; i++) {

                        var projectile = m_state.projectiles[i];

                        projectile.rotation.x += projectile.rotate[0];
                        projectile.rotation.y += projectile.rotate[1];
                        projectile.rotation.z += projectile.rotate[2];

                        projectile.position.x += projectile.velocity[0];
                        projectile.position.y += projectile.velocity[1];
                        projectile.position.z += projectile.velocity[2];

                        projectile.velocity[1] += m_state.gravity;

                        if (projectile.position.y < 1 &&
                            projectile.velocity[1] < 0) {

                            projectile.position.y -= projectile.velocity[1];
                            projectile.velocity[1] = -0.45 * projectile.velocity[1];
                            projectile.velocity[0] = 0.975 * projectile.velocity[0];
                            projectile.velocity[2] = 0.975 * projectile.velocity[2];
                        }
                        if (projectile.position.z < -49 ||
                            projectile.position.x > 49) {

                            arrayRemove.push(projectile);
                            arrayRemove.push(i);
                        }
                    }
                    for (var i = 0; i < arrayRemove.length; i += 2) {

                        var projectile = arrayRemove[i];
                        var iIndex = arrayRemove[i + 1];

                        context.scene.remove(projectile);
                        m_state.projectiles.splice(iIndex, 1);

                        break;
                    }

                    // Test for a new projectile.
                    var iNow = (new Date()).getTime();
                    if (iNow - m_state.lastFire > m_state.fireFrequencyMS) {

                        // Create a new projectile.
                        var geometry = new THREE.SphereGeometry(0.5,         // Major width.
                            10,                                            // Major segments.
                            10);                                            // Minor segments.
                        var material = new THREE.MeshLambertMaterial();
                        material.color.setRGB(Math.random(),
                            Math.random(),
                            Math.random());
                        var mesh = new THREE.Mesh(geometry,
                            material);
                        mesh.position.set(-45 + Math.random() * 2 - 1,
                            -1,
                            45 + Math.random() * 2 - 1);
                        mesh.rotate = [Math.random() * Math.random() / 10,
                            Math.random() * Math.random() / 10,
                            Math.random() * Math.random() / 10];
                        mesh.velocity = [0.15 + Math.random() / 6,
                            0.5,
                            -0.15 - Math.random() / 6];

                        context.scene.add(mesh);

                        m_state.projectiles.push(mesh);

                        m_state.lastFire = iNow;
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private fields.

            // Holds state for main object.
            var m_state = {

                projectiles: [],        // .
                lastFire: 0,            // Time of last fire.
                fireFrequencyMS: 0,     // Fire a torus every second.
                gravity: -0.0033        // Gravity.
            };
        };

        // Do function injection.
        functionApplication.inheritsFrom(ApplicationBase);

        // Allocate the singleton instance.
        var application = new functionApplication();

        // Start off the application.
        var exceptionRet = application.run();
        if (exceptionRet !== null) {

            alert(exceptionRet);
        }

        // Return singleton.
        return application;
    });
