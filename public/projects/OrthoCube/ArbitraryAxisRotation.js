////////////////////////////////////////
// Class wrapps up matrix to rotate a point about an arbitrary axis.
//
// http://inside.mines.edu/~gmurray/ArbitraryAxisRotation/
//
////////////////////////////////////////
function ArbitraryAxisRotation(vector3Axis,
    dTheta) {

    vector3Axis = vector3Axis.normalize();

    var dU = vector3Axis.x;
    var dV = vector3Axis.y;
    var dW = vector3Axis.z;
    var dUU = dU * dU;
    var dUV = dU * dV;
    var dUW = dU * dW;
    var dVV = dV * dV;
    var dVW = dV * dW;
    var dWW = dW * dW;
    
    var dSinTheta = Math.sin(dTheta);
    var dCosTheta = Math.cos(dTheta);

    this.matrixRotate = new Matrix([
       [dUU + (1 - dUU)*dCosTheta, dUV*(1 - dCosTheta) - dW * dSinTheta, dUW * (1 - dCosTheta) + dV * dSinTheta, 0],
       [dUV * (1 - dCosTheta) + dW * dSinTheta, dVV + (1 - dVV) * dCosTheta, dVW * (1 - dCosTheta) - dU * dSinTheta, 0],
       [dUW * (1 - dCosTheta) - dV * dSinTheta, dVW * (1 - dCosTheta) + dU * dSinTheta, dWW + (1 - dWW) * dCosTheta, 0],
       [0, 0, 0, 1],
       ]);
}

