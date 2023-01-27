/////////////////////////////
// Application entry point. 
//

// Indicates that user control is enabled.
const ENABLE_CONTROL = true;

// Ready method invoked when the document is fully loaded.
document.addEventListener("DOMContentLoaded", () => {

    // Grab the query string parameters indicating 
    // what shader to run and how fast it lives.
    let urlParams = new URLSearchParams(window.location.search);
    let shaderName = "CircleInversion";
    if (urlParams.has("shader")) {

        shaderName = urlParams.get("shader");
    }
    shaderName = "PixelShader_" + shaderName;
    let speedFactor = 48.0;
    if (urlParams.has("speed")) {

        speedFactor = parseInt(urlParams.get("speed"));
        if (speedFactor < 32 ||
            speedFactor > 130072 ||
            isNaN(speedFactor)) {

            speedFactor = 65536;
        }
    }

    ///////////////////////////
    // Allocate the vertex and pixel shader instances.
    const vs = new VertexShader_Orthographic();
    let ps = null;
    
    try {
        
        ps = eval(`new ${shaderName}(${speedFactor})`);
    } catch {

        // Don't fail, just default.
        ps = new PixelShader_CircleInversion(speedFactor);
    }

    ///////////////////////////
    // Create the scene.
    let scene = new THREE.Scene();

    // Create a renderer, set its side & add it to the DOM.
    let renderer = new THREE.WebGLRenderer({

        antialias: true
    });
    renderer.setSize(window.innerWidth,
        window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create a camera, zoom it out from the model a bit, and add it to the scene.
    let camera = new THREE.PerspectiveCamera(60,
        window.innerWidth / window.innerHeight,
        0.1,
        20000);
    camera.position.set(0, 0.2, 0);
    scene.add(camera);

    // Create an event listener that resizes the renderer with the browser window.
    window.addEventListener("resize", () => {

        // Update the renderer and the camera.
        renderer.setSize(window.innerWidth,
            window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
    });

    // Define simple plane geometry upon which to display the fractal.
    var geometry = new THREE.PlaneGeometry(1,
        1,
        1,
        1);

    // Create the shader material.
    var shaderMaterial = new THREE.ShaderMaterial({

        uniforms: ps.uniforms,
        vertexShader: vs.content,
        fragmentShader: ps.content
    });

    // Allocate the mesh which is added to the scene.
    var mesh = new THREE.Mesh(geometry,
        shaderMaterial);
    mesh.rotateX(-Math.PI / 2);
    scene.add(mesh);

    // Add OrbitControls to pan around with the mouse.
    let controls = new THREE.OrbitControls(camera,
        renderer.domElement);
    controls.enabled = ENABLE_CONTROL;

    ///////////////////////////////
    // Renders the scene and updates the render as needed.
    const animate = () => {

        // Update uniforms before rendering.
        ps.updateUniforms();

        // Render the scene.
        renderer.render(scene,
            camera);
        controls.update();

        // Schedule next frame.
        requestAnimationFrame(animate);
    };

    // Start the update process.
    animate();
});
