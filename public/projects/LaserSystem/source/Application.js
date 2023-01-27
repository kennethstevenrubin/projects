////////////////////////////////////////
// Application object.
//
// Returns singelton.

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js",
    "/MithrilLib/three/ApplicationBase.js",
    "Cannon"],
    function (THREE,
        ApplicationBase,
        Cannon) {

        // Define Application class.
        var functionApplication = function Application() {

            var self = this;            // Uber closure.

            // Inherit from base class.
            self.inherits(ApplicationBase);

            self.camera.position = new THREE.Vector3(16,16,16);

            ////////////////////////////
            // Public methods.

            // Create application.
            self.create = function (context) {

                try {

                    context.cameraControls.noZoom = true;
                    context.cameraControls.noPan = true;

                    // Create text specifying project name.
                    m_state.cannon = new Cannon(context.scene);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Update application.
            self.update = function (context) {

                try {

                    // Rotate about all axes for no particular reason.
                    if (m_state.cannon !== null) {

                        exceptionRet = m_state.cannon.update(context);
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

                cannon: null            // .
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
