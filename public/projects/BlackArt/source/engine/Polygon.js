////////////////////////////////////////
// polygon

function Polygon() {

    this.visible = true;    // Used to remove backfaces.

    this.red = 255;         // Color of polygon.
    this.green = 255;
    this.blue = 255;
    this.alpha = 1;
    this.shade = null;      // The final shade of color after lighting.

    this.index0 = 0;       // The index number of the 1st vertex.
    this.index1 = 1;       // The index number of the 2nd vertex.
    this.index2 = 2;       // The index number of the 3rd vertex.

    this.vector0 = null;    // The vector to the transformed vertex.
    this.vector1 = null;    // The vector to the transformed vertex. 
    this.vector2 = null;    // The vector to the transformed vertex.

    this.normal = new Vector(0, 0, 0);     // Normal of face.
    this.normalRotated = null;     // Normal of face after rotation into world coordinates.

    this.averageZ = 0;      // The average used for sorting the polygon.  Set when the vectorX fields are set.

    // Compute normal, given verticies.
    this.computeNormal = function (verts) {

        // The vector u = vo.v1.
        var u = new Vector();
        verts[this.index0].Make_Vector(verts[this.index1],
                u);

        // The vector v = vo-v2.
        var v = new Vector();
        verts[this.index0].Make_Vector(verts[this.index2],
                v);

        // Compute the normal to polygon v x u.
        v.Cross_Product(u,
                this.normal);

    }

    // Method returns a color given an intensity percent.
    this.getColor = function (intensityPercent) {

        return "rgba(" +
            Math.floor(intensityPercent * this.red).toString() +
            "," +
            Math.floor(intensityPercent * this.green).toString() +
            "," +
            Math.floor(intensityPercent * this.blue).toString() +
            "," +
            this.alpha.toString() +
            ")";

    }
}
