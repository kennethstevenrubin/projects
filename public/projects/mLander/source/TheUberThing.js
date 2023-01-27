///////////////////////////////////////
// TheUberThing module.
//

"use strict";

define(["./Vector"],
    function (Vector) {

        try {

            // Define TheUberThing constructor function.
        	var functionRet = function TheUberThing() {

        		var self = this;

                self.spaceColor = "rgb(27,27,27)";
                self.backgroundColor = "rgb(127,127,127)";
                self.foregroundColor = "rgb(200,200,200)";
                self.platformFillColor = "rgb(200,200,165)";
                self.platformStrokeColor = "rgb(100,100,65)";
                self.landerFont = "Verdana";
                self.landerFontSize = 40;
                self.minSafeHeight = 100;
                self.landerColor = "rgb(100,100,215)";
                self.width = 800;
                self.height = 600;
                self.maxSafeLandingVelocityMagnitude = 10;
                self.maxSafeLandingOrientation = Math.PI / 50;
                self.havingBeenClicked = false;
                self.theSound = null;
                self.theExplodeSound = null;
                self.theLandSound = null;

                self.backgroundWidth = 2000;
                self.foregroundWidth = 10000;

                // Create and initialize this instance.
                self.create = function (strCanvasId) {

                    try {

                        // Default canvas selector.
                        if (!strCanvasId) {

                            strCanvasId = "Plum";
                        }

                        // Get the canvas.
                        m_jqCanvas = $("<canvas id='" +
                            strCanvasId +
                            "' width=800 height=600></canvas>");
                        $(document.body).append(m_jqCanvas);
                        m_canvas = m_jqCanvas[0];
                        m_context = m_canvas.getContext("2d");

                        // Allocate the background object.
                        var exceptionRet = m_functionAllocateBackground();
                        if (exceptionRet) {

                            throw exceptionRet;
                        }

                        // Allocate the foreground object.
                        exceptionRet = m_functionAllocateForeground();
                        if (exceptionRet) {

                            throw exceptionRet;
                        }

                        // Hook the event handlers.
                        m_jqCanvas.bind('mousemove', m_functionMouseMove);
                        m_jqCanvas[0].addEventListener('touchmove',m_functionMouseMove, true);

                        window.addEventListener("click", () => {

                            self.havingBeenClicked = true;
                        });

                        // Generate stars.
                        for (var i = 0; i < 1000; i++) {

                            m_arrayStars.push({

                                x: Math.random() * self.width,
                                y: Math.random() * self.height
                            });
                        }

                        // Start the render interval.
                        m_cookieRender = setInterval(m_functionRender,
                            self.renderInterval);

                        // Start up sound.
                        self.theSound = new Audio("media/engine2.mp3");
                        self.theSound.loop = true;
                        self.theSound.play();

                        self.theExplodeSound = new Audio("media/explode.mp3");;
                        self.theLandSound = new Audio("media/land.mp3");;

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // Stop and clean up this instance.
                self.destroy = function () {

                    try {

                        // Stop the render interval.
                        if (m_cookieRender) {

                            clearInterval(m_cookieRender);
                            m_cookieRender = null;
                        }

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                ////////////////////////
                // Private functions.

                // Method renders out instance.
                var m_functionRender = function () {

                    try {

                        // Fill background.
                        m_context.fillStyle = self.spaceColor;
                        m_context.fillRect(0,
                            0,
                            self.width,
                            self.height);

                        // Render the stars.
                        var exceptionRet = m_functionRenderStars();
                        if (exceptionRet) {

                            throw exceptionRet;
                        }

                        // Render the background object.
                        exceptionRet = m_functionRenderBackground();
                        if (exceptionRet) {

                            throw exceptionRet;
                        }

                        // Render the foreground object.
                        exceptionRet = m_functionRenderForeground();
                        if (exceptionRet) {

                            throw exceptionRet;
                        }

                        // Render the lander.
                        exceptionRet = m_functionRenderLander();
                        if (exceptionRet) {

                            throw exceptionRet;
                        }

                        // Adjust the vectors.
                        //m_vectorLanderCurrentThrust.addVector(m_vectorMouse);
                        m_context.textBaseline = "middle";
                        m_context.textAlign = "right";
                        m_context.font = "20px Arial";
                        m_context["font-weight"] = "900";
                        if (m_vectorLanderVelocity.magnitude < self.maxSafeLandingVelocityMagnitude) {

                            m_context.fillStyle = "rgb(0,168,0)";
                        } else {

                            m_context.fillStyle = "rgb(255,0,0)";
                        }
                        m_context.fillText(m_vectorLanderVelocity.magnitude.toFixed(2),
                            75,
                            self.height - 60);
                        if (Math.abs(m_vectorLanderCurrentThrust.theta - Math.PI / 2) < self.maxSafeLandingOrientation) {

                            m_context.fillStyle = "rgb(0,168,0)";
                        } else {

                            m_context.fillStyle = "rgb(255,0,0)";
                        }
                        m_context.fillText(Math.abs(m_vectorLanderCurrentThrust.theta - Math.PI / 2).toFixed(2),
                            75,
                            self.height - 40);
                        const dHeight = (600 - m_dLanderY) - m_arrayValues[Math.floor(m_dPositionX + 400)];
                        if (dHeight < self.minSafeHeight) {

                            m_context.fillStyle = "rgb(255,0,0)";
                        } else {

                            m_context.fillStyle = "rgb(0,168,0)";
                        }
                        m_context.fillText(Math.abs(dHeight).toFixed(2),
                            75,
                            self.height - 20);

                        // If never having been clicked, then show the opening credits.
                        if (!self.havingBeenClicked) {

                            m_context.textBaseline = "middle";
                            m_context.textAlign = "center";

                            m_context.fillStyle = "yellow";
                            m_context.font = "100px Verdana";
                            m_context.fillText("mLander",
                                self.width / 2,
                                self.height / 5);

                            m_context.fillStyle = "brown";
                            m_context.font = "48px Verdana";
                            m_context.fillText("an A&K Day Games production",
                                self.width / 2,
                                4 * self.height / 5);
                        }

                        m_vectorLanderCurrentThrust.setTheta(m_vectorMouse.theta);
                        m_vectorLanderCurrentThrust.setMagnitude(m_vectorMouse.magnitude / 40);

                        // Calculate net force vector for this frame.
                        var vectorForce = new Vector(-Math.PI / 2, m_dG);
                        vectorForce.addVector(m_vectorLanderCurrentThrust);
                        vectorForce.multiplyScalar(0.01);

                        m_vectorLanderVelocity.addVector(vectorForce);

                        if (m_vectorLanderVelocity.magnitude > 96) {

                            m_vectorLanderVelocity.setMagnitude(96);
                        }

                        // Update position from the lander velocity.
                        m_dPositionX += m_vectorLanderVelocity.x / 100;
                        m_dLanderY -= m_vectorLanderVelocity.y / 100;

                        // Check for position bounds.
                        if (m_dPositionX > self.foregroundWidth - self.width - 150) {

                            m_dPositionX = self.foregroundWidth - self.width - 150;
                        } else if (m_dPositionX < 0) {

                            m_dPositionX = 0;
                        }
                        if (m_dLanderY < 30) {

                            m_dLanderY = 30;
                            m_vectorLanderVelocity.multiplyScalar(0.99);
                        }

                        // Check for collision with ground.
                        if (m_arrayValues[Math.floor(m_dPositionX + 400)] > 600 - m_dLanderY) {

                            // Find platform or die!
                            var bPlatform = false;
                            for (var i = 0; i < m_arrayPlatforms.length; i++) {

                                var platformIth = m_arrayPlatforms[i];
                                var dDistance = Math.abs((m_dPositionX + 400) - (platformIth.x + 50));
                                if (dDistance < 40 &&
                                    m_vectorLanderVelocity.magnitude < self.maxSafeLandingVelocityMagnitude &&
                                    Math.abs(m_vectorLanderCurrentThrust.theta - Math.PI / 2) < self.maxSafeLandingOrientation) {

                                    bPlatform = true;
                                    break;
                                }
                            }
                            if (bPlatform) {

                                self.theLandSound.play();
                            } else {

                                self.theExplodeSound.play();
                            }
                            m_dPositionX = Math.floor(1000 + 8000 * Math.random());
                            m_dLanderY = 100;
                            m_vectorLanderVelocity = new Vector(0,0);
                        }

                        m_dTime += 0.005;
                    } catch (e) {

                        // Report.
                        alert(e.message);

                        // Stop instance.
                        self.destroy();
                    }
                };

                // .
                var m_functionAllocateBackground = function () {

                    try {

                        m_canvasBackground = $("<canvas width='" + self.backgroundWidth + "' height='600'></canvas>")[0];
                        var contextTemp = m_canvasBackground.getContext("2d");

                        var dSeed = 0;
                        var dMaximumDifferential = 1;
                        var arrayValues = [];
                        var dMax = -Infinity;
                        var dMin = Infinity;
                        for (var i = 0; i < self.backgroundWidth; i ++) {

                            arrayValues[i] = dSeed;
                            var dDifferential = Math.random() * dMaximumDifferential -
                                dMaximumDifferential / 2;
                            dSeed += dDifferential;
                            if (dSeed > dMax) {

                                dMax = dSeed;
                            }
                            if (dSeed < dMin) {

                                dMin = dSeed;
                            }
                        }
                        for (var i = 0; i < self.backgroundWidth; i ++) {

                            arrayValues[i] = (arrayValues[i] - dMin) / (dMax - dMin);
                        }
                        for (var i = 0; i < self.backgroundWidth; i ++) {

                            arrayValues[i] = arrayValues[i] * 250 + 300;
                        }

                        contextTemp.beginPath();
                        contextTemp.moveTo(self.backgroundWidth,
                            600);
                        contextTemp.lineTo(0,
                            600);
                        for (var i = 0; i < self.backgroundWidth; i += 20) {

                            contextTemp.lineTo(i,
                                600 - arrayValues[i]);
                        }
                        contextTemp.lineTo(self.backgroundWidth,
                            600);
                        contextTemp.closePath();
                        contextTemp.fillStyle = self.backgroundColor;
                        contextTemp.fill();

                        for (var i = 0; i < 40; i++) {

                            var dCenterX = self.backgroundWidth * Math.random();
                            var dCenterY = self.height * Math.random();
                            var dRadius = 10 + 30 * Math.random() * Math.random();

                            contextTemp.fillStyle = "black";
                            contextTemp.beginPath();
                            contextTemp.globalCompositeOperation = 'destination-out';
                                contextTemp.arc(dCenterX, dCenterY, dRadius, 0, Math.PI * 2, false);
                            contextTemp.fill();
                            contextTemp.globalCompositeOperation = "";
                        }

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // .
                var m_functionAllocateForeground = function () {

                    try {

                        m_canvasForeground = $("<canvas width='" + self.foregroundWidth + "' height='600'></canvas>")[0];
                        var contextTemp = m_canvasForeground.getContext("2d");

                        var dSeed = 0;
                        var dMaximumDifferential = 0.001;
                        m_arrayValues = [];
                        var dMax = -Infinity;
                        var dMin = Infinity;

                        var dTargetNumberOfPlatforms = 10;
                        var dPercentChancePerPixel = dTargetNumberOfPlatforms /
                            self.foregroundWidth;

                        for (var i = 0; i < self.foregroundWidth; i ++) {

                            // Possibly create a landing platform here.
                            if (Math.random() < dPercentChancePerPixel) {

                                m_arrayPlatforms.push({ x: i });
                                for (var j = 0; j < 100; j++) {

                                    m_arrayValues[i + j] = dSeed;
                                }

                                i += j;
                            }

                            m_arrayValues[i] = dSeed;
                            var dDifferential = Math.random() * dMaximumDifferential -
                                dMaximumDifferential / 2;
                            dSeed += dDifferential;
                            if (dSeed > dMax) {

                                dMax = dSeed;
                            }
                            if (dSeed < dMin) {

                                dMin = dSeed;
                            }
                        }
                        for (var i = 0; i < self.foregroundWidth; i ++) {

                            m_arrayValues[i] = (m_arrayValues[i] - dMin) / (dMax - dMin);
                        }
                        for (var i = 0; i < self.foregroundWidth; i ++) {

                            m_arrayValues[i] = m_arrayValues[i] * 450;
                        }

                        // Set the height for all the platforms.
                        for (var i = 0; i < m_arrayPlatforms.length; i++) {

                            m_arrayPlatforms[i].y = 600 - m_arrayValues[m_arrayPlatforms[i].x];
                        }

                        contextTemp.beginPath();
                        contextTemp.moveTo(self.foregroundWidth,
                            600);
                        contextTemp.lineTo(0,
                            600);
                        for (var i = 0; i < self.foregroundWidth; i += 4) {

                            contextTemp.lineTo(i,
                                600 - m_arrayValues[i]);
                        }
                        contextTemp.lineTo(self.foregroundWidth,
                            600);
                        contextTemp.closePath();
                        contextTemp.fillStyle = self.foregroundColor;
                        contextTemp.fill();
                        contextTemp.strokeStyle = "black";
                        contextTemp.stroke();

                        // Render the craters.
                        for (var i = 0; i < 100; i++) {

                            var dCenterX = self.foregroundWidth * Math.random();
                            var dCenterY = self.height * Math.random();
                            var dRadius = 10 + 30 * Math.random() * Math.random();

                            contextTemp.fillStyle = "black";
                            contextTemp.beginPath();
                            contextTemp.globalCompositeOperation = 'destination-out';
                                contextTemp.arc(dCenterX, dCenterY, dRadius, 0, Math.PI * 2, false);
                            contextTemp.fill();
                            contextTemp.globalCompositeOperation = "source-over";
                        }

                        // Render the platforms.
                        contextTemp.fillStyle = self.platformFillColor;
                        contextTemp.strokeStyle = "black";
                        for (var i = 0; i < m_arrayPlatforms.length; i++) {

                            var dX = m_arrayPlatforms[i].x;
                            var dY = m_arrayPlatforms[i].y;

                            contextTemp.fillRect(dX,
                                dY,
                                100,
                                10);
                            contextTemp.strokeRect(dX,
                                dY,
                                100,
                                10);
                        }

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // .
                var m_functionRenderBackground = function () {

                    try {

                        // m_iPositionX = [0..foregroundWidth - width]
                        var dPositionXPercent = m_dPositionX / (self.foregroundWidth - self.width);

                        // Useable width = backgroundWidth - width.
                        var dUseableWidth = self.backgroundWidth - self.width;

                        var dScrollOver = dPositionXPercent * dUseableWidth;

                        m_context.drawImage(m_canvasBackground,
                            Math.floor(dScrollOver),
                            0,
                            800,
                            600,
                            0,
                            0,
                            800,
                            600);

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // .
                var m_functionRenderStars = function () {

                    try {

                        m_context.strokeStyle = "rgb(220,220,255)";
                        m_context.beginPath();
                        for (var i = 0; i < m_arrayStars.length; i++) {

                            var starIth = m_arrayStars[i];
                            m_context.moveTo(starIth.x, starIth.y);
                            m_context.lineTo(starIth.x, starIth.y + 1);
                        }
                        m_context.stroke();
                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // .
                var m_functionRenderForeground = function () {

                    try {

                        m_context.drawImage(m_canvasForeground,
                            Math.floor(m_dPositionX),
                            0,
                            800,
                            600,
                            0,
                            0,
                            800,
                            600);

                        return null;
                    } catch (e) {

                        return e;
                    }
                };

                // .
                var m_functionRenderLander = function () {

                    try {

                        m_context.save();

                        // Show lander.
                        m_context.translate(self.width / 2,
                            m_dLanderY);
                        m_context.rotate(Math.PI / 2 - m_vectorLanderCurrentThrust.theta);

                        m_context.textBaseline = "alphabetic";
                        m_context.textAlign = "center";
                        m_context.font = self.landerFontSize + "px " + self.landerFont;
                        m_context.fillStyle = self.landerColor;
                        m_context.fillText("&",
                            0,0);

                        // Show thrust.
                        m_context.rotate(Math.PI);
                        m_context.strokeStyle = "red";
                        m_context.beginPath();
                        m_context.lineWidth = 3;
                        m_context.moveTo(-5, 0);
                        m_context.lineTo(0, -m_vectorLanderCurrentThrust.magnitude);
                        m_context.lineTo(5, 0);
                        m_context.stroke();

                        self.theSound.volume = Math.abs(m_vectorLanderCurrentThrust.magnitude) / 20;

                        return null;
                    } catch (e) {

                        return e;
                    } finally {

                        m_context.restore();
                    }
                };

                // .
                var m_functionMouseMove = function(e) {

                    self.havingBeenClicked = true;

                    e.preventDefault();

                    var x = e.clientX - (self.width / 2);
                    var y = (self.height) - e.clientY;
                    if (e.touches) {

                        x = e.touches[0].clientX - (self.width / 2);
                        y = (self.height) - e.touches[0].clientY;
                    }

                    m_vectorMouse = new Vector(Math.atan2(y, x),
                        Math.sqrt(x*x + y*y));
                };

                ////////////////////////
                // Private fields.

                // The target canvas jQuery object.
                var m_jqCanvas = null;
                // The target canvas object.
                var m_canvas = null;
                // The rendering context, gotten from the canvas.
                var m_context = null;
                // Render timer cookie.
                var m_cookieRender = null;
                // Holds the entire background canvas.
                var m_canvasBackground = null;
                // Holds the entire foreground canvas.
                var m_canvasForeground = null;
                // The x-coordinate of the background.
                var m_dPositionX = 5000;
                // Hold collection of viable landing platforms.
                var m_arrayPlatforms = [];
                // The current thrust of the lander.
                var m_vectorLanderCurrentThrust = new Vector(Math.PI / 2, 17);
                // Y-coordinate of lander.
                var m_dLanderY = 100;
                // Heights of the ground.
                var m_arrayValues = [];
                // The lander's net force.
                var m_vectorLanderVelocity = new Vector(0, 0);
                // Downward force of gravity.
                var m_dG = 10;
                // Arbitrary counter.
                var m_dTime = 0;
        	    // MouseDown state
                var m_bMouseDown = false;
                // MouseOffset from Canvas center
                var m_vectorMouse = new Vector(0.0, 0.0);
                // .
                var m_arrayStars = [];
            };

            // Return constructor function as require module object.
        	return functionRet;
        } catch (e) {

            alert(e.message);
        }
    });
