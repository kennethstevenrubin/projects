///////////////////////////////////////////
// 3D Vector
///////////////////////////////////////////
function Vector3(dX, dY, dZ) {
    this.x = dX || 0;
    this.y = dY || 0;
    this.z = dZ || 0;

    this.add = function(vector3RHS) {
        return new Vector3(this.x + vector3RHS.x,
            this.y + vector3RHS.y,
            this.z + vector3RHS.z);
    }

    this.subtract = function(vector3RHS) {
        return new Vector3(this.x - vector3RHS.x,
            this.y - vector3RHS.y,
            this.z - vector3RHS.z);
    }

    this.multiplyScalar = function(dScalar) {
        return new Vector3(this.x * dScalar,
            this.y * dScalar,
            this.z * dScalar);
    }

    this.divideScalar = function(dScalar) {
        if (dScalar !== 0) {
            return new Vector3(this.x / dScalar,
                this.y / dScalar,
                this.z / dScalar);
        }

        return new Vector3();
    }

    this.dotProduct = function(vector3RHS) {
        return this.x * vector3RHS.x + 
            this.y * vector3RHS.y + 
            this.z * vector3RHS.z;
    }

    this.crossProduct = function(vector3RHS) {
        return new Vector3(this.y * vector3RHS.z - this.z * vector3RHS.y,
            this.z * vector3RHS.x - this.x * vector3RHS.z,
            this.x * vector3RHS.y - this.y * vector3RHS.x);
    }

    this.length = function() {
        return Math.sqrt(this.x * this.x +
            this.y * this.y + 
            this.z * this.z);
    }

    this.normalize = function() {
        return this.divideScalar(this.length());
    }

    this.distanceTo = function(vector3RHS) {
        var dDX = this.x - vector3RHS.x;
        var dDY = this.y - vector3RHS.y;
        var dDZ = this.z - vector3RHS.z;
        return Math.sqrt(dDX * dDX +
            dDY * dDY +
            dDZ * dDZ);
    }

    this.toString = function() {
        return "(" + this.x + ", " + this.y + ", " + this.z + ")";
    }

    this.toMatrix41 = function() {
        return new Matrix([[this.x],[this.y],[this.z],[1]]);
    }
}

