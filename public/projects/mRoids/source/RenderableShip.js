///////////////////////////////////////
// RenderableShip
//

const SHIP_SPIRE_LENGTH = 50;
const SHIP_ROTATE_RADIANS_STEP = 2 * Math.PI / 128;
const SHIP_ACCELERATION_FACTOR = 10;
const SHIP_BULLET_SPEED = 500;
const MAX_SHIP_VELOCITY_MAGNITUDE = 750;
const FIRE_FREQUENCY = 100;

class RenderableShip extends Renderable {

    constructor(dRadius, vectorPosition, vectorVelocity) {

        super(dRadius, 
            vectorPosition, 
            vectorVelocity);

        this.heading = 0;
    }

    get type() {

        return "RenderableShip";
    }

    render() {

        // Spire.
        this.tut.context.beginPath();
        this.tut.context.moveTo(this.position.x,
            this.position.y);
        this.tut.context.lineTo(this.position.x + SHIP_SPIRE_LENGTH * Math.cos(this.heading),
            this.position.y + SHIP_SPIRE_LENGTH * Math.sin(this.heading));
        this.tut.context.strokeStyle = "peru";
        this.tut.context.lineCap = "round";
        this.tut.context.lineWidth = 4;
        this.tut.context.stroke();
        this.tut.context.lineWidth = 1;

        // Core.
        this.tut.context.fillStyle = "FireBrick";
        this.tut.context.beginPath();
        this.tut.context.arc(this.position.x, 
            this.position.y, 
            this.radius / 1.6, 
            0, 
            2 * Math.PI);
        this.tut.context.fill();

        // Wings.
        this.tut.context.fillStyle = "peru";
        this.tut.context.beginPath();
        this.tut.context.arc(this.position.x, 
            this.position.y, 
            this.radius, 
            this.heading - Math.PI / 3 + Math.PI / 2, 
            this.heading + Math.PI / 3 + Math.PI / 2);
        this.tut.context.fill();

        this.tut.context.beginPath();
        this.tut.context.arc(this.position.x, 
            this.position.y, 
            this.radius, 
            this.heading - Math.PI / 3 + Math.PI + Math.PI / 2, 
            this.heading + Math.PI / 3 + Math.PI + Math.PI / 2);
        this.tut.context.fill();

        // Wing stripes.
        this.tut.context.strokeStyle = "black";
        this.tut.context.beginPath();
        this.tut.context.arc(this.position.x, 
            this.position.y, 
            this.radius * 0.85, 
            this.heading - Math.PI / 3 + Math.PI / 2, 
            this.heading + Math.PI / 3 + Math.PI / 2);
        this.tut.context.stroke();

        this.tut.context.beginPath();
        this.tut.context.arc(this.position.x, 
            this.position.y, 
            this.radius * 0.85, 
            this.heading - Math.PI / 3 + Math.PI + Math.PI / 2, 
            this.heading + Math.PI / 3 + Math.PI + Math.PI / 2);
        this.tut.context.stroke();
    }

    get heading() {

        return this.m_dHeading;
    }
    set heading(dValue) {

        this.m_dHeading = dValue;
    }

    create() {

        try {

            this.createTime = (new Date()).getTime();

            return null;
        } catch (x) {

            return x;
        }
    }

    destroy(objectCollidee) {

        try {

            console.log(`Ship blown up by: ${objectCollidee.type}.`);

            // Disconnect keyboard handling events.
            window.removeEventListener("keydown", 
                this.keyHandler);

            // .
            this.tut.notHavingPlacedTheShip = true;
            this.tut.totalDuration = 0;
            this.tut.theFirstNowMS = null;
            this.tut.theShip = null;
            this.tut.theScore = this.score;

            let a = new Audio("media/ShipDestroy2.mp3");
            a.volume = 0.1;
            a.play()

            return null;
        } catch (x) {

            return x;
        }
    }

    get score() {

        return parseInt(
                ( 
                    (
                        (
                            new Date()
                        ).getTime() 
                        - 
                        this.createTime 
                    )
                    /
                    1000
                ).toFixed(0)
            );
    }

    onLeftArrow() {

        // Rotate counter-clockwise
        this.heading -= SHIP_ROTATE_RADIANS_STEP;
    }

    onRightArrow() {

        // Rotate counter-clockwise
        this.heading += SHIP_ROTATE_RADIANS_STEP;
    }

    onUpArrow() {

        // Accelerate
        this.velocity = new Vector(this.velocity.x + SHIP_ACCELERATION_FACTOR * Math.cos(this.heading),
            this.velocity.y + SHIP_ACCELERATION_FACTOR * Math.sin(this.heading));
    }

    onDownArrow() {

        // Accelerate
        this.velocity = new Vector(this.velocity.x - SHIP_ACCELERATION_FACTOR * Math.cos(this.heading),
            this.velocity.y - SHIP_ACCELERATION_FACTOR * Math.sin(this.heading));
    }

    onSpace() {

        const iNowMS = (new Date()).getTime();
        if (!this.lastFireTime) {

            this.lastFireTime = iNowMS - FIRE_FREQUENCY - 1;
        }

        if (iNowMS - this.lastFireTime > FIRE_FREQUENCY) {

            // Fire
            const vectorPosition = new Vector(this.position.x + (this.radius + 10 + Math.abs(this.velocity.x * this.frameMS / 1000)) * Math.cos(this.heading), 
                this.position.y + (this.radius + 10 + Math.abs(this.velocity.y * this.frameMS / 1000)) * Math.sin(this.heading));

            const vectorHeading = new Vector(SHIP_BULLET_SPEED * Math.cos(this.heading),
                SHIP_BULLET_SPEED * Math.sin(this.heading));
            const vectorVelocity = new Vector(this.velocity.x + vectorHeading.x,
                this.velocity.y + vectorHeading.y);

            const rbNew = new RenderableBullet(4, 
                vectorPosition,
                vectorVelocity);
            rbNew.tut = this.tut;
            this.tut.renderables.push(rbNew);

            this.lastFireTime = iNowMS;

            // Laser fire sound.
            let a = new Audio("media/Laser2.mp3");
            a.volume = 0.01;
            a.play()
        }
    }

    innerUpdate() {

        if (this.velocity.magnitude > MAX_SHIP_VELOCITY_MAGNITUDE) {

            this.velocity = new Vector(this.velocity.x / this.velocity.magnitude * MAX_SHIP_VELOCITY_MAGNITUDE,
                this.velocity.y / this.velocity.magnitude * MAX_SHIP_VELOCITY_MAGNITUDE);
        }
    }

    get color() {

        return "green";
    }
}