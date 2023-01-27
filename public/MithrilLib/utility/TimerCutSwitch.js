///////////////////////////////////////
// TimerCutSwitch raises an event when
// not interrupted.
//
// Returns function constructor.

"use strict";

define([],
    function () {

        // Constructor function is returned for this module.
        return function TimerCutSwitch(functionOnPause,
            dDelayMS) {

            var self = this;            // save closure.

            ///////////////////////////////////////
            // Public fields.

            self.payload = null;

            ///////////////////////////////////////
            // Public methods.

            self.tick = function (objectPayload) {

                try {

                    // Cancel existing timer.
                    if (m_dTimerCookie !== -1) {

                        clearTimeout(m_dTimerCookie);
                        m_dTimerCookie = -1;
                    }

                    // Set payload.
                    self.payload = objectPayload;

                    // Start a new timer.  If it hits, raise event.
                    m_dTimerCookie = setTimeout(m_functionTimerHit,
                        dDelayMS);

                    return null;
                } catch (e) {

                    return e;
                }
            };

            ///////////////////////////////////////
            // Private event handlers.

            // Function to handle timer hit.
            var m_functionTimerHit = function (e) {

                try {

                    // If a valid event is wired.
                    if (functionOnPause) {

                        // Raise the event, pass the current value from the input field.
                        functionOnPause(self.payload);
                    }
                } catch (e) {

                    alert(e.message);
                }
            };

            ///////////////////////////////////////
            // Private fields.

            // The timer cookie.
            var m_dTimerCookie = -1;
        };
    });
