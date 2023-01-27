///////////////////////////////////////
// RenderableBullet
//

const BULLET_LIFESPAN = 1000;

class RenderableBullet extends Renderable {

    constructor(dRadius, vectorPosition, vectorVelocity) {

        super(dRadius, 
            vectorPosition, 
            vectorVelocity);

        this.createTimeMS = (new Date()).getTime();
    }

    get type() {

        return "RenderableBullet";
    }

    innerUpdate() {

        if ((new Date()).getTime() - this.createTimeMS > BULLET_LIFESPAN) {

            this.tut.remove(this);
            return true;
        }

        return false;
    }

    get color() {

        return "yellow";
    }
}