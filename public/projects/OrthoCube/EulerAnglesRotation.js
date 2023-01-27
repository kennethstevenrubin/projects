////////////////////////////////////////
// Class wrapps up matrix to rotate a point via euler angles.
//
// http://inside.mines.edu/~gmurray/ArbitraryAxisRotation/
//
////////////////////////////////////////
function EulerAnglesRotation(dAlpha,
    dBeta,
    dGamma) {

    var dSinA = Math.sin(dAlpha);
    var dCosA = Math.cos(dAlpha);

    var dSinB = Math.sin(dBeta);
    var dCosB = Math.cos(dBeta);

    var dSinG = Math.sin(dGamma);
    var dCosG = Math.cos(dGamma);

    this.matrixRotateX = new Matrix([
       [1, 0, 0, 0],
       [0, dCosA, -dSinA, 0],
       [0, dSinA, dCosA, 0],
       [0, 0, 0, 1]]);

    this.matrixRotateY = new Matrix([
       [dCosB, 0, dSinB, 0],
       [0, 1, 0, 0],
       [-dSinB, 0, dCosB, 0],
       [0, 0, 0, 1]]);

    this.matrixRotateZ = new Matrix([
       [dCosG, -dSinG, 0, 0],
       [dSinG, dCosG, 0, 0],
       [0, 0, 1, 0],
       [0, 0, 0, 1]]);
}

