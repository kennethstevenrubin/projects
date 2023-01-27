//////////////////////////////
// Renderable base class.
//

class Renderable {

    constructor(dRadius, vectorPosition, vectorVelocity) {

        this.radius = dRadius;
        this.position = vectorPosition;
        this.velocity = vectorVelocity;
    }

    get type() {

        return "Renderable";
    }

    get tut() {

        return this.m_tut;
    }
    set tut(tutValue) {

        this.m_tut = tutValue;
    }

    get mass() {

        return Math.pow(this.m_dRadius, 
            2);
    }
    get radius() {

        return this.m_dRadius;
    }
    set radius(dValue) {

        this.m_dRadius = dValue;
    }

    get position() {

        return this.m_vectorPosition;
    }
    set position(vectorValue) {

        this.m_vectorPosition = vectorValue;
    }

    get velocity() {

        return this.m_vectorVelocity;
    }
    set velocity(vectorValue) {

        this.m_vectorVelocity = vectorValue;
    }

    get color() {

        throw new Error("?!");
    }

    render() {

        try {

            this.tut.context.fillStyle = this.color;
            this.tut.context.beginPath();
            this.tut.context.arc(this.position.x, 
                this.position.y, 
                this.radius, 
                0, 
                2 * Math.PI);
            this.tut.context.fill();

            return null;
        } catch (x) {

            return x;
        }
    }

    update(dNowMS, dFrameMS) {

        try {

            this.nowMS = dNowMS;
            this.frameMS = dFrameMS;

            const bDiedDuringInnerUpdateProcessing = this.innerUpdate();
            if (bDiedDuringInnerUpdateProcessing) {

                return null;
            }

            this.position = this.position.addVector(
                
                    this.velocity.multiplyScalar(this.frameMS / 1000)
                );

            // Check and compensage for overflow.
            if (this.position.x < 0) {

                this.position.x += this.tut.context.canvas.width;
            } else if (this.position.x > this.tut.context.canvas.width) {

                this.position.x -= this.tut.context.canvas.width;
            }
            if (this.position.y < 0) {

                this.position.y += this.tut.context.canvas.height;
            } else if (this.position.y > this.tut.context.canvas.height) {

                this.position.y -= this.tut.context.canvas.height;
            }

            // Hit test.

            // Loop over all tut's renderables.
            this.tut.renderables.filter((objectRenderable) => {

                return (objectRenderable !== this);
            }).forEach((objectRenderable) => {

                try {

                    const dDistance = objectRenderable.position.distance(this.position);

                    if (dDistance <= this.radius + objectRenderable.radius) {

                        let exceptionRet = this.explode(objectRenderable);
                        if (exceptionRet) {

                            throw exceptionRet;
                        }
                        exceptionRet = objectRenderable.explode(this);
                        if (exceptionRet) {

                            throw exceptionRet;
                        }
                    }
                } catch (x) {

                    alert(x.message);
                }
            });

            return null;
        } catch (x) {

            return x;
        }
    }

    // Return bool indicating if self was eliminated during its inner update.
    innerUpdate() {

        return false;
    }

    destroy() {

        return null;
    }

    explode(objectCollidee) {

        try {

            let exceptionRet = this.destroy(objectCollidee);
            if (exceptionRet) {

                throw exceptionRet;
            }
            return this.tut.remove(this);
        } catch (x) {

            return x;
        }
    }
}