////////////////////////////////////////
// Application object.
//
// Returns singelton.

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js",
    "/MithrilLib/three/ApplicationBase.js",
    "/MithrilLib/three/Text.js"],
    function (THREE,
        ApplicationBase,
        Text) {

        // Define Application class.
        var functionApplication = function Application() {

            var self = this;            // Uber closure.

            // Inherit from base class.
            self.inherits(ApplicationBase);

            ////////////////////////////
            // Update public properties.

            self.skybox = {

                enabled: true,
                prefix: "http://" +
                    window.location.host +
                    "/projects/TreeFractal/media/",
                top: "top.png",
                bottom: "bottom.png",
                left: "left.png",
                right: "right.png",
                front: "front.png",
                back: "back.png",
                size: 10000
            };

            self.camera.position = new THREE.Vector3(0,0,60);
            self.camera.nearPlane = 1;
            self.camera.farPlane = 20000;
            self.camera.minDistance = 30;
            self.camera.maxDistance = 30;

            self.stats.enabled = false;
            self.axis.enabled = false;

            ////////////////////////////
            // Public methods.

            // Create application.
            self.create = function (context) {

                try {

                    context.cameraControls.noZoom = true;
                    context.cameraControls.noPan = true;

                    // Build a tree.  Start with a single trunk.
                    var geometry = new THREE.CylinderGeometry(0,
                        0,
                        0,
                        1,
                        1,
                        false);
                    geometry.applyMatrix(new THREE.Matrix4().translate(new THREE.Vector3(0, 0.5, 0)));
                    var material = new THREE.MeshNormalMaterial();
                    var mesh = new THREE.Mesh(geometry,
                        material);
                    mesh.position.y = -4.13;
                    mesh.scale.y = 0.9;
                    context.scene.add(mesh);

                    // Initiate recursion.
                    return m_functionRecurse(18,
                        mesh,
                        1.5);
                } catch (e) {

                    return e;
                }
            };

            // Update application.
            self.update = function (context) {

                try {

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private methods.

            // Build the tree.
            var m_functionRecurse = function (iDepth,
                meshParent,
                dParentLength) {

                try {

                    // Calculate a new child length.  Usually tends to 
                    // decrease, but allows for the possibility of chaos.
                    var dChildLength = dParentLength * (0.85 + 0.15 * Math.random());
                    var dPercent = dChildLength / dParentLength;

                    // Generate some children.
                    var dRoll = Math.random();
                    var iCount = (dRoll < 0.5 ? 2 : 1);
                    for (var i = 0; i < iCount; i++) {

                        // Create the child.
                        var geometry = new THREE.CylinderGeometry(0.9 * (iDepth) / 100 + 1 / 100,
                            iDepth / 100 + 1 / 100,
                            dChildLength,
                            5,
                            1,
                            false);

                        // Slide it up on end.
                        geometry.applyMatrix(new THREE.Matrix4().translate(new THREE.Vector3(0, dChildLength / 2, 0)));

                        var meshChild = new THREE.Mesh(geometry,
                            m_state.materialBranch);
                        meshParent.add(meshChild);

                        // Calculate a rotation variance, allow for between a factor of 7, 
                        // little change at trunk; to a factor of 2 at the tips, for large.
                        var dDRotationZ = 7 - 6 * (1 - dParentLength);
                        var dHalfDRotationZ = dDRotationZ / 2;

                        // Move along the shaft of the parent, then...
                        meshChild.position.y = dParentLength * 0.99;

                        // Rotate about Up a la Z.
                        meshChild.rotation.y = 2 * Math.PI * Math.random();
                        meshChild.rotation.z = Math.PI / 4 - Math.PI / 2 * Math.random(); //(Math.PI / dHalfDRotationZ - Math.PI / dDRotationZ) * Math.random();

                        // Recurse.
                        if (iDepth > 0) {

                            // Create a branch create task.
                            m_state.branches.push({

                                depth: iDepth - 1,
                                mesh: meshChild,
                                length: dChildLength
                            });

                            // Queue up to read a branch task.
                            setTimeout(function () {

                                // Get the task.
                                var objectTask = m_state.branches.pop();

                                // Process it.
                                var exceptionRet = m_functionRecurse(objectTask.depth,
                                    objectTask.mesh,
                                    objectTask.length);
                                if (exceptionRet !== null) {

                                    return null;
                                }
                            }, 0);
                        } else {

                            // Create a leaf create task.
                            m_state.leaves.push({

                                depth: iDepth - 1,
                                mesh: meshChild,
                                length: dChildLength
                            });

                            // Queue up to read a leaf task.
                            setTimeout(function () {

                                // Get the task.
                                var objectTask = m_state.leaves.pop();

                                // Process it.
                                var exceptionRet = m_functionLeaf(iDepth,
                                    objectTask.mesh,
                                    objectTask.length);
                                if (exceptionRet !== null) {

                                    return null;
                                }
                            }, 0);
                        }
                    }
                    return null;
                } catch (e) {

                    alert(e.message);
                }
            };

            // Render a leaf.
            var m_functionLeaf = function (iDepth,
                meshParent,
                dParentLength) {

                try {

                    // Generate a leaf child.
                    var dChildLength = dParentLength / 2;

                    // Create the child.
                    var geometry = new THREE.CylinderGeometry(1 / 40,
                        1 / 20,
                        dChildLength / 6,
                        3,
                        1,
                        false);

                    var meshChild = new THREE.Mesh(geometry,
                        m_state.materialLeaf);
                    meshParent.add(meshChild);

                    // Move along the shaft of the parent, then...
                    meshChild.position.y = dParentLength;

                    // Calculate a rotation variance, allow for between a factor of 7, 
                    // little change at trunk; to a factor of 2 at the tips, for large.
                    var dDRotationZ = 27 - 6 * (1 - dParentLength);
                    var dHalfDRotationZ = dDRotationZ / 2;

                    // Rotate about Up a la Z.
                    meshChild.rotation.y = 2 * Math.PI * Math.random();
                    meshChild.rotation.z = (Math.PI / dHalfDRotationZ - Math.PI / dDRotationZ) * Math.random();

                    return null;
                } catch (e) {

                    alert(e.message);
                }
            };

            ////////////////////////////
            // Private fields.

            // Holds state for main object.
            var m_state = {

                branches: [],           // Collection of queued branch generation tasks.
                leaves: [],             // Collection of queued leaf generation tasks.
                materialBranch: new THREE.MeshPhongMaterial({

                    color: 0x777700
                }),                     // Material to use for branches.
                materialLeaf: new THREE.MeshPhongMaterial({

                    color: 0xf0ff30
                })                      // Material to use for leaves.
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
