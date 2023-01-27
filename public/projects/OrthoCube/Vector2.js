///////////////////////////////////////////
// 2D Vector
///////////////////////////////////////////
function Vector2(dX, dY) {
    this.x = dX || 0;
    this.y = dY || 0;

    this.add = function(vector2RHS) {
        return new Vector2(this.x + vector2RHS.x,
            this.y + vector2RHS.y);
    }

    this.subtract = function(vector2RHS) {
        return new Vector2(this.x - vector2RHS.x,
            this.y - vector2RHS.y);
    }

    this.multiplyScalar = function(dScalar) {
        return new Vector2(this.x * dScalar,
            this.y * dScalar);
    }

    this.divideScalar = function(dScalar) {
        if (dScalar !== 0) {
            return new Vector2(this.x / dScalar,
                this.y / dScalar);
        }

        return new Vector2();
    }

    this.dotProduct = function(vector2RHS) {
        return this.x * vector2RHS.x + 
            this.y * vector2RHS.y;
    }

    this.length = function() {
        return Math.sqrt(this.x * this.x +
            this.y * this.y);
    }

    this.normalize = function() {
        return this.divideScalar(this.length());
    }

    this.distanceTo = function(vector2RHS) {
        var dDX = this.x - vector2RHS.x;
        var dDY = this.y - vector2RHS.y;
        return Math.sqrt(dDX * dDX +
            dDY * dDY);
    }

    this.toString = function() {
        return "(" + this.x + ", " + this.y + ")";
    }
}

