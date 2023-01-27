////////////////////////////////////////
// HelpText presents some information to the user.
//
// Returns function constructor.

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js",
    "/MithrilLib/three/Paragraph.js"],
    function (THREE,
        Paragraph) {

        // Define bomb constructor function.
        var functionHelpText = function HelpText(o3dVisualParent) {

            var self = this;            // Uber closure.

            ////////////////////////////
            // Public fields.

            self.mesh = new THREE.Object3D();

            self.paragraphIntro = null;
            self.paragraphStory = null;
            self.paragraphHelp = null;

            ////////////////////////////
            // Public methods.

            // Update.
            self.update = function (context) {

                try {

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private methods.

            // Method called to generate and return a landscape mesh.
            var m_functionGenerate = function () {

                try {

                    // Create text objects.
                    self.paragraphIntro = new Paragraph(o3dVisualParent,
                        "...just another day at the fields...",
                        new THREE.Vector3(0, 1375, 0));
                    self.paragraphIntro.mesh.scale = new THREE.Vector3(20, 20, 20);

                    // Story.
                    self.paragraphStory = new Paragraph(o3dVisualParent,
                        "Asteroids is a space-themed multidirectional shooter arcade game designed by Lyle Rains and Ed Logg released in November 1979 by Atari, Inc (re-imagined here by Ken Rubin in 2022).  The player controls a single spaceship in an asteroid field. The object of the game is to shoot and destroy the asteroids, while not colliding with them. The game becomes harder as the number of asteroids increases.",
                        new THREE.Vector3(-4000, 100, 0),
                        new THREE.Vector3(0, -Math.PI / 2, 0),
                        "center",
                        "center",
                        "center",
                        new THREE.Vector2(1, 1.5),
                        30);
                    self.paragraphStory.mesh.scale = new THREE.Vector3(20, 20, 20);


                    self.paragraphHelp = new Paragraph(o3dVisualParent,
                        "drag viewport to rotate                             " +
                        "press 'w' and 'x' to pitch command module           " +
                        "press 'a' and 'd' to yaw                            " +
                        "press 's' to thrust                                 " +
                        "press and hold 'q' to fire plasma cannon            ",
                        new THREE.Vector3(100, -200, 4000),
                        new THREE.Vector3(0, 0, 0),
                        "center",
                        "center",
                        "center",
                        new THREE.Vector2(1, 1.5),
                        40);
                    self.paragraphHelp.mesh.scale = new THREE.Vector3(20, 20, 20);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private fields.

            // Holds instance state.
            var m_state = {

            };

            // The material for all text.
            var m_material = new THREE.MeshNormalMaterial();


            ////////////////////////////
            // Executor code.

            // Invoke the generate mesh function save output in accessible field.
            var exceptionRet = m_functionGenerate();
            if (exceptionRet !== null) {

                alert(exceptionRet.message);
            }
        };

        // Return constructor function.
        return functionHelpText;
    });