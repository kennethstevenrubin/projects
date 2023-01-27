////////////////////////////////////////
// Application object.
//
// Returns singelton.

"use strict";

const INITIAL_NUMBER_OF_ASTEROIDS = 10;

// Define AMD module.
define(["/MithrilLib/three/core/three.js",
    "/MithrilLib/three/core/KeyboardState.js",
    "/MithrilLib/three/ApplicationBase.js",
    "/MithrilLib/three/Paragraph.js",
    "/MithrilLib/three/Model.js",
    "IonExhaustSystem",
    "PlasmaExplosion",
    "LaserCannon",
    "HelpText"],
    function (THREE,
        KeyboardState,
        ApplicationBase,
        Paragraph,
        Model,
        IonExhaustSystem,
        PlasmaExplosion,
        LaserCannon,
        HelpText) {

        // Define Application class.
        var functionApplication = function Application() {

            var self = this;            // Uber closure.

            // Inherit from base class.
            self.inherits(ApplicationBase);

            self.skybox = {

                enabled: true,
                prefix: "/media/",
                top: "Stars.png",
                bottom: "Stars.png",
                left: "Stars.png",
                right: "Stars.png",
                front: "Stars.png",
                back: "Stars.png",
                size: 10000
            };
            self.camera.position = new THREE.Vector3(640,
                0,
                6400);
            self.camera.controls.dynamicDampingFactor = 0.2;

            self.axis.enabled = false;

            // Player's ship orientation.
            self.theta = 0;
            self.phi = 0;
            self.thrust = 0;

            self.audioContainer.background(`/media/wav/mixkit-asteroid-space-atmosphere-2004.wav`);

            ////////////////////////////
            // Public methods.

            self.createAsteroid = function (context) {

                var model = new Model(context.scene,
                    "projects/Asteroids",
                    "/source/asteriod.js",
                    "/phobosmirror.jpg");
                var dScale = 30 + Math.random() * 80;
                model.radius = dScale;
                model.setScale(new THREE.Vector3(dScale,
                    dScale,
                    dScale));
                model.setPosition(new THREE.Vector3((Math.random() > 0.5 ? 1300 * Math.random() + 200 : -1300 * Math.random() - 200) ,
                    (Math.random() > 0.5 ? 1300 * Math.random() + 200 : -1300 * Math.random() - 200),
                    (Math.random() > 0.5 ? 1300 * Math.random() + 200 : -1300 * Math.random() - 200)));
                model.velocity = new THREE.Vector3(500 * Math.random() - 250,
                    500 * Math.random() - 250,
                    500 * Math.random() - 250);
                model.rotationVelocity = new THREE.Vector3(3 * Math.random() - 1.5,
                    3 * Math.random() - 1.5,
                    3 * Math.random() - 1.5);
                m_state.models.push(model);
            };

            // Create application.
            self.create = function (context) {

                try {

                    self.shipThrust = application.audioContainer.createLoopSound(`/media/wav/mixkit-tank-engine-working-2753.wav`, 0.75);
                    self.fireButtonDown = application.audioContainer.createLoopSound(`/media/wav/mixkit-security-facility-breach-alarm-994.wav`, 0.25);
                    application.audioContainer.load("IonExplosion",
                        "/media/wav/mixkit-arcade-game-explosion-echo-1698.wav",
                        10,
                        0.25);
                    application.audioContainer.load("AsteroidExplosion",
                        "/media/wav/mixkit-explosion-and-glass-debris-1701.wav",
                        10);
                    application.audioContainer.load("ShipExplosion",
                        "/media/wav/mixkit-player-losing-or-failing-2042.wav",
                        10);
                    application.audioContainer.load("GameOver",
                        "/media/wav/mixkit-retro-game-over-1947.wav",
                        10);

                    // Disallow everything but y-rotation on the camera controls object.
                    //context.cameraControls.fixedYRotate = true;
                    context.cameraControls.noZoom = true;
                    context.cameraControls.noPan = true;

                    // Allocate the new light.
                    var light = new THREE.DirectionalLight();
                    light.position = new THREE.Vector3(0, 0, 10);
                    light.color = new THREE.Color(0xaaaaFF);
                    light.intensity = 0.6;
                    context.scene.add(light);

                    // Create text specifying project name.
                    m_state.text = new Paragraph(context.scene,
                        "Asteroids",    // Text to build.
                        new THREE.Vector3(0, 1450, 0));
                    m_state.text.mesh.scale = new THREE.Vector3(50,
                        50,
                        50);

                    // Create text specifying lives.
                    m_state.livesText = new Paragraph(context.scene,
                        "lives: 5",     // Text to build.
                        new THREE.Vector3(-250, -1450, 0));
                    m_state.livesText.mesh.scale = new THREE.Vector3(50,
                        50,
                        50);

                    // Create text specifying score.
                    m_state.scoreText = new Paragraph(context.scene,
                        "score: 0",     // Text to build.
                        new THREE.Vector3(250, -1450, 0));
                    m_state.scoreText.mesh.scale = new THREE.Vector3(50,
                        50,
                        50);

                    // Create asteriods.
                    for (var i = 0; i < INITIAL_NUMBER_OF_ASTEROIDS; i++) {

                        self.createAsteroid(context);
                    }

                    // Create the player's ship
                    m_state.ship = new Model(context.scene,
                        "projects/Asteroids",
                        "/source/ship.js",
                        "/checkerboard.png",
                        function () {

                            // Create text specifying project name.
                            m_state.ionExhaustSystem = new IonExhaustSystem(m_state.ship.mesh);
                            m_state.ionExhaustSystem.particles.scale = new THREE.Vector3(1,
                                self.thrust + 0.2,
                                1);
                        });
                    // Translate the geometry.
                    m_state.ship.setGeometryTranslationMatrix(new THREE.Matrix4().translate(new THREE.Vector3(1.03,
                        -0.77,
                        0.07)));
                    m_state.ship.setScale(new THREE.Vector3(40,
                        40,
                        40));

                    var geometryFrame = new THREE.CubeGeometry(3000,3000,3000);
                    var materialFrame = new THREE.MeshNormalMaterial({
                        
                        wireframe: true
                    });
                    m_state.frame = new THREE.Mesh(geometryFrame,
                        materialFrame);
                    context.scene.add(m_state.frame);

                    require(["/MithrilLib/three/Skybox.js"],
                        function (Skybox) {

                            m_state.innerSkybox = new Skybox(context,
                                "/media/",
                                "grid.png",
                                "grid.png",
                                "grid.png",
                                "grid.png",
                                "grid.png",
                                "grid.png",
                                3000,
                                true);
                        });

                    m_state.helpText = new HelpText(context.scene);
                    m_state.helpText.mesh.scale = new THREE.Vector3(25,25,25);
                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Update application.
            self.update = function (context) {

                try {

                    var dDelta = context.delta;
                    var dMoveDistance = 200 * dDelta;            // 200 pixels per second.
                    var dRotateAngle = Math.PI / 2 * dDelta;     // pi/2 radians (90 degrees) per second.

                    // Position ship?
                    var bQPressed = false;
                    if (context.keyboard &&
                        m_state.ship) {

                        if (context.keyboard.pressed("Q") |
                            context.keyboard.pressed("A") |
                            context.keyboard.pressed("D") |
                            context.keyboard.pressed("W") |
                            context.keyboard.pressed("X") |
                            context.keyboard.pressed("S")) {

                            // Clear out the help text, if first time through.
                            if (m_state.helpText) {

                                context.scene.remove(m_state.helpText.paragraphIntro.mesh);
                                context.scene.remove(m_state.helpText.paragraphStory.mesh);
                                context.scene.remove(m_state.helpText.paragraphHelp.mesh);
                                m_state.helpText = null;
                            }

                            if (context.keyboard.pressed("Q")) {

                                // Can't do anything else while firing.
                                bQPressed = true;

                                // Either this is the first call...
                                if (m_state.laserCannon === null) {

                                    self.fireButtonDown.play();

                                    if (m_state.laserCannonStore === null) {

                                        m_state.laserCannon = new LaserCannon(m_state.ship.mesh);
                                        m_state.laserCannon.mesh.translateY(2.5);
                                        m_state.laserCannon.mesh.scale = new THREE.Vector3(2, 2, 2);
                                        m_state.laserCannonStore = m_state.laserCannon;
                                    } else {

                                        m_state.laserCannon = m_state.laserCannonStore;
                                        m_state.laserCannon.mesh.position = new THREE.Vector3(0, 2.5, 0);
                                        m_state.ship.mesh.add(m_state.laserCannon.mesh);
                                    }
                                } else {

                                    // ...or, the key is held down.
                                    m_state.laserCannon.mesh.translateY(0.5);
                                }
                            } else {

                                if (context.keyboard.pressed("A")) {

                                    self.theta += dRotateAngle;
                                    if (self.theta > 2 * Math.PI) {

                                        self.theta -= 2 * Math.PI;
                                    }
                                }
                                if (context.keyboard.pressed("D")) {

                                    self.theta -= dRotateAngle;
                                    if (self.theta < 0) {

                                        self.theta += 2 * Math.PI;
                                    }
                                }
                                if (context.keyboard.pressed("W")) {

                                    self.phi += dRotateAngle;
                                    if (self.phi > Math.PI) {

                                        self.phi -= 2 * Math.PI;
                                    }
                                }
                                if (context.keyboard.pressed("X")) {

                                    self.phi -= dRotateAngle;
                                    if (self.phi < -Math.PI) {

                                        self.phi += 2 * Math.PI;
                                    }
                                }
                                if (context.keyboard.pressed("S")) {

                                    self.shipThrust.play();
                                    self.thrust += 0.08;
                                }
                            }

                            m_state.ship.mesh.matrix = new THREE.Matrix4().makeRotationY(self.theta).multiply(
                                new THREE.Matrix4().makeRotationZ(self.phi));
                            m_state.ship.mesh.rotation.setEulerFromRotationMatrix(m_state.ship.mesh.matrix);
                        } else {

                            self.shipThrust.pause();
                        }

                        // Propel forward along the Y-axis if thrust.
                        if (self.thrust > 0) {

                            m_state.ship.mesh.translateY(self.thrust * dMoveDistance);
                            self.thrust *= 0.99;

                            m_state.ionExhaustSystem.particles.scale = new THREE.Vector3(1,
                                self.thrust + 0.2,
                                1);

                            if (m_state.ship.mesh.position.x > 1500) {

                                m_state.ship.mesh.position.x -= 3000;
                            }
                            if (m_state.ship.mesh.position.y > 1500) {

                                m_state.ship.mesh.position.y -= 3000;
                            }
                            if (m_state.ship.mesh.position.z > 1500) {

                                m_state.ship.mesh.position.z -= 3000;
                            }
                            if (m_state.ship.mesh.position.x < -1500) {

                                m_state.ship.mesh.position.x += 3000;
                            }
                            if (m_state.ship.mesh.position.y < -1500) {

                                m_state.ship.mesh.position.y += 3000;
                            }
                            if (m_state.ship.mesh.position.z < -1500) {

                                m_state.ship.mesh.position.z += 3000;
                            }
                        }
                    }

                    // Remove when expired.
                    if (m_state.plasmaExplosion &&
                        m_state.plasmaExplosion.expiration < context.elapsed) {

                        m_state.plasmaExplosion.destroy(context.scene);
                        m_state.plasmaExplosion = null;
                    }
                    if (m_state.plasmaExplosion) {

                        m_state.plasmaExplosion.update(context);
                    }

                    // If laserCannon and not q pressed, explode the cannon.
                    if (m_state.laserCannon !== null &&
                        bQPressed === false) {

                        self.fireButtonDown.pause();

                        if (m_state.plasmaExplosion) {

                            m_state.plasmaExplosion.destroy(context.scene);
                            m_state.plasmaExplosion = null;
                        }

                        m_state.plasmaExplosion = new PlasmaExplosion(context.scene,
                            Math.floor(m_state.laserCannon.mesh.position.y * m_state.laserCannon.mesh.position.y / 4) + 1);
                        var position = m_state.laserCannon.mesh.matrixWorld.multiplyVector3( new THREE.Vector3());
                        m_state.plasmaExplosion.setPosition(position);
                        m_state.plasmaExplosion.expiration = context.elapsed + 0.2;

                        application.audioContainer.play("IonExplosion");

                        // Loop over all asteriods.  If close enough, then destroy them and augment score.
                        const blastRadius = m_state.plasmaExplosion.systemSize;
                        for (var i = 0; i < m_state.models.length; i++) {

                            var model = m_state.models[i];
                            if (model.mesh === undefined ||
                                model.mesh === null) {
    
                                continue;
                            }

                            const distance = model.getPosition().distanceTo(m_state.plasmaExplosion.mesh.position);
                            if (distance < blastRadius) {

                                // blow up the asteroid.
                                m_state.score ++;
                                m_state.models = m_state.models.filter((modelTest) => { return modelTest !== model});
                                model.destroy();

                                application.audioContainer.play("AsteroidExplosion");

                                if (m_state.scoreText) {

                                    m_state.scoreText.destroy();
                                }
                                m_state.scoreText = new Paragraph(context.scene,
                                    `score: ${m_state.score}`,     // Text to build.
                                    new THREE.Vector3(250, -1450, 0));
                                m_state.scoreText.mesh.scale = new THREE.Vector3(50,
                                    50,
                                    50);            
                            }
                        }

                        m_state.ship.mesh.remove(m_state.laserCannon.mesh);
                        m_state.laserCannon = null;
                    }

                    // Rotate text meshes about their Y-axis.
                    if (m_state.livesText !== null) {

                        m_state.livesText.mesh.rotation = new THREE.Vector3(0,
                            -context.elapsed / 2,
                            0);
                    }
                    if (m_state.scoreText !== null) {

                        m_state.scoreText.mesh.rotation = new THREE.Vector3(0,
                            -context.elapsed / 2,
                            0);
                    }

                    if (m_state.ship &&
                        m_state.ship.mesh &&
                        !m_state.laserCannon) {

                        if (self.phi < Math.PI / 2) {

                            self.phi += (Math.PI / 2 - self.phi) / 30;
                            m_state.ship.mesh.matrix = new THREE.Matrix4().makeRotationY(self.theta).multiply(
                                new THREE.Matrix4().makeRotationZ(self.phi));
                            m_state.ship.mesh.rotation.setEulerFromRotationMatrix(m_state.ship.mesh.matrix);
                        } else if (self.phi > Math.PI / 2) {

                            self.phi -= (self.phi - Math.PI / 2) / 30;
                            m_state.ship.mesh.matrix = new THREE.Matrix4().makeRotationY(self.theta).multiply(
                                new THREE.Matrix4().makeRotationZ(self.phi));
                            m_state.ship.mesh.rotation.setEulerFromRotationMatrix(m_state.ship.mesh.matrix);
                        }
                    }

                    // One in twenty...create a roid.
                    if (Math.random() > 0.995) {

                        self.createAsteroid(context);
                    }

                    // Update asteriod positions and rotations.
                    for (var i = 0; i < m_state.models.length; i++) {

                        var model = m_state.models[i];
                        if (model.mesh === undefined ||
                            model.mesh === null) {

                            continue;
                        }

                        var v3Rotation = new THREE.Vector3(model.mesh.rotation.x,
                            model.mesh.rotation.y,
                            model.mesh.rotation.z);

                        model.setRotation(new THREE.Vector3(v3Rotation.x + model.rotationVelocity.x * dDelta,
                            v3Rotation.y + model.rotationVelocity.y * dDelta,
                            v3Rotation.z + model.rotationVelocity.z * dDelta));
                        var v3Position = model.mesh.position;

                        var v3Ship = new THREE.Vector3(0, 0, 0);
                        if (m_state.ship &&
                            m_state.ship.mesh &&
                            m_state.ship.mesh.position) {

                            // Calculate the distance and direction towards the ship.

                            // Calculate distance from ship.
                            var dDX = m_state.ship.mesh.position.x - v3Position.x;
                            var dDY = m_state.ship.mesh.position.y - v3Position.y;
                            var dDZ = m_state.ship.mesh.position.z - v3Position.z;
                            var dDistance = Math.sqrt(dDX * dDX + dDY * dDY + dDZ * dDZ);

                            // Make a unit vector point towards the ship.
                            v3Ship = new THREE.Vector3(m_state.ship.mesh.position.x - v3Position.x,
                                m_state.ship.mesh.position.y - v3Position.y,
                                m_state.ship.mesh.position.z - v3Position.z);
                            v3Ship = v3Ship.normalize();

                            // Convert to "force".
                            v3Ship.multiplyScalar(0.5 * model.radius * model.radius / dDistance);

                            model.velocity.x += (v3Ship.x);
                            model.velocity.y += (v3Ship.y);
                            model.velocity.z += (v3Ship.z);
                        }

                        // Compose aggregate velocity vector.
                        var v3Velocity = new THREE.Vector3(model.velocity.x,
                            model.velocity.y,
                            model.velocity.z);

                        if (v3Velocity.length() > 100) {

                            v3Velocity = v3Velocity.normalize().multiplyScalar(100);
                        }

                        // Scale down for the minute time slice given.
                        v3Velocity.multiplyScalar(dDelta);

                        // Update position.
                        v3Position.add(v3Velocity);

                        // Do bounds check.
                        if (v3Position.x > 1500) {

                            v3Position.x -= 3000;
                        }
                        else if (v3Position.x < -1500) {

                            v3Position.x += 3000;
                        }
                        if (v3Position.y > 1500) {

                            v3Position.y -= 3000;
                        }
                        else if (v3Position.y < -1500) {

                            v3Position.y += 3000;
                        }
                        if (v3Position.z > 1500) {

                            v3Position.z -= 3000;
                        }
                        else if (v3Position.z < -1500) {

                            v3Position.z += 3000;
                        }

                        model.setPosition(v3Position);

                        // Check distance from ship.  If less than ship radius, then explosion.
                        if (m_state.ship && 
                            m_state.ship.mesh && 
                            model &&
                            model.mesh &&
                            model.mesh.position.distanceTo(m_state.ship.mesh.position) < 100) {

                            // blow up the ship.
                            m_state.lives --;
                            if (m_state.lives === 0) {

                                application.audioContainer.play("GameOver");
                                m_state.score = 0;
                                m_state.lives = 5;

                                if (m_state.scoreText) {

                                    m_state.scoreText.destroy();
                                }
                                m_state.scoreText = new Paragraph(context.scene,
                                    `score: ${m_state.score}`,     // Text to build.
                                    new THREE.Vector3(250, -1450, 0));
                                m_state.scoreText.mesh.scale = new THREE.Vector3(50,
                                    50,
                                    50);            
                            }

                            if (m_state.livesText) {

                                m_state.livesText.destroy();
                            }
                            m_state.livesText = new Paragraph(context.scene,
                                `lives: ${m_state.lives}`,     // Text to build.
                                new THREE.Vector3(-250, -1450, 0));
                            m_state.livesText.mesh.scale = new THREE.Vector3(50,
                                50,
                                50);


                            application.audioContainer.play("ShipExplosion");

                            // Clear out all the asteroids.
                            for (var i = 0; i < m_state.models.length; i++) {

                                m_state.models[i].destroy();
                            }
                            m_state.models = [];

                            for (var i = 0; i < INITIAL_NUMBER_OF_ASTEROIDS; i++) {

                                self.createAsteroid(context);
                            }

                            // Move ship to center.
                            m_state.ship.mesh.position.x = 0;
                            m_state.ship.mesh.position.y = 0;
                            m_state.ship.mesh.position.z = 0;
                        }
                    }

                    // Rotate about all axes for no particular reason.
                    if (m_state.ionExhaustSystem !== null) {

                        var exceptionRet = m_state.ionExhaustSystem.update(context);
                        if (exceptionRet !== null) {

                            return exceptionRet;
                        }
                    }

                    if (m_state.laserCannon) {

                        exceptionRet = m_state.laserCannon.update(context);
                        if (exceptionRet !== null) {

                            return exceptionRet;
                        }
                    }

                    if (m_state.helpText) {

                        exceptionRet = m_state.helpText.update(context);
                        if (exceptionRet !== null) {

                            return exceptionRet;
                        }
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

                models: [],             // Collection of Models.
                ship: null,             // Player ship.
                frame: null,            // Playing area frame.
                bombs: [],              // Player's bombs.
                text: null,             // Text.
                laserCannon: null,
                laserCannonStore: null,
                score: 0,               // Text.
                helpText: null,
                innerSkybox: null,
                scoreText: null,        // Text.
                lives: 5,               // Text.
                livesText: null,        // Text.
                ionExhaustSystem: null  // IonExhaustSystem.
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
