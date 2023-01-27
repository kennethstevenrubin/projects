////////////////////////////////////////
// ApplicationBase module.
// Returns function constructor.

"use strict";

// Define AMD module, specify required includes.
define(["/MithrilLib/system/prototypes.js",
    "/MithrilLib/three/core/three.js",
    "/MithrilLib/three/core/Detector.js",
    "/MithrilLib/three/core/TrackballControls.js",
    "/MithrilLib/three/core/AudioContainer.js"],
    function (prototype,
        THREE,
        Detector,
        TrackballControls,
        AudioContainer) {

        // Define application base constructor function.
        var m_functionApplicationBase = function ApplicationBase() {

            var self = this;            // Uber-closure.

            ////////////////////////////
            // Public virtual fields.

            // Handling window resize?
            self.windowResize = {

                enabled: true
            };

            // Keyboard handling?
            self.keyboard = {

                enabled: true
            };

            // Enable stats overlay?
            self.stats = {

                enabled: false
            };

            // Camera characteristics.
            self.camera = {

                fieldOfView: 30, 
                nearPlane: 1,
                farPlane: 100000,
                position: new THREE.Vector3(0,
                    8,
                    8),
                controls: {

                    enabled: true,
                    type: TrackballControls,
                    minDistance: 100,
                    maxDistance: 10000,
                    dynamicDampingFactor: 1
                }
            };

            // Light characteristics.
            self.light = {

                directional: {

                    enabled: true,
                    type: THREE.DirectionalLight,
                    position: new THREE.Vector3(10,
                        10,
                        10)
                },
                ambient: {
       
                    enabled:false,
                    color: 0x404040
                }
            };

            // Add an horizon plane to the scene?
            self.horizonPlane = {

                enabled: false,
                position: new THREE.Vector3(0,
                    0.5,
                    0),
                meshColor: "rgb(0,24,64)",
                size: 10
            };

            // Add a skybox to the scene?
            self.skybox = {

                enabled: false,
                prefix: "http://" +
                    window.location.host +
                    "/Landscape/media/",
                top: "Stars.png",
                bottom: "Stars.png",
                left: "Stars.png",
                right: "Stars.png",
                front: "Stars.png",
                back: "Stars.png",
                size: 1000
            };

            // Add an axis to the scene?
            self.axis = {

                enabled: true,
                size: 6
            };

            // Add an audio container.
            self.audioContainer = new AudioContainer();

            ////////////////////////////
            // Public methods.

            // Start off the application and keep it going.
            self.run = function () {

                try {

                    // Initialize entire application (incuding derived class).
                    var exceptionRet = m_functionInitialize();
                    if (exceptionRet !== null) {

                        return exceptionRet;
                    }

                    // Seed render cycle.
                    m_functionAnimate();

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Public virtual methods.

            // One time creation call.
            // Override in derived class to specialize creation of application.
            //
            // context -- ApplicationBase state object.
            self.create = function (context) {

                return null;
            };

            // Update call.
            // Override in derived class to update application each frame.
            //
            // context -- ApplicationBase state object.
            self.update = function (context) {

                return null;
            };

            ////////////////////////////
            // Private methods.

            // Update the scene (or the objects therein).
            var m_functionUpdate = function () {

                try {

                    // Update camera.
                    if (self.camera.controls.enabled) {

                        m_state.cameraControls.update();
                    }

                    // Do the clock delta here and save in state.
                    // These can only be accurately called once per frame.
                    m_state.delta = m_state.clock.getDelta();
                    m_state.elapsed = m_state.clock.getElapsedTime();

                    // Update the application.
                    return self.update(m_state);
                } catch (e) {

                    return e;
                }
            };

            // Initialize three.js scene and state.
            var m_functionInitialize = function () {

                try {

                    // Ask the detector if WebGL is available.
                    if (Detector.webgl) {

                        // Since is it available, initialize the good renderer.
                        m_state.renderer = new THREE.WebGLRenderer({

                            antialias: true	        // to get smoother output
                        });

                        // Set background color.
                        m_state.renderer.setClearColorHex(0x000000,
                            1);
                    } else {

                        // Complain about the sucky browser.
                        Detector.addGetWebGLMessage();
                        return {

                            message: "WebGL required and not found."
                        };
                    }

                    // Initialize renderer and ADD to DOM. 
                    m_state.renderer.setSize(window.innerWidth,
                        window.innerHeight);
                    document.getElementById("container").appendChild(m_state.renderer.domElement);

                    // Add Stats.js to DOM - https://github.com/mrdoob/stats.js.
                    if (self.stats.enabled) {

                        require(["/MithrilLib/three/core/Stats.js"],
                            function (Stats) {

                                m_state.stats = new Stats();
                                m_state.stats.domElement.style.position = 'absolute';
                                m_state.stats.domElement.style.left = '10px';
                                m_state.stats.domElement.style.bottom = '10px';
                                document.body.appendChild(m_state.stats.domElement);
                            });
                    }

                    // Initialize keyboard.
                    if (self.keyboard.enabled) {

                        require(["/MithrilLib/three/core/KeyboardState.js"],
                            function (KeyboardState) {

                                m_state.keyboard = new KeyboardState();
                            });
                    }

                    // Initialize clock.
                    m_state.clock = new THREE.Clock(true);

                    // Create a scene object.
                    m_state.scene = new THREE.Scene();

                    // Put a camera in the scene.
                    m_state.camera = new THREE.PerspectiveCamera(self.camera.fieldOfView,
                        window.innerWidth / window.innerHeight,         // Aspect ratio.
                        self.camera.nearPlane,
                        self.camera.farPlane);
                    m_state.camera.position = self.camera.position;
                    m_state.scene.add(m_state.camera);

                    // Transparently support window resize.
                    if (self.windowResize.enabled) {

                        require(["/MithrilLib/three/core/WindowResize.js"],
                            function (WindowResize) {

                                m_state.resizer = new WindowResize(m_state.renderer,
                                    m_state.camera);
                            });
                    }

                    // Create a camera contol.
                    if (self.camera.controls.enabled) {

                        m_state.cameraControls = new self.camera.controls.type(m_state.camera,
                            self.camera.controls.minDistance,
                            self.camera.controls.maxDistance);
                        m_state.cameraControls.dynamicDampingFactor = self.camera.controls.dynamicDampingFactor;
                    }

                    // Create a directional light.
                    if (self.light.directional.enabled) {

                        // Allocate the new light.
                        var light = new self.light.directional.type();
                        light.position = self.light.directional.position;

                        m_state.lights.push(light);
                        m_state.scene.add(light);
                    }
       
                    // Create an ambient light.
                    if (self.light.ambient.enabled) {
       
                        // Allocate the light.
                        var light = new THREE.AmbientLight(self.light.ambient.color); // soft white light

                        m_state.lights.push(light);
                        m_state.scene.add(light);
                    }

                    // Create an "infinite" horizon plane.
                    if (self.horizonPlane.enabled) {

                        var geometry = new THREE.PlaneGeometry(self.horizonPlane.size,
                            self.horizonPlane.size);
                        var material = new THREE.MeshBasicMaterial({

                            color: self.horizonPlane.meshColor
                        });
                        var mesh = new THREE.Mesh(geometry,
                            material);
                        mesh.position = self.horizonPlane.position;

                        // Tilt so it is crossed against Up.
                        mesh.rotation.x = -Math.PI / 2;
                        m_state.scene.add(mesh);
                    }

                    // Add axis to further orient user.
                    if (self.axis.enabled) {

                        var mesh = new THREE.AxisHelper(self.axis.size);
                        m_state.scene.add(mesh);
                    }

                    // Add skybox, if specified.
                    if (self.skybox.enabled) {

                        require(["/MithrilLib/three/Skybox.js"],
                            function (Skybox) {

                                m_state.skybox = new Skybox(m_state,
                                    self.skybox.prefix,
                                    self.skybox.top,
                                    self.skybox.bottom,
                                    self.skybox.left,
                                    self.skybox.right,
                                    self.skybox.front,
                                    self.skybox.back,
                                    self.skybox.size);
                            });
                    }

                    // Let the derived class create itself.
                    return self.create(m_state);
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private event handlers.

            // Animation loop.
            var m_functionAnimate = function () {

                try {

                    // Do the update.
                    var exceptionRet = m_functionUpdate();
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    // Update stats--but only if allocated!
                    if (m_state.stats) {

                        m_state.stats.update();
                    }

                    // Actually render the scene.
                    m_state.renderer.render(m_state.scene,
                        m_state.camera);

                    // Loop on request animation frame.
                    requestAnimationFrame(m_functionAnimate);
                } catch (e) {

                    alert(e.message);
                }
            };

            ////////////////////////////
            // Private state.

            // Holds state for main object.
            var m_state = {

                skybox: null,           // Skybox.
                stats: null,            // On-screen FPS display.
                scene: null,            // Holds all rendering objects.
                renderer: null,         // The Three.js renderer.
                resizer: null,          // The window resizer.
                camera: null,           // The Three.js camera.
                cameraControls: null,   // The mouse-camera controls.
                clock: null,            // Timer object.
                keyboard: null,         // Keyboard state object.
                lights: []              // Collection of lights for the scene.
            };
        };

        // Return function constructor.
        return m_functionApplicationBase;
    });
