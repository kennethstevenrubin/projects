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
            // Update default public properties.

            // Defines the extent of approaching the limitingshape.
            self.refinementDepth = 4;

            self.axis.enabled = false;

            self.skybox = {

                enabled: true,
                prefix: "/media/",
                top: "Stars.png",
                bottom: "Stars.png",
                left: "Stars.png",
                right: "Stars.png",
                front: "Stars.png",
                back: "Stars.png",
                size: 3000
            };

            self.camera = {

                fOV: 45,
                nearPlane: 1,
                farPlane: 6000,
                position: new THREE.Vector3(0,
                    0,
                    2000),
                controls: {

                    enabled: true,
                    type: TrackballControls,
                    minDistance: 2,
                    maxDistance: 2000,
                    dynamicDampingFactor: 0.005
                }
            };

            ////////////////////////////
            // Public methods.

            // Create application.
            self.create = function (context) {

                try {

                    // The sprite texture, stolen from google images....
                    var sprite = THREE.ImageUtils.loadTexture("/media/lensflare0_alpha.png",
                        {},
                        function () {

                            // The geometry holds all particles as verticies.
                            var geometry = new THREE.Geometry();

                            // Create a whole bunch of particles add
                            // to geometry and parameterize colors.
                            var iNumberOfStars = 4000;
                            var dRadius = 2800;
                            for (var i = 0; i < iNumberOfStars; i++) {

                                // Place randomly in 3-space.
                                var vertex = new THREE.Vector3();
                                vertex.x = (dRadius * Math.random() - dRadius / 2);
                                vertex.y = (dRadius * Math.random() - dRadius / 2);
                                vertex.z = (dRadius * Math.random() - dRadius / 2);

                                for (var j = 0; j < self.refinementDepth; j++) {

                                    vertex.x *= Math.random();
                                    vertex.y *= Math.random();
                                    vertex.z *= Math.random();
                                }

                                // Add to geometry.
                                geometry.vertices.push(vertex);
                            }

                            // Vertex colors.
                            var colors = [];
                            for (var i = 0; i < geometry.vertices.length; i++) {
                            
                                // random color
                                var color = new THREE.Color();
                                color.h = (6 * Math.random() / 10 + .6) % 1.1;
                                color.velocity = 50 * Math.random() + 8;
                                color.v = Math.random();
                                color.setHSV(color.h,
                                    1.0,
                                    0.5 + 0.5 * Math.sin(2 * Math.PI * color.v));
                                colors.push(color);
                            }
                            geometry.colors = colors;

                            // Allocate the material for the particles,
                            // note: alpha-vertex colors.
                            var material = new THREE.ParticleBasicMaterial({

                                size: 200,
                                map: sprite,
                                //blending: THREE.AdditiveBlending,  //is a cool blending effect....
                                blending: THREE.AdditiveAlphaBlending,
                                vertexColors: true,
                                transparent: true
                            });

                            // Finally, create the particle system 
                            // with the build geometry and material.
                            var particles = new THREE.ParticleSystem(geometry,
                                material);
                            particles.sortParticles = true;

                            // And add the particle system to
                            // the scene so it may be shown.
                            context.scene.add(particles);

                            m_state.particleSystem = particles;
                        });

                    // Disallow user interaction with the camera.
                    context.cameraControls.enabled = false;

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Update application.
            self.update = function (context) {

                try {
       
                    if (!m_state ||
                        !m_state.particleSystem) {
       
                        return null;
                    }

                    // Do some dinky calcs...
                    var dTime = Date.now();

                    // Update color visibility.
                    var colors = m_state.particleSystem.geometry.colors;
                    for (var i = 0; i < colors.length; i++) {

                        var colorIth = colors[i];
       
                        colorIth.v += Math.random() / colorIth.velocity;
                        colorIth.setHSV(colorIth.h,
                            1.0,
                            0.6 + 0.4 * Math.sin(2 * Math.PI * colorIth.v));
                    }
       
                    context.cameraControls.setRotate(dTime / 10000,
                        (Math.sin(dTime / 10000) + 1) / 25);
                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private fields.

            // Holds state for main object.
            var m_state = {

                particleSystem: null        // .
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
