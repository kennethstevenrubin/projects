////////////////////////////////////////
// vector

function Vector(x,
    y,
    z,
    w) {

    this.x = x || 0;    // X-ccordinate.
    this.y = y || 0;    // Y-ccordinate.
    this.z = z || 0;    // Z-ccordinate.
    this.w = w || 0;    // Homogenuous W.

    // Method computes the dot product of two vectors.
    this.Dot_Product = function (v) {

        var u = this;
        return ((u.x * v.x) + (u.y * v.y) + (u.z * v.z));

    };

    // Method creates a vector from two points in 3D space.
    this.Make_Vector = function (term,
        result) {

        var init = this;

        result.x = term.x - init.x;
        result.y = term.y - init.y;
        result.z = term.z - init.z;

    };

    // Method computes the cross product between two vectors.
    this.Cross_Product = function (v,
        result) {

        var u = this;

        result.x = (u.y * v.z - u.z * v.y);
        result.y = -(u.x * v.z - u.z * v.x);
        result.z = (u.x * v.y - u.y * v.x);

        var dLength = result.Vector_Mag();
        result.x /= dLength;
        result.y /= dLength;
        result.z /= dLength;

    };

    // Computes the magnitude of a vector.
    this.Vector_Mag = function () {

        var u = this;
        return Math.sqrt(u.x * u.x + u.y * u.y + u.z * u.z);

    };
}
