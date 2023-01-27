////////////////////////////////////////
// Class wrapps up matrix to perspective-project a point into the connonic viewing volume.
//
// http://knol.google.com/k/perspective-transformation
//
////////////////////////////////////////
function Perspective(dAspectRatio,
    dFieldOfView,
    dNear,
    dFar) {

    var dTanFOVOver2 = Math.tan(dFieldOfView / 2);
    var dA = 1 / (dAspectRatio * dTanFOVOver2);
    var dB = 1 / dTanFOVOver2;

    // Left-handed.
    var dC = dFar / (dFar - dNear);
    var dD = 1;
    var dE = (-1 * dNear *dFar) / (dFar - dNear);

/*  // Right-handed.
    var dC = dFar / (dNear - dFar);
    var dD = -1;
    var dE = (dNear *dFar) / (dNear - dFar);
*/
/*    this.matrixProjection = new Matrix([
       [dA, 0, 0, 0],
       [0, dB, 0, 0],
       [0, 0, dC, dD],
       [0, 0, dE, 0],
       ]);
*/
    this.matrixProjection = new Matrix([
       [dA, 0, 0, 0],
       [0, dB, 0, 0],
       [0, 0, dC, dD],
       [0, 0, dE, 0],
       ]);

}

