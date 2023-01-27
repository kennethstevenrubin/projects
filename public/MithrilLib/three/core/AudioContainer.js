////////////////////////////////////////
// AudioContiner offers a highly available sound service.

"use strict";

// Define AMD module.
define([],
    function () {

        // Define AudioContainer constructor function.
        var functionAudioContainer = function AudioContainer() {

            var self = this;            // Uber closure.

            ////////////////////////////
            // Public methods.

            self.background = function (resouceURL, volume) {

                try {

                    m_state.background = new Audio();
                    m_state.background.src = resouceURL;
                    m_state.background.loop = true;
                    if (volume) {

                        m_state.background.volume = volume;
                    }

                    m_state.background.addEventListener('loadeddata', () => {

                        m_state.background.play();
                    });

                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Call play and pause.
            self.createLoopSound = function (resourceURL, volume) {

                try {

                    const retVal = new Audio(resourceURL);
                    retVal.loop = true;
                    if (volume) {

                        retVal.volume = volume;
                    }

                    return retVal;
                } catch (e) {

                    return e;
                }
            };

            // Update the engine.
            self.load = function (name, resourceURL, multiplicity, volume) {

                try {

                    for (var i = 0; i < multiplicity; i++) {

                        const audioNew = new Audio();
                        audioNew.src = resourceURL; //"/media/wav/mixkit-quick-ninja-strike-2146.wav";
                        if (volume) {

                            audioNew.volume = volume;
                        }

                        let container = m_state.buffers[name];
                        if (!container) {

                            m_state.buffers[name] = [audioNew];
                            container = m_state.buffers[name];
                        } else {

                            container.push(audioNew);
                        }
                        audioNew.onended = (event) => { 

                            container.push(audioNew);
                        };
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            };

            self.play = function (name) {

                try {

                    const container = m_state.buffers[name];
                    if (container) {

                        const audioToPlay = container.pop();
                        if (audioToPlay) {

                            audioToPlay.play();
                        }
                    }

                    return null;
                } catch (e) {

                    return e;
                }
            }

            ////////////////////////////
            // Private fields.

            // The state of the collection.
            var m_state = {

                buffers: {},
                pauseResumes: {},
                background: null
            };
        };

        // Return constructor function.
        return functionAudioContainer;
    });