///////////////////////////////////////
// TheUberThing module.
//

const OPEN_SPACE_DISTANCE = 100;
const SHIP_RADIUS = 34;
const SHIP_PLACEMENT_PAUSE = 2000;
const NUMBER_OF_STARS = 1000;

class TheUberThing {

    constructor(arrayRenderables) {

        this.renderables = arrayRenderables;
        this.renderables.forEach((objectRenderable) => {

            objectRenderable.tut = this;
        });
    }

    create() {

        try {

            let exceptionRet = this.doTheDOMInjection();
            if (exceptionRet) {

                return exceptionRet;
            }

            exceptionRet = this.createStarField();
            if (exceptionRet) {

                return exceptionRet;
            }

            exceptionRet = this.startYourEngines();
            if (exceptionRet) {

                return exceptionRet;
            }

            // Put us into a state of not having placed the ship.
            this.notHavingPlacedTheShip = true;
            this.notHavingTypedAKey = true;

            // Attach keyboard handling events.
            this.keyDownHandler = this.onKeyDown.bind(this);
            window.addEventListener("keydown", 
                this.keyDownHandler);
            this.keyUpHandler = this.onKeyUp.bind(this);
            window.addEventListener("keyup", 
                this.keyUpHandler);

            return null;
        } catch (x) {

            return x;
        }
    }

    onKeyDown(e) {

        try {

            if (this.notHavingTypedAKey) {


                // Start the theme music.
                let a = new Audio("media/background.mp3");
                a.volume = 0.01;
                a.loop = true;
                a.play();
            }
            this.notHavingTypedAKey = false;
          
            if (e.key === "ArrowDown") {

                this.downArrowDown = true;
            } else if (e.key === "ArrowUp") {

                this.upArrowDown = true;
            } else if (e.key === "ArrowRight") {

                this.rightArrowDown = true;
            } else if (e.key === "ArrowLeft") {

                this.leftArrowDown = true;
            } else if (e.key === " ") {

                this.spaceDown = true;
            }
        } catch (x) {

            alert(x.message);
        }
    }

    onKeyUp(e) {

        try {

            if (e.key === "ArrowDown") {

                this.downArrowDown = false;
            } else if (e.key === "ArrowUp") {

                this.upArrowDown = false;
            } else if (e.key === "ArrowRight") {

                this.rightArrowDown = false;
            } else if (e.key === "ArrowLeft") {

                this.leftArrowDown = false;
            } else if (e.key === " ") {

                this.spaceDown = false;
            }
        } catch (x) {

            alert(x.message);
        }
    }

    createStarField() {

        try {

            this.starTime = (new Date()).getTime();
            this.stars = [];
            for (let i = 0; i < NUMBER_OF_STARS; i++) {

                this.stars.push({

                    position: new Vector(Math.random() * window.innerWidth,
                        Math.random() * window.innerHeight),
                    brightnessPhase: Math.random() * Math.PI * 2,
                    brightnessFrequency: 9000 * Math.random() + 1000,
                    brightnessAmplitude: Math.random(),
                    radius: Math.pow(Math.random(), 15) * 5 + 1,
                    colorIndex: Math.floor(Math.random() * 3)
                });
            }
            return null;
        } catch (x) {

            return x;
        }
    }

    remove(objectToRemove) {

        try {

            this.renderables = this.renderables.filter((objectRenderable) => {

                return objectRenderable !== objectToRemove;
            });

            return null;
        } catch (x) {

            return x;
        }
    }

    startYourEngines() {

        try {

            this.render();

            return null;
        } catch (x) {

            return x;
        }
    }

    renderStars() {

        try {

            const arrayStarColors = [{

                r: 155,
                g: 0,
                b: 255
            }, {

                r: 150,
                g: 150,
                b: 255
            }, {

                r: 255,
                g: 0,
                b: 0
            }];

            this.stars.forEach((objectStar) => {

                this.context.beginPath();
                this.context.arc(objectStar.position.x,
                    objectStar.position.y,
                    objectStar.radius,
                    0,
                    2 * Math.PI);

                let dDuration = (new Date()).getTime() - this.starTime;
                let dA = Math.sin(objectStar.brightnessPhase + dDuration / objectStar.brightnessFrequency) * objectStar.brightnessAmplitude;
                let iR = arrayStarColors[objectStar.colorIndex].r;
                let iG = arrayStarColors[objectStar.colorIndex].g;
                let iB = arrayStarColors[objectStar.colorIndex].b;
                let strColor = `rgba(${iR},${iG},${iB},${dA})`;
                this.context.fillStyle = strColor;
                this.context.fill();

                objectStar.position = new Vector(objectStar.position.x + objectStar.radius / 10,
                    objectStar.position.y + objectStar.radius / 10);
                if (objectStar.position.x > window.innerWidth) {

                    objectStar.position = new Vector(objectStar.position.x - window.innerWidth,
                        objectStar.position.y);
                }
                if (objectStar.position.y > window.innerHeight) {

                    objectStar.position = new Vector(objectStar.position.x,
                        objectStar.position.y - window.innerHeight);
                }
            });
            return null;
        } catch (x) {

            return x;
        }
    }

    doKeyProcessing() {

        try {

            if (!this.theShip) {

                return null;
            }

            let exceptionRet = null;
            if (this.downArrowDown) {

                exceptionRet = this.theShip.onDownArrow();
                if (exceptionRet) {

                    throw exceptionRet;
                }
            }
            if (this.upArrowDown) {

                exceptionRet = this.theShip.onUpArrow();
                if (exceptionRet) {

                    throw exceptionRet;
                }
            }
            if (this.leftArrowDown) {

                exceptionRet = this.theShip.onLeftArrow();
                if (exceptionRet) {

                    throw exceptionRet;
                }
            }
            if (this.rightArrowDown) {

                exceptionRet = this.theShip.onRightArrow();
                if (exceptionRet) {

                    throw exceptionRet;
                }
            }
            if (this.spaceDown) {

                exceptionRet = this.theShip.onSpace();
                if (exceptionRet) {

                    throw exceptionRet;
                }
            }
            return null;
        } catch (x) {

            return x;
        }
    }

    createNewAsteroid() {

        try {

            let vectorPosition = null;
            if (Math.random() > 0.5) {

                vectorPosition = new Vector(0,
                    Math.random() * window.innerHeight);
            } else {

                vectorPosition = new Vector(Math.random() * window.innerWidth,
                    0);
            }

            let renderableAsteroid = new RenderableAsteroid(INITIAL_ASTEROID_MIN_RADIUS +
                Math.random() * INITIAL_ASTEROID_RADIUS_DIFFERENTIAL,
                vectorPosition,
                new Vector(Math.random() * INITIAL_ASTEROID_MAX_VELOCITY - INITIAL_ASTEROID_MAX_VELOCITY / 2,
                    Math.random() * INITIAL_ASTEROID_MAX_VELOCITY - INITIAL_ASTEROID_MAX_VELOCITY / 2));
            renderableAsteroid.tut = this;
            this.renderables.push(renderableAsteroid);

            return null;
        } catch (x) {

            return x;
        }
    }

    render() {

        try {

            let exceptionRet = null;

            // Possibly create a new asteroid somewhere along the edge of the screen.
            if (Math.random() > 0.99) {

                exceptionRet = this.createNewAsteroid();
                if (exceptionRet) {

                    throw exceptionRet;
                }
            }

            // Asteroid creation count.
            this.asteroidCreationCount = 0;

            // Calculate frame time.
            let dFrameMS = 0;
            const dNowMS = (new Date()).getTime();
            if (!this.theFirstNowMS) {

                this.theFirstNowMS = dNowMS;
            }
            this.totalDuration = dNowMS - this.theFirstNowMS;
            if (this.lastCallMS) {

                dFrameMS = (dNowMS - this.lastCallMS);
            }
            this.lastCallMS = dNowMS;

            // Clear the display.
            this.context = this.canvas.getContext("2d");
            this.context.fillStyle = "rgba(0,0,0,0.3)";
            this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Loop over our renderables and update.
            this.renderables.forEach((objectRenderable) => {

                try {

                    exceptionRet = objectRenderable.update(dNowMS,
                        dFrameMS);
                    if (exceptionRet) {

                        throw exceptionRet;
                    }
                } catch (x) {

                    alert(x.message);
                }
            });

            // Do the key processing, if applicable.
            if (this.theShip) {

                exceptionRet = this.doKeyProcessing();
                if (exceptionRet) {

                    throw exceptionRet;
                }
            }

            // Render background of stars.
            exceptionRet = this.renderStars();
            if (exceptionRet) {

                throw exceptionRet;
            }

            // If we have not placed the ship.  Then try to place the ship.
            if (this.notHavingPlacedTheShip &&
                this.totalDuration > SHIP_PLACEMENT_PAUSE) {

                // Test that the center of the screen is clear.
                let bCenterClear = true;
                const vectorCenter = new Vector(window.innerWidth / 2,
                    window.innerHeight / 2);
                this.renderables.forEach((objectRenderable) => {

                    try {

                        if (!bCenterClear) {

                            return;
                        }
                        let dDistance = objectRenderable.position.distance(vectorCenter);
                        if (dDistance < OPEN_SPACE_DISTANCE) {

                            bCenterClear = false;
                        }
                    } catch (x) {

                        alert(x.message);
                    }
                });

                if (bCenterClear) {

                    // Create and place the ship and reset state.
                    const renderableShip = new RenderableShip(SHIP_RADIUS,
                        vectorCenter,
                        new Vector(0,
                            0));
                    renderableShip.tut = this;
                    this.theShip = renderableShip;
                    let exceptionRet = renderableShip.create();
                    if (exceptionRet) {

                        throw exceptionRet;
                    }
                    this.renderables.push(renderableShip);
                    this.notHavingPlacedTheShip = false;
                }
            }

            // Loop over our renderables and render.
            this.renderables.forEach((objectRenderable) => {

                try {

                    let exceptionRet = objectRenderable.render();
                    if (exceptionRet) {

                        throw exceptionRet;
                    }
                } catch (x) {

                    alert(x.message);
                }
            });

            // Print score.
            if (!this.notHavingTypedAKey) {

                if (this.theShip) {

                    this.context.fillStyle = "white";
                    this.context.font = "64px Verdana";
                    this.context.textBaseline = "middle";
                    this.context.textAlign = "center";
                    this.context.fillText(this.theShip.score,
                        window.innerWidth / 2,
                        window.innerHeight - 100);
                } else if (this.theScore) {

                    this.context.fillStyle = "red";
                    this.context.font = "64px Verdana";
                    this.context.textBaseline = "middle";
                    this.context.textAlign = "center";
                    this.context.fillText(this.theScore,
                        window.innerWidth / 2,
                        window.innerHeight - 100);
                }
            } else {

                this.context.textBaseline = "middle";
                this.context.textAlign = "center";

                this.context.fillStyle = "yellow";
                this.context.font = "100px Verdana";
                this.context.fillText("mRoids",
                    window.innerWidth / 2,
                    window.innerHeight / 5);

                this.context.fillStyle = "cyan";
                this.context.font = "64px Verdana";
                this.context.fillText("an A&K Day Games production",
                    window.innerWidth / 2,
                    4 * window.innerHeight / 5);
            }
        } catch (x) {

            alert(x.message);
        } finally {

            window.requestAnimationFrame(this.render.bind(this));
        }
    }

    doTheDOMInjection() {

        try {

            // Inject canvas.
            this.canvas = document.createElement("canvas");
            this.canvas.classList.add("theuberthingcanvas");
            document.body.appendChild(this.canvas);

            const functionResize = () => {

                this.canvas.width = window.innerWidth;
                this.canvas.height = window.innerHeight;
            };

            window.addEventListener("resize",
                functionResize.bind(this));
            functionResize();

            return null;
        } catch (x) {

            return x;
        }
    }
}
