////////////////////////////////////////
// Camera
////////////////////////////////////////
function Camera(vectorEye,
    vectorGaze,
    dRoll) {

    var vectorUp = new Vector3(Math.sin(dRoll),
        -Math.cos(dRoll),
        0);

    var vectorForward = new Vector3(vectorGaze.x - vectorEye.x,
        vectorGaze.y - vectorEye.y,
        vectorGaze.z - vectorEye.z).normalize();

    var vectorRight = vectorUp.crossProduct(vectorForward).normalize();

    vectorUp = vectorRight.crossProduct(vectorForward).normalize();

    var matrixRotation = new Matrix([
        [vectorRight.x, vectorRight.y, vectorRight.z, 0],
    	[vectorUp.x, vectorUp.y, vectorUp.z, 0],
    	[vectorForward.x, vectorForward.y, vectorForward.z, 0],
    	[0, 0, 0, 1]]);

    var matrixTranslation = new Matrix([
        [1, 0, 0, -vectorEye.x],
    	[0, 1, 0, -vectorEye.y],
    	[0, 0, 1, -vectorEye.z],
    	[0, 0, 0, 1]]);
    
    this.ViewMatrix = matrixRotation.multiply(matrixTranslation);
}

