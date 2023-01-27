////////////////////////////////////////
// Application object.
//
// Returns singelton.

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js",
    "/MithrilLib/three/ApplicationBase.js",
    "/MithrilLib/three/core/KeyboardState.js",
    "/MithrilLib/three/PerlinPlane.js",
    "/MithrilLib/three/Paragraph.js",
    "Turret",
    "Meter"],
    function (THREE,
        ApplicationBase,
        KeyboardState,
        PerlinPlane,
        Paragraph,
        Turret,
        Meter) {

        // Define Application class.
        var functionApplication = function Application() {

            var self = this;            // Uber closure.

            // Inherit from base class.
            self.inherits(ApplicationBase);

            ////////////////////////////
            // Public fields--configure the applcation.

            // Add a skybox to the scene.
            self.skybox = {

                enabled: true,
                prefix: "/media/",
                top: "Stars.png",
                bottom: "Stars.png",
                left: "Stars.png",
                right: "Stars.png",
                front: "Stars.png",
                back: "Stars.png",
                size: 1000
            };
            self.light.ambient.enabled = true;
            self.light.ambient.color = 0xffffff;
            self.camera.position = new THREE.Vector3(64,
                    48,
                    32);
            self.camera.controls.dynamicDampingFactor = 0.2;
            self.axis.enabled = false;
            self.stats.enabled = true;

            // Coordinates of perlinPlane.
            self.world = new THREE.Vector3(64,
                8,
                64);

            ////////////////////////////
            // Public methods.

            self.addToShieldMeterLevel = function (force) {

                m_state.power.shield += force;

                if (m_state.power.shield >= 1) {

                    window.location.reload();
                }
            };

            self.getHumanTurret = function () {

                return m_state.turrets[0];
            };

            self.getComputerTurrets = function () {

                return m_state.turrets.filter((turret, i) => {

                    return i != 0;
                });
            };

            // Method returns height of perlin plane, given the specified position.
            self.heightFromPosition = function (v3Position) {
       
                // Calculate x z position in the unit cube.
                var dPercentX = (v3Position.x + self.world.x / 2) / self.world.x;
                var dPercentZ = (v3Position.z + self.world.z / 2) / self.world.z;
                var dOffsetX = Math.floor(dPercentX * m_state.perlinPlane.granularity);
                var dOffsetZ = Math.floor(dPercentZ * m_state.perlinPlane.granularity);

                // Get its y position from the unit and multiply back to world space.
                return m_state.perlinPlane.heightData[dOffsetX +
                    dOffsetZ * m_state.perlinPlane.granularity] * self.world.y;
            };

            // Create application.
            self.create = function (context) {

                try {

                    // Load up some sound caches.
                    self.audioContainer.load("ComputerFire", 
                        "/media/wav/mixkit-video-game-retro-click-237.wav",
                        20,
                        0.2);
                    self.audioContainer.load("TerrainHit", 
                        "/media/wav/mixkit-cartoon-blood-and-gore-hit-726.wav",
                        20,
                        0.2);
                    self.audioContainer.load("PlayerFire", 
                        "/media/wav/mixkit-quick-ninja-strike-2146.wav",
                        20);
                    self.audioContainer.load("PlayerHit", 
                        "/media/wav/mixkit-cartoon-blood-and-gore-hit-726.wav",
                        4);
                    self.audioContainer.load("PlayerDead", 
                        "/media/wav/mixkit-arcade-retro-game-over-213.wav",
                        1);
                    self.audioContainer.load("PlayerWon", 
                        "/media/wav/mixkit-medieval-show-fanfare-announcement-226.wav",
                        1);


                    self.audioContainer.load("ComputerHit", 
                        "/media/wav/mixkit-cartoon-blood-and-gore-hit-726.wav",
                        20);

                    // Disallow everything but y-rotation on the camera controls object.
                    context.cameraControls.fixedYRotate = true;
                    context.cameraControls.noZoom = true;
                    context.cameraControls.noPan = true;
       
                    // Create the title and intro text and help.
                    m_state.text.title = new Paragraph(context.scene,
                        "Space Battle!",
                        new THREE.Vector3(0, 10, 0),
                        new THREE.Vector3(0, Math.PI / 4, 0),
                        "center",
                        "center",
                        "center",
                        new THREE.Vector2(1, 1.5),
                        40);
       
                    // Text material.
                    var materialText = new THREE.MeshPhongMaterial({

                        color: 0x776666,
                        specular: 0x0000ff,
                        ambient: 0x333333
                    });
                    for (var i = 0; i < m_state.text.title.mesh.children.length; i++) {
       
                        m_state.text.title.mesh.children[i].material = materialText;
                    }
       
                    // Create the PerlinPlane object, size it and add to scene.
                    m_state.perlinPlane = new PerlinPlane(512,
                        self.light.position,
                        new THREE.Vector3(96, 32, 0),
                        new THREE.Vector3(200, 128, 96),
                        [{

                            frequency: 64,
                            magnitude: 8
                        }, {

                            frequency: 128,
                            magnitude: 32
                        }],
                        1);
                    m_state.perlinPlane.mesh.scale.x = self.world.x;
                    m_state.perlinPlane.mesh.scale.y = self.world.z;  // Note: y is z!
                    m_state.perlinPlane.mesh.scale.z = self.world.y;  // Note: z is y! 
                    context.scene.add(m_state.perlinPlane.mesh);

                    // Find the best place for the first turret.
                    m_state.turrets.push(new Turret(self));
                    m_state.turrets[0].mesh.scale.x = 5;
                    m_state.turrets[0].mesh.scale.y = 5;
                    m_state.turrets[0].mesh.scale.z = 5; 
                    m_state.turrets[0].mesh.position = m_functionFindHighestPoint(new THREE.Vector3(m_state.constants.turretPositionOffset + 0.5 * m_state.constants.turretPositionOffset * (Math.random() - 0.5), 0, m_state.constants.turretPositionOffset + 0.5 * m_state.constants.turretPositionOffset * (Math.random() - 0.5)),
                        new THREE.Vector3(m_state.constants.turretPositionVariance, 0, m_state.constants.turretPositionVariance));
                    m_state.turrets[0].mesh.position.y += m_state.constants.turretFullyVisibleHeight;
                    context.scene.add(m_state.turrets[0].mesh);

                    // Find the best place for the second turret.
                    m_state.turrets.push(new Turret(self,
                        true));
                    m_state.turrets[1].mesh.scale.x = 5;
                    m_state.turrets[1].mesh.scale.y = 5;
                    m_state.turrets[1].mesh.scale.z = 5; 
                    m_state.turrets[1].mesh.position = m_functionFindHighestPoint(new THREE.Vector3(-m_state.constants.turretPositionOffset - 0.5 * m_state.constants.turretPositionOffset * (Math.random() - 0.5), 0, -m_state.constants.turretPositionOffset - 0.5 * m_state.constants.turretPositionOffset * (Math.random() - 0.5)),
                        new THREE.Vector3(m_state.constants.turretPositionVariance, 0, m_state.constants.turretPositionVariance));
                    m_state.turrets[1].mesh.position.y += m_state.constants.turretFullyVisibleHeight;
                    context.scene.add(m_state.turrets[1].mesh);

                    // Find the best place for the third turret.
                    m_state.turrets.push(new Turret(self,
                        true));
                    m_state.turrets[2].mesh.scale.x = 5;
                    m_state.turrets[2].mesh.scale.y = 5;
                    m_state.turrets[2].mesh.scale.z = 5; 
    
                    m_state.turrets[2].mesh.position = m_functionFindHighestPoint(new THREE.Vector3(m_state.constants.turretPositionOffset + 0.5 * m_state.constants.turretPositionOffset * (Math.random() - 0.5), 0, -m_state.constants.turretPositionOffset - 0.5 * m_state.constants.turretPositionOffset * (Math.random() - 0.5)),
                        new THREE.Vector3(m_state.constants.turretPositionVariance, 0, m_state.constants.turretPositionVariance));
                    m_state.turrets[2].mesh.position.y += m_state.constants.turretFullyVisibleHeight;
                    context.scene.add(m_state.turrets[2].mesh);

                    // Find the best place for the fourth turret.
                    m_state.turrets.push(new Turret(self,
                        true));
                    m_state.turrets[3].mesh.scale.x = 5;
                    m_state.turrets[3].mesh.scale.y = 5;
                    m_state.turrets[3].mesh.scale.z = 5; 
    
                    m_state.turrets[3].mesh.position = m_functionFindHighestPoint(new THREE.Vector3(-m_state.constants.turretPositionOffset - 0.5 * m_state.constants.turretPositionOffset * (Math.random() - 0.5), 0, m_state.constants.turretPositionOffset + 0.5 * m_state.constants.turretPositionOffset * (Math.random() - 0.5)),
                        new THREE.Vector3(m_state.constants.turretPositionVariance, 0, m_state.constants.turretPositionVariance));
                    m_state.turrets[3].mesh.position.y += m_state.constants.turretFullyVisibleHeight;
                    context.scene.add(m_state.turrets[3].mesh);

                    // Add the meters for the user.
                    m_state.meters.main = new Meter(context.scene,
                        new THREE.Vector3(1, 22, 0),
                        0xaaaaaa,
                        1);
                    m_state.meters.cannon = new Meter(context.scene,
                        new THREE.Vector3(Math.cos(2 * Math.PI * (1/3)), 22, Math.sin(2 * Math.PI * (1/3))),
                        0x00ff00,
                        0);
                    m_state.meters.shield = new Meter(context.scene,
                        new THREE.Vector3(Math.cos(2 * Math.PI * (2/3)), 22, Math.sin(2 * Math.PI * (2/3))),
                        0x0000ff,
                        0);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Update application.
            self.update = function (context) {

                try {

                    // If the state is not ready (for whatever reason) just exit.
                    if (m_state.turrets.length < 2 ||
                        !context.keyboard ||
                        !m_state.perlinPlane ||
                        !m_state.meters.main ||
                        !m_state.meters.cannon ||
                        !m_state.meters.shield) {

                        return null;
                    }
       
                    var exceptionRet = null;
       
                    ///////////////////////
                    // Update the user first.
                    var turret = m_state.turrets[0];

                    // Handle keys.
                    if (context.keyboard.pressed("S")) {

                        if (m_state.fireButtonDownTime === null) {

                            // Save the time the fire button was pressed.
                            m_state.fireButtonDownTime = context.elapsed;
                        } else {

                            // Add power to the cannon, take power away from the main.
                            if (m_state.power.main > context.delta * m_state.constants.percentMainPowerCostPerSecondForCannon) {
   
                                m_state.power.cannon += context.delta * m_state.constants.percentPowerCannon;
                                if (m_state.power.cannon > 1) {
       
                                    m_state.power.cannon = 1;
                                }
                            }

                            // Adjust down the main power.
                            m_state.power.main -= context.delta * m_state.constants.percentMainPowerCostPerSecondForCannon;
                            if (m_state.power.main < 0) {
   
                                m_state.power.main = 0;
                            }
                        }
                    } else {

                        // If the key was just let up, then its time to fire
                        if (m_state.fireButtonDownTime !== null) {

                            // Key was let up: "Fire"!
                            exceptionRet = turret.fire(context,
                                m_state.power.cannon);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }

                            // Reset down time.
                            m_state.fireButtonDownTime = null;

                            // Reset cannon power.
                            m_state.power.cannon = 0;

                            // Play a sound!
                            self.audioContainer.play("PlayerFire");
                        }
                    }

                    // Turn counter-clockwise.
                    if (context.keyboard.pressed("D")) {

                        turret.barrelYaw -= m_state.constants.yawStep;
                        if (turret.barrelYaw < 0) {

                            turret.barrelYaw += 2.0 * Math.PI;
                        }
                    }
       
                    // Turn clockwise.
                    if (context.keyboard.pressed("A")) {
                    
                        turret.barrelYaw += m_state.constants.yawStep;
                        if (turret.barrelYaw >= 2.0 * Math.PI) {

                            turret.barrelYaw -= 2.0 * Math.PI;
                        }
                    }
       
                    // Pitch up.
                    if (context.keyboard.pressed("W")) {
                    
                        if (turret.barrelPitch < 1.2) {

                            turret.barrelPitch += m_state.constants.pitchStep;
                        }
                    }
       
                    // Pitch down.
                    if (context.keyboard.pressed("X")) {

                        if (turret.barrelPitch > -1.2) {

                            turret.barrelPitch -= m_state.constants.pitchStep;
                        }
                    }

                    // Adjust up the main power always a little bit.
                    m_state.power.main += context.delta * m_state.constants.percentMainPowerReplenishPerSecond;
                    if (m_state.power.main > 1) {
       
                        m_state.power.main = 1;
                    }

                    // Update the turret.
                    exceptionRet = turret.update(context);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    ///////////////////////
                    // Now, update the computers.
                    for (var i = 1; i < 4; i++) {
       
                        turret = m_state.turrets[i];

                        if (turret.isDead) {

                            continue;
                        }

                        // Spin the computer turret.
                        turret.barrelPitch = Math.sin(context.elapsed);
                        turret.barrelYaw = 6.28 * (context.elapsed - Math.floor(context.elapsed));

                        // Update the turret.
                        exceptionRet = turret.update(context);
                        if (exceptionRet !== null) {

                            throw exceptionRet;
                        }
       
                        // Occasionally fire
                        if (Math.random() < 0.05) {
       
                            // Fire.
                            exceptionRet = turret.fire(context,
                                0);
                            if (exceptionRet !== null) {

                                throw exceptionRet;
                            }
                            
                            // Play a sound!
                            self.audioContainer.play("ComputerFire");
                        }
                    }
   
                    // Update the meters.
                    exceptionRet = m_state.meters.main.update(context,
                        m_state.power.main);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                    exceptionRet = m_state.meters.cannon.update(context,
                        m_state.power.cannon);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }
                    exceptionRet = m_state.meters.shield.update(context,
                        m_state.power.shield);
                    if (exceptionRet !== null) {

                        throw exceptionRet;
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ////////////////////////////
            // Private methods.

            // Function finds the highest point in the given region.
            // Note: Only x and z of the start and range matter.
            var m_functionFindHighestPoint = function (v3Start,
                v3RangeSize,
                iIterations) {

                // Number of times to attempt.
                iIterations = iIterations || 10;

                // Start the highest in the very pits of hell!
                var v3Highest = new THREE.Vector3(0,
                    -Infinity,
                    0);

                // Try iIterations times to raise it up.
                for (var i = 0; i < iIterations; i++) {

                    // Generate a random position in the rectangle.
                    var v3Position = new THREE.Vector3(v3Start.x + v3RangeSize.x * Math.random() - v3RangeSize.x / 2,
                        0,
                        v3Start.z + v3RangeSize.z * Math.random() - v3RangeSize.z / 2);

                    // Get its y position from the unit and multiply back to world space.
                    v3Position.y = self.heightFromPosition(v3Position);

                    // Store the highest.
                    if (v3Position.y > v3Highest.y) {

                        v3Highest = v3Position;
                    }
                }

                // Return the highest.
                return v3Highest;
            }

            ////////////////////////////
            // Private fields.

            // Holds state for main object.
            var m_state = {

                constants: {

                    yawStep: 0.01,                     // Single change in yaw.
                    pitchStep: 0.071,                            // Single change in pitch.
                    turretPositionOffset: 16,                   // Quartic offset of turrets from world center.
                    turretPositionVariance: 4,                  // Variance in the placement of the turrets.
                    turretFullyVisibleHeight: 0.6,              // Height above the landscape.
                    percentMainPowerReplenishPerSecond: 0.02,   // The amount the main power goes up of its own accord every second.
                    percentMainPowerCostPerSecondForCannon: 0.1,// The amount of main power expended for powering up the cannon per second.
                    percentPowerCannon: 0.5                     // The percent of power added to cannon per second.
                },                          // Preset values for the game.
                text: {
       
                    title: null             // Title.
                },                          // The text items.
                perlinPlane: null,          // The ground.
                turrets: [],                // Collection of turrets.
                meters: {
       
                    main: null,             // The main meter.
                    cannon: null,           // The cannon meter.
                    shield: null,           // The shield meter.
                },                          // The user's meters.
                power: {
       
                    main: 1,                // Power.
                    cannon: 0,              // Cannon power.
                    shield: 0,              // Shield power.
                },                          // Playing values.
                fireButtonDownTime: null,   // The time the user last depressed the fire button.
                shieldButtonDownTime: null  // The time the user last depressed the shield button.
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
