///////////////////////////////////////
// RenderableAsteroid
//

const MIN_ASTEROID_RADIUS = 4;
const NUMBER_OF_PARTS = 3;

class RenderableAsteroid extends Renderable {

    constructor(dRadius, vectorPosition, vectorVelocity) {

        super(dRadius, 
            vectorPosition, 
            vectorVelocity);

        this.spinFrequencyDivisor = 500 + Math.random() * 1000;
    }

    get type() {

        return "RenderableAsteroid";
    }

    get color() {

        return "gray";
    }

    render() {

        try {

            this.tut.context.fillStyle = "rgb(100, 100, 100)";
            this.tut.context.beginPath();
            this.tut.context.arc(this.position.x, 
                this.position.y, 
                this.radius, 
                0, 
                2 * Math.PI);
            this.tut.context.fill();

            let dTheta = (new Date()).getTime() / this.spinFrequencyDivisor;

            this.tut.context.fillStyle = "rgb(255, 255, 255, 0.2)";
            this.tut.context.beginPath();
            this.tut.context.arc(this.position.x + this.radius / 4 * Math.cos(dTheta), 
                this.position.y + this.radius / 6 * Math.sin(dTheta), 
                5 * this.radius / 6, 
                0, 
                2 * Math.PI);
            this.tut.context.fill();

            return null;
        } catch (x) {

            return x;
        }
    }

    destroy(objectCollidee) {

        try {

            for (let i = 0; i < NUMBER_OF_PARTS; i++) {

                const dNewRadius = this.radius * Math.random() / Math.sqrt(NUMBER_OF_PARTS);
                if (dNewRadius > MIN_ASTEROID_RADIUS) {

                    const vectorSpread = new Vector(Math.cos(i * 2 * Math.PI / NUMBER_OF_PARTS),
                        Math.sin(i * 2 * Math.PI / NUMBER_OF_PARTS));
                    const vectorVelocity = new Vector(this.velocity.x + vectorSpread.x * this.radius,
                        this.velocity.y + vectorSpread.y * this.radius);
                    const vectorPosition = new Vector(this.position.x + vectorSpread.x * this.radius,
                        this.position.y + vectorSpread.y * this.radius);

                    this.tut.asteroidCreationCount++;
                    if (this.tut.asteroidCreationCount < 10) {

                        const raNew = new RenderableAsteroid(dNewRadius,
                            vectorPosition,
                            vectorVelocity);
                        raNew.tut = this.tut;
                        this.tut.renderables.push(raNew);
                    }
                }
            }

            if (objectCollidee.type === "RenderableBullet") {

                // Explode.
                let a = new Audio(`media/W${(Math.floor(Math.random() * 3) + 1)}.mp3`);
                a.volume = 0.1;
                a.play();
            }

            return null;
        } catch (x) {

            return x;
        }
    }
}