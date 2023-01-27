////////////////////////////////////////
// renderer

function Renderer(strCanvas) {

    var self = this;                                                    // Save closure to self.

    // Get the DOM element output object and rendering context.
    var canvasRender = document.getElementById(strCanvas || "renderer");
    var dWidth = canvasRender.width;
    var dHeight = canvasRender.height;

    // Create a background canvas to which to render.
    this.canvasDouble = document.createElement('canvas');
    this.canvasDouble.width = dWidth;
    this.canvasDouble.height = dHeight;

    this.renderContext = this.canvasDouble.getContext("2d");                 // Drawing context to which to render.
    this.outputContext = canvasRender.getContext("2d");                 // Drawing context to output to screen.

    this.aspectRatio = dHeight / dWidth;                               // The aspect ratio.
    this.inverseAspectRatio = dWidth / dHeight;                       // The inverse of the aspect ratio.
    this.halfScreenWidth = dWidth / 2;                                // Center of screen.
    this.halfScreenHeight = dHeight / 2;                              // Center of screen.
    this.ambientLight = 1/10;                                             // Ambient light level.
    this.clipNearZ = 1;                                               // The near or hither clipping plane.
    this.clipFarZ = 1000,                                             // The far or yon clipping plane.
    this.viewingDistance = dHeight;                                    // Distance of projection plane from camera.

    this.global_view = new Matrix();                                    // The global inverse world to camera matrix.
    this.view_angle = new Vector(0, 0, Math.PI);                        // Angle of camera.
    this.viewPoint = new Vector(0, 0, -10);                            // Position of camera.
    this.lightSource = new Vector(0, -1.41 / 2, -1.41 / 2);            // Position of point light source.

    this.worldPolys = [];                                              // The visible polygons for this frame.
    this.models = [];                                                   // The objects in the world (models).

    this.tickStart = (new Date()).getTime();                            // Time of start of engine.
    this.tickTotal = 0;                                                 // Total ticks since start of engine.

    // Method starts off the engine.
    this.create = function () {

        // Update matrix.
        this.Create_World_To_Camera();

        // Call the game loop over and over forever.
        setInterval(this.gameLoop,
            10);

    };

    // Method creates the global inverse transformation matrix
    // used to transform world coordinate to camera coordinates
    this.Create_World_To_Camera = function () {

        var translate = new Matrix();   // the translation matrix
        var rotate_x = new Matrix();    // the x,y and z rotation matrices
        var rotate_y = new Matrix();
        var rotate_z = new Matrix();
        var result_1 = new Matrix();
        var result_2 = new Matrix();

        // Make a translation matrix based on the inverse of the viewpoint.
        translate.data[3][0] = -this.viewPoint.x;
        translate.data[3][1] = -this.viewPoint.y;
        translate.data[3][2] = -this.viewPoint.z;

        // Make rotation matrices based on the inverse of the view angles
        // note that since we use lookup tables for sin and cosine, it's hard to
        // use negative angles, so we will use that fact that cos(-x) = cos(x)
        // and sin(-x) = -sin(x) to implement the inverse instead of using
        // an offset in the lookup table or using the technique that
        // a rotation of -x = 360-x. note the original rotation formulas will be
        // kept in parentheses, so you can better see the inversion

        // X matrix.
        rotate_x.data[1][1] = (Math.cos(this.view_angle.x));
        rotate_x.data[1][2] = -(Math.sin(this.view_angle.x));
        rotate_x.data[2][1] = -(-Math.sin(this.view_angle.x));
        rotate_x.data[2][2] = (Math.cos(this.view_angle.x));

        // Y matrix.
        rotate_y.data[0][0] = (Math.cos(this.view_angle.y));
        rotate_y.data[0][2] = -(-Math.sin(this.view_angle.y));
        rotate_y.data[2][0] = -(Math.sin(this.view_angle.y));
        rotate_y.data[2][2] = (Math.cos(this.view_angle.y));

        // Z matrix
        rotate_z.data[0][0] = (Math.cos(this.view_angle.z));
        rotate_z.data[0][1] = -(Math.sin(this.view_angle.z));
        rotate_z.data[1][0] = -(-Math.sin(this.view_angle.z));
        rotate_z.data[1][1] = (Math.cos(this.view_angle.z));

        // Multiply all the matrices together to obtain a 
        // final world to camera viewing transformation matrix 
        // i.e.: translation * rotate_x * rotate_y * rotate_z.
        translate.Mat_Mul(rotate_x,
            result_1);
        result_1.Mat_Mul(rotate_y,
            result_2);
        result_2.Mat_Mul(rotate_z,
            this.global_view);

    };

    // Method draws the global polygon list 
    // generated by calls to Generate_Poly_List.
    this.Draw_Poly_List = function () {

        // Clear canvas.
        this.renderContext.fillStyle = "black";
        this.renderContext.fillRect(0,
            0,
            dWidth, 
            dHeight);

        // Draw each polygon in list.
        for (var curr_poly = 0; curr_poly < this.worldPolys.length; curr_poly++) {

            // Do Z clipping first before projection.
            var polygonCurrent = this.worldPolys[curr_poly];
            var z1 = polygonCurrent.vector0.z;
            var z2 = polygonCurrent.vector1.z;
            var z3 = polygonCurrent.vector2.z;

            // Extract points of polygon.
            var x1 = polygonCurrent.vector0.x;
            var y1 = polygonCurrent.vector0.y;

            var x2 = polygonCurrent.vector1.x;
            var y2 = polygonCurrent.vector1.y;

            var x3 = polygonCurrent.vector2.x;
            var y3 = polygonCurrent.vector2.y;

            // Compute screen position of points.
            x1 = (this.halfScreenWidth + x1 * this.viewingDistance / z1);
            y1 = (this.halfScreenHeight - this.aspectRatio * y1 * this.viewingDistance / z1);

            x2 = (this.halfScreenWidth + x2 * this.viewingDistance / z2);
            y2 = (this.halfScreenHeight - this.aspectRatio * y2 * this.viewingDistance / z2);

            x3 = (this.halfScreenWidth + x3 * this.viewingDistance / z3);
            y3 = (this.halfScreenHeight - this.aspectRatio * y3 * this.viewingDistance / z3);

            // Draw triangle.
            this.renderContext.strokeStyle = polygonCurrent.shade;
            this.renderContext.fillStyle = polygonCurrent.shade;

            this.renderContext.beginPath();

            this.renderContext.moveTo(x1, y1);
            this.renderContext.lineTo(x2, y2);
            this.renderContext.lineTo(x3, y3);

            this.renderContext.closePath();

            this.renderContext.stroke();
            this.renderContext.fill();

        } // End for curr_poly.
    };

    // Method sorts the polygons in the worldPolys collection.
    this.Sort_Poly_List = function () {

        // Sort the polygons.
        this.worldPolys.sort(function (poly_1,
            poly_2) {

            // Get the average z.
            var z1 = poly_1.averageZ;
            var z2 = poly_2.averageZ;

            // Compare z1 and z2, such that polys' will be sorted in descending Z order.
            if (z1 > z2) {

                return -1;

            } else if (z1 < z2) {

                return 1;

            }

            return 0;

        });
    };

    // Method is used to generate the final polygon list that 
    // will be rendered. Object by object the list is built up.
    this.Clear_Poly_List = function () {

        // Reset number of polys to zero.
        this.worldPolys = [];

    };

    // Loop over models, update.
    this.updateModels = function (dTotal,
        dEllapsed) {

        this.Clear_Poly_List();

        for (var i = 0; i < this.models.length; i++) {

            var dPercent = i / this.models.length;
            var model = this.models[i];
            var dDTheta = 2 * Math.PI * dPercent;

            model.setWorldPosition(3 * Math.sin(dTotal / 2000 + dDTheta),
                3 * Math.sin(dTotal / 4000 + dDTheta),
                3 * Math.cos(dTotal / 2000 + dDTheta));
            model.setRotation(dTotal / 1000 + dDTheta,
                dTotal / 2000 + dDTheta,
                dTotal / 1000 + dDTheta);
            model.setScale(1);

            // Update model.
            model.update(dTotal,
                dEllapsed,
                this);
        }

        // Sort so further away gets drawn first so overlay looks nice.
        this.Sort_Poly_List();

    };

    // Loop over models, update.
    this.updateCamera = function (dTotal,
        dEllapsed) {

        // Position of camera.
//        this.viewPoint = new Vector(3*Math.sin(dTotal / 1000), Math.cos(dTotal / 1000), -10);

        // Update matrix.
//        this.Create_World_To_Camera();

    };

    // Main loop, drives rendering.
    this.gameLoop = function () {

        try {

            // Get total and frame times.
            var dTotal = (new Date()).getTime() - self.tickStart;
            var dEllapsed = dTotal - self.tickTotal;
            self.tickTotal = dTotal;

            // Update camera.
            self.updateCamera(dTotal,
                dEllapsed);

            // Update models.
            self.updateModels(dTotal,
                dEllapsed);

            // Render poly list.
            self.Draw_Poly_List();

            //  Copy over to output context.
            self.outputContext.drawImage(self.canvasDouble,
                0,
                0);

        } catch (e) {

            alert(e.message);

        }
    };
};
