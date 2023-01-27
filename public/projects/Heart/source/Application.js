////////////////////////////////////////
// Application object.
//
// Returns singelton.

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js",
    "/MithrilLib/three/ApplicationBase.js",
    "/MithrilLib/three/Paragraph.js"],
    function (THREE,
        ApplicationBase,
        Paragraph) {

        // Define Application class.
        var functionApplication = function Application() {

            var self = this;            // Uber closure.

            // Inherit from base class.
            self.inherits(ApplicationBase);

            ////////////////////////////
            // Update default public properties.

            self.axis.enabled = false;

            self.camera = {

                fOV: 45,
                nearPlane: 1,
                farPlane: 600,
                position: new THREE.Vector3(0,
                    0,
                    20),
                controls: {

                    enabled: true,
                    type: TrackballControls,
                    minDistance: 20,
                    maxDistance: 20,
                    dynamicDampingFactor: 0.5
                }
            };

            ////////////////////////////
            // Public methods.

            // Create application.
            self.create = function (context) {

                try {

                    // Create text specifying project name.
                    m_state.text = new Paragraph(context.scene,
                        m_state.arrayLines[0],
                        new THREE.Vector3(0, 0, 0),
                        new THREE.Vector3(0, 0, 0),
                        "center",
                        "center",
                        "center",
                        new THREE.Vector2(1, 1.5),
                        20);

                    // Reset zero time.
                    m_state.baseTime = new Date().getTime();

                    // Play some music.
                    var audio = new Audio();
                    audio.src = "/media/music/Natural Sounds - Tibetan Healing Sounds.mp3";
                    audio.play();
                    audio.addEventListener("ended",
                        function () {

                            this.currentTime = 0;
                            this.play();
                        },
                        false);

                    // Load up the texture.
                    var texture = THREE.ImageUtils.loadTexture("/media/buddha.jpg",
                        {},
                        function () {
                        
                            // Create a plane behind the text.
                            var plane = new THREE.Mesh(new THREE.PlaneGeometry(140, 105), new THREE.MeshBasicMaterial({

                                map: texture
                            }));
                            plane.overdraw = true;
                            plane.position = new THREE.Vector3(30,-40,-200);
                            context.scene.add(plane);
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

                    var dMS = new Date().getTime() - m_state.baseTime;
                    // Rotate about all axes for no particular reason.
                    if (m_state.text !== null) {

                        var dLine = dMS / (15000);
                        var dLineFraction = dLine - Math.floor(dLine);
                        var dLineWhole = Math.floor(dLine);
                        if (dLineWhole !== m_state.cursor) {
       
                            context.scene.remove(m_state.text.mesh);
                            m_state.text = null;
                            m_state.cursor = dLineWhole;
   
                            if (m_state.cursor < m_state.arrayLines.length) {
       
                                // Create text specifying project name.
                                m_state.text = new Paragraph(context.scene,
                                    m_state.arrayLines[m_state.cursor],
                                    new THREE.Vector3(0, 0, 0),
                                    new THREE.Vector3(0, 0, 0),
                                    "center",
                                    "center",
                                    "center",
                                    new THREE.Vector2(1, 1.5),
                                    16);
                            }
                        }
       
                        if (m_state.text !== null) {
       
                            m_state.text.setOpacity(Math.sin(Math.PI * dLineFraction));
                        }
       
                        // Position the image lower and to the right.
                        context.camera.position = new THREE.Vector3(10 * Math.sin(dMS / 10000),
                            10 * Math.cos(dMS / 10000),
                            20 + Math.cos(dMS / 50000));
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

                text: null,             // Text.
                baseTime: 0,
                cursor: 0,
                arrayLines: [
                    "Prajnaparamita Hrdaya Sutra",
                    "Heart of the Perfection of Transcendental Wisdom",
                    "The Bodhisattva Avalokitesvara, from the deep course of Prajnaparamita, saw clearly that all five skandhas were empty, thus sundered all bonds of suffering",
                    "Sariputra, know then: form does not differ from emptiness, nor does emptiness differ from form",
                    "Form is no other than emptiness, emptiness no other than form",
                    "The same is true of feelings, perceptions, impulses and consciousness",
                    "Sariputra, all dharmas are marked with emptiness",
                    "None are born or die, nor are they defiled or immaculate, nor do they wax or wane",
                    "Therefore, where there is emptiness, there is no form, no feeling, no perception, no impulse, nor is there consciousness",
                    "No eye, ear, nose, tongue, body, or mind",
                    "No color, sound, smell, taste, touch, or object of mind",
                    "There is no domain of sight nor even domain of mind consciousness",
                    "There is no ignorance nor is there ceasing of ignorance",
                    "There is no withering, no death, nor is there ceasing of withering and death",
                    "There is no suffering, or cause of suffering, or cease in suffering, or path to lead from suffering",
                    "There is no cognition, nor even attainment",
                    "So know that the Bodhisattva, indifferent to any kind of attainment whatsoever",
                    "Dwelling in Prajnaparamita, is freed of any thought covering, get rid of the fear bred by it,",
                    "Has overcome what can upset and in the end reaches utmost Nirvana",
                    "All Buddhas of past and present, and Buddhas of future time, through faith in Prajnaparamita, come to full and perfect Enlightenment",
                    "Therefore, one should know the Prajnaparamita as the mantra of great knowledge, the miraculous, the utmost, the unequalled mantra, whose words relieve all suffering",
                    "This is highest wisdom, true beyond all doubt, know then and proclaim the Prajnaparamita mantra, it spells like this:",
                    "gate gate paragate parasamgate bodhi svaha"
                ]
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
