///////////////////////////////////////
// Main application module.
//

const INITIAL_NUMBER_OF_ASTEROIDS = 10;
const INITIAL_ASTEROID_MIN_RADIUS = 30;
const INITIAL_ASTEROID_RADIUS_DIFFERENTIAL = 100;
const INITIAL_ASTEROID_MAX_VELOCITY = 150;

document.addEventListener("DOMContentLoaded", () => {

    try {

        const arrayRenderables = [];

        for (let i = 0; i < INITIAL_NUMBER_OF_ASTEROIDS; i++) {
        
            let renderableAsteroid = new RenderableAsteroid(INITIAL_ASTEROID_MIN_RADIUS + 
                    Math.random() * INITIAL_ASTEROID_RADIUS_DIFFERENTIAL,
                new Vector(Math.random() * window.innerWidth, 
                    Math.random() * window.innerHeight), 
                new Vector(Math.random() * INITIAL_ASTEROID_MAX_VELOCITY - INITIAL_ASTEROID_MAX_VELOCITY / 2, 
                    Math.random() * INITIAL_ASTEROID_MAX_VELOCITY - INITIAL_ASTEROID_MAX_VELOCITY / 2));
            arrayRenderables.push(renderableAsteroid);
        }

        var tut = new TheUberThing(arrayRenderables);
        var exceptionRet = tut.create();
        if (exceptionRet) {

            throw exceptionRet;
        }
    } catch (x) {

        alert(x.message);
    }
});
