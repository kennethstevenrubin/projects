// Main module initializes and executes application.

"use strict";

// Define AMD module.
define([],                              // No dependencies.
    function () {

        // Return an allocated instance of the main module object.
        return new function Main() {

            ////////////////////////////
            // As with all modules, define "this" closure up-front.
            var self = this;

            ////////////////////////////
            // Private methods.

            // Render the scene.
            var m_functionRender = function () {

                try {

                    for (var i = 0; i < m_state.meshes.length; i++) {

                        var mesh = m_state.meshes[i];
                        mesh.rotation.x += mesh.rotate[0];
                        mesh.rotation.y += mesh.rotate[1];
                        mesh.rotation.z += mesh.rotate[2];
                    }

                    // Update camera controls.
                    m_state.cameraControls.update();

                    // Actually render the scene.
                    m_state.renderer.render(m_state.scene,
                        m_state.camera);

                    return null;
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

                            antialias: true,	        // to get smoother output
                            preserveDrawingBuffer: true	// to allow screenshot
                        });

                        // Set background color.
                        m_state.renderer.setClearColorHex(0xBBBBBB,
                            1);

                    // Uncomment if webgl is required.
                    //} else {
                    //
                    //    // Complain about the sucky browser.
                    //    Detector.addGetWebGLMessage();
                    //    return { 
                    //                    
                    //        message: "WebGL required and not found."};
                    //    }
                    } else {

                        // Initialize the crappy renderer.
                        m_state.renderer = new THREE.CanvasRenderer();
                    }

                    // Initialize the size of the renderer to the entire client area of the browser. 
                    m_state.renderer.setSize(window.innerWidth,
                        window.innerHeight);

                    // Add the renderer to the DOM.
                    document.getElementById("container").appendChild(m_state.renderer.domElement);

                    /* Add Stats.js to DOM - https://github.com/mrdoob/stats.js.
                    m_state.stats = new Stats();
                    m_state.stats.domElement.style.position = 'absolute';
                    m_state.stats.domElement.style.bottom = '0px';
                    document.body.appendChild(m_state.stats.domElement);
                    */

                    // Create a scene object.
                    m_state.scene = new THREE.Scene();

                    // Put a camera in the scene.
                    m_state.camera = new THREE.PerspectiveCamera(45,    // FOV.
                        window.innerWidth / window.innerHeight,         // Aspect ratio.
                        1,                                              // Near plane.
                        10000);                                         // Far plane.
                    m_state.camera.position.set(0,
                        0,
                        15);
                    m_state.scene.add(m_state.camera);

                    // Create a camera contol.
                    m_state.cameraControls = new THREEx.DragPanControls(m_state.camera)

                    // Transparently support window resize.
                    THREEx.WindowResize.bind(m_state.renderer,
                        m_state.camera);

                    // Allow 'p' to make screenshot.
                    THREEx.Screenshot.bindKey(m_state.renderer);

                    // Allow 'f' to go fullscreen where this feature is supported.
                    if (THREEx.FullScreen.available()) {

                        THREEx.FullScreen.bindKey();
                    }

                    // Create two point lights and place in scene.
                    var pointLight = new THREE.PointLight(0xFFFFFF);
                    pointLight.position.set(10,
                        10,
                        10);
                    m_state.scene.add(pointLight);
                    pointLight = new THREE.PointLight(0xFFFFFF);
                    pointLight.position.set(-10,
                        -10,
                        -10);
                    m_state.scene.add(pointLight);

                    // Add some shapes to the scene.
                    for (var iX = 0; iX < 5; iX++) {

                        for (var iY = 0; iY < 5; iY++) {

                            for (var iZ = 0; iZ < 5; iZ++) {

                                // Torus.
                                var geometry = new THREE.TorusGeometry(0.4,         // Major width.
                                    0.2,                                            // Minor width.
                                    100,                                            // Major segments.
                                    20);                                            // Minor segments.
                                var material = new THREE.MeshLambertMaterial();
                                material.color.setRGB(Math.random(),
                                    Math.random(),
                                    Math.random());
                                var mesh = new THREE.Mesh(geometry,
                                    material);
                                mesh.position.set(1.75 * (iX - 2),
                                    1.75 * (iY - 2),
                                    1.75 * (iZ - 2));

                                m_state.scene.add(mesh);

                                mesh.rotate = [Math.random() * Math.random() / 10,
                                    Math.random() * Math.random() / 10,
                                    Math.random() * Math.random() / 10];

                                m_state.meshes.push(mesh);
                            }
                        }
                    }

                    // Initialize keyboard listener.
                    m_state.keyboard = new THREEx.KeyboardState();

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private event handlers.

            // Animation loop.
            var m_functionAnimate = function () {

                // Loop on request animation loop:
                // - it has to be at the begining of the function
                // - see details at http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating.
                requestAnimationFrame(m_functionAnimate);

                // Do the render.
                var exceptionRet = m_functionRender();
                if (exceptionRet !== null) {

                    // Just display error message.
                    alert(exceptionRet.message);
                }

                // Update stats.
                m_state.stats.update();
            };

            ////////////////////////////
            // Private state.

            // Holds state for main object.
            var m_state = {

                stats: null,            // On-screen FPS display.
                scene: null,            // Holds all rendering objects.
                renderer: null,         // The Three.js renderer.
                camera: null,           // The Three.js camera.
                keyboard: null,         // A keyboard state object.
                meshes: [],             // .
                cameraControls: null    // The mouse-camera controls.
            };

            ////////////////////////////
            // Start off the application and keep it going.
            var exceptionRet = m_functionInitialize();
            if (exceptionRet === null) {

                // Seed event cycle.
                m_functionAnimate();
            } else {

                // Just display error message.
                alert(exceptionRet.message);
            }
        };
    });