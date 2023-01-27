///////////////////////////////////////
// Vector module.
//

class Vector {

    constructor(dX, dY) {

        this.x = dX;
        this.y = dY;
    }

    get x() {

        return this.m_dX;
    }
    set x(dX) {

        this.m_dX = dX;
    }

    get y() {

        return this.m_dY;
    }
    set y(dY) {

        this.m_dY = dY;
    }

    get theta() {

        return Math.atan2(this.y, 
            this.x);
    }

    get magnitude() {

        return Math.sqrt(Math.pow(this.y, 2) + 
            Math.pow(this.x, 2));
    }

    distance(vectorOther) {

        return Math.sqrt(Math.pow(this.y - vectorOther.y, 2 ) + 
            Math.pow(this.x - vectorOther.x, 2));
    }

    multiplyScalar(dScalar) {

        return new Vector(this.x * dScalar, 
            this.y * dScalar);
    }

    addVector(vectorAdd) {

        return new Vector(this.x + vectorAdd.x, 
            this.y + vectorAdd.y);
    }
}