////////////////////////////////////////
// Application object.
//
// Returns singelton.

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js",
    "/MithrilLib/three/ApplicationBase.js",
    "/MithrilLib/three/Text.js",
    "IonExhaustSystem"],
    function (THREE,
        ApplicationBase,
        Text,
        IonExhaustSystem) {

        // Define Application class.
        var functionApplication = function Application() {

            var self = this;            // Uber closure.

            // Inherit from base class.
            self.inherits(ApplicationBase);

            ////////////////////////////
            // Public properties.

            self.camera.position = new THREE.Vector3(16,
                16,
                16);

            ////////////////////////////
            // Public methods.

            // Create application.
            self.create = function (context) {

                try {

                    context.cameraControls.enabled = true;
                    context.cameraControls.dynamicDampingFactor = 0.2;
                    context.cameraControls.noZoom = true;
                    context.cameraControls.noPan = true;
        
                    // Create text specifying project name.
                    m_state.ionExhaustSystem = new IonExhaustSystem(context.scene);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Update application.
            self.update = function (context) {

                try {

                    // Rotate about all axes for no particular reason.
                    if (m_state.ionExhaustSystem !== null) {

                        var exceptionRet = m_state.ionExhaustSystem.update(context);
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
