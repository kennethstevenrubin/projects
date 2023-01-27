///////////////////////////////////////
// TeletypeControl.
//
// Returns constructor function.
//

"use strict";

define(["/MithrilLib/system/prototypes.js"],
    function (prototypes) {

        // Define TeletypeControl constructor function.
        var functionRet = function TeletypeControl(optionsOverride) {

            var self = this;            // Uber-closure.

            //////////////////////////////////////
            // Public methods.

            // Method invoked to add a new line to the display.
            self.writeLine = function (strMessage) {

                try {

                    return null;
                } catch (e) {

                    return e;
                }
            };

            //////////////////////////////////////
            // Private methods.

            // Create instance of control.
            var m_functionCreate = function () {

                try {

                    // Get host.
                    m_jHost = $(m_options.host.selector);

                    // Get the size of the host.
                    m_dWidth = m_jHost.width();
                    m_dHeight = m_jHost.height();

                    // Create the render canvas.
                    m_jCanvas = $("<canvas tabindex='1'></canvas>");
                    m_canvasRender = m_jCanvas[0];
                    m_canvasRender.id = "Render" + Math.random().toString();
                    m_canvasRender.width = m_dWidth;
                    m_canvasRender.height = m_dHeight;
                    m_contextRender = m_canvasRender.getContext("2d");

                    // Add the canvas to the host.
                    m_jHost.append(m_canvasRender);

                    return m_functionRender();
                } catch (e) {

                    return e;
                }
            };

            // Render control.
            var m_functionRender = function () {

                try {

                    m_contextRender.fillStyle = m_options.fillBackground;
                    m_contextRender.fillRect(0, 0, m_dWidth, m_dHeight);

                    m_contextRender.fillStyle = m_options.fillText;
                    m_contextRender.font = m_options.font;
                    m_contextRender.textBaseline = "top";

                    m_contextRender.fillText("Hello World!", 0, 0);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            //////////////////////////////////////
            // Private event handlers.

            //////////////////////////////////////
            // Private fields.

            // Options object maintains drawing and runtime state.
            var m_options = {

                fillBackground: "Blue",
                fillText: "Yellow",
                font: "16px Lucida Console",
                host: {

                    selector: "#TeletypeControl"
                }
            };

            // Parent jQuery object.
            var m_jHost = null;
            // The jQuery canvas object.
            var m_jCanvas = null;
            // The main canvas object.
            var m_canvasRender = null;
            // The canvas's context object.
            var m_contextRender = null;
            // Width of parent element.
            var m_dWidth = null;
            // Height of parent element.
            var m_dHeight = null;

            // Inject overrides into options object.
            m_options.inject(optionsOverride);

            // Create object instance.
            var exceptionRet = m_functionCreate();
            if (exceptionRet !== null) {

                throw exceptionRet;
            }
        };

        return functionRet;
    });
