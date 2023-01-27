var renderer = null;

// This function is invoked when the 
// browser window object is loaded.
var ready = function () {

    // Allocate the renderer, it defaults to looking for a canvas named "renderer".
    renderer = new Renderer();

    // Add models to the renderer.
    for (var i = 0; i < 10; i++) {

        var modelNew = new Model();
        if (Math.random() > 0.0) {
            modelNew.initializeSphere(5, 10);
        } else if (Math.random() > 0.3333) {
            modelNew.initializeCube();
        } else {
            modelNew.initializeTetrahedron();
        }
        modelNew.Compute_Object_Radius();

        renderer.models.push(modelNew);
    }

    // Start the renderer up.
    renderer.create();

};
