// Cube helper class.
function Cube() {

    // Geometry for cube in model space.
    this.geometry = [new Vector3(-1,-1,-1),
        new Vector3(+1,-1,-1),
        new Vector3(+1,+1,-1),
        new Vector3(-1,+1,-1),
        new Vector3(-1,-1,+1),
        new Vector3(+1,-1,+1),
        new Vector3(+1,+1,+1),
        new Vector3(-1,+1,+1)];

    // Geometry transformed into view-port space.
    this.transformed = [];

    // Collection of line draw orders.
    this.indexes = [
        [0, 3, 2, 1, 0], 
        [0, 4, 7, 3, 0],
        [0, 1, 5, 4, 0],
        [6, 7, 4, 5, 6],
        [6, 2, 3, 7, 6], 
        [6, 5, 1, 2, 6] 
       ];

    // Defines translation for cube model into world space.
    this.translation = new Vector3();
    // Defines scale for cube model into world space.
    this.scale = new Vector3(1,1,1);

    // Change in position.
    this.velocity = new Vector3();

    // Change in change in position.
    this.acceleration = new Vector3();

    this.rotationX = 0;
    this.rotationDX = 0;
    this.rotationY = 0;
    this.rotationDY = 0;
    this.rotationZ = 0;
    this.rotationDZ = 0;

    // Color of cube.
    this.color = new Color(255,255,255,1);

    // Indicates that this cube is solid.
    this.solid = true;

    // Width of line.
    this.lineWidth = 1;

    this.update = function(dViewportWidth,
        dViewportHeight,
        camera,
        perspective) {

        this.translation = this.translation.add(this.velocity);
        this.velocity = this.velocity.add(this.acceleration);

        if (this.translation.x > 5) {
            this.translation.x -= 10;
        } else if (this.translation.x < -5) {
            this.translation.x += 10;
        }
        if (this.translation.y > 5) {
            this.translation.y -= 10;
        } else if (this.translation.y < -5) {
            this.translation.y += 10;
        }
        if (this.translation.z > 5) {
            this.translation.z -= 10;
        } else if (this.translation.z < -5) {
            this.translation.z += 10;
        }

        var matrixWorld = new Matrix([
            [this.scale.x,0,0,this.translation.x],
            [0,this.scale.y,0,this.translation.y],
            [0,0,this.scale.z,this.translation.z],
            [0,0,0,1]]);

        this.rotationX += this.rotationDX;
        this.rotationY += this.rotationDY;
        this.rotationZ += this.rotationDZ;

        var rotation = new EulerAnglesRotation(this.rotationX,
            this.rotationY,
            this.rotationZ);

        matrixWorld = matrixWorld.multiply(rotation.matrixRotateZ).multiply(rotation.matrixRotateY).multiply(rotation.matrixRotateX);

        // Transform for camera and world and screen.
        for (var i = 0; i < this.geometry.length; i++) {
            var vector3Point = this.geometry[i];
            var matrix41Point = vector3Point.toMatrix41();

            // Transform on to camera space.
            var matrix41Out = camera.ViewMatrix.multiply(matrixWorld.multiply(matrix41Point));

            // Transform on to screen space.
            var dX = (dViewportWidth / 2) + (matrix41Out.x / (Math.abs(matrix41Out.z) + 10)) * dViewportHeight;
            var dY = (dViewportHeight / 2) + (-matrix41Out.y / (Math.abs(matrix41Out.z) + 10)) * dViewportHeight;

            this.transformed[i] = new Vector3(dX, 
                dY,
                matrix41Out.z);
        }

    }

    // Invoked to render this model to the context provided.
    this.render = function(renderContext) {

        // Set render context state.
        renderContext.strokeStyle = this.color.toString();
        renderContext.lineWidth = this.lineWidth;

        // Render out the transformed geometry.
        for (var i = 0; i < this.indexes.length; i++) {

            // Only draw faces that face the camera, if solid.
            var dDot = 0;
            if (this.solid === true) {
                var vector30 = this.transformed[this.indexes[i][0]].subtract(this.transformed[this.indexes[i][1]]);
                var vector31 = this.transformed[this.indexes[i][0]].subtract(this.transformed[this.indexes[i][3]]);
                var vector32 = vector30.crossProduct(vector31);
                var dDot = vector32.dotProduct(new Vector3(0,0,-1));
            }
            if (dDot > 0 ||
                this.solid === false) {
                // Begin drawing.
                renderContext.beginPath();

                var bFirst = true;
                for (var j = 0; j < this.indexes[i].length; j++) {
                    var iIndex = this.indexes[i][j];

                    if (bFirst === true) {
                        bFirst = false;
                        renderContext.moveTo(this.transformed[iIndex].x,
                            this.transformed[iIndex].y);
                    } else {
                        renderContext.lineTo(this.transformed[iIndex].x,
                            this.transformed[iIndex].y);
                    }
                }

                renderContext.stroke();
            }
        }
    }
}
