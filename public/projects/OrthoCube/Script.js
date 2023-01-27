var cubes = [];
var renderContext = null;
var viewportWidth = 0;
var viewportHeight = 0;
var camera = null;

$(document).ready(function () {

    var cube = new Cube();
    cube.scale.x = 2.5;
    cube.scale.y = 2.5;
    cube.scale.z = 2.5;
    cube.translation.x = 2.5;
    cube.translation.y = 2.5;
    cube.translation.z = 2.5;
    cube.solid = false;
    cube.color = new Color(255,255,255,1);
    cubes.push(cube);

    cube = new Cube();
    cube.scale.x = 2.5;
    cube.scale.y = 2.5;
    cube.scale.z = 2.5;
    cube.translation.x = -2.5;
    cube.translation.y = 2.5;
    cube.translation.z = 2.5;
    cube.solid = false;
    cube.color = new Color(255,255,255,1);
    cubes.push(cube);

    cube = new Cube();
    cube.scale.x = 2.5;
    cube.scale.y = 2.5;
    cube.scale.z = 2.5;
    cube.translation.x = 2.5;
    cube.translation.y = -2.5;
    cube.translation.z = 2.5;
    cube.solid = false;
    cube.color = new Color(255,255,255,1);
    cubes.push(cube);

    cube = new Cube();
    cube.scale.x = 2.5;
    cube.scale.y = 2.5;
    cube.scale.z = 2.5;
    cube.translation.x = -2.5;
    cube.translation.y = -2.5;
    cube.translation.z = 2.5;
    cube.solid = false;
    cube.color = new Color(255,255,255,1);
    cubes.push(cube);

    cube = new Cube();
    cube.scale.x = 2.5;
    cube.scale.y = 2.5;
    cube.scale.z = 2.5;
    cube.translation.x = 2.5;
    cube.translation.y = 2.5;
    cube.translation.z = -2.5;
    cube.solid = false;
    cube.color = new Color(255,255,255,1);
    cubes.push(cube);

    cube = new Cube();
    cube.scale.x = 2.5;
    cube.scale.y = 2.5;
    cube.scale.z = 2.5;
    cube.translation.x = -2.5;
    cube.translation.y = 2.5;
    cube.translation.z = -2.5;
    cube.solid = false;
    cube.color = new Color(255,255,255,1);
    cubes.push(cube);

    cube = new Cube();
    cube.scale.x = 2.5;
    cube.scale.y = 2.5;
    cube.scale.z = 2.5;
    cube.translation.x = 2.5;
    cube.translation.y = -2.5;
    cube.translation.z = -2.5;
    cube.solid = false;
    cube.color = new Color(255,255,255,1);
    cubes.push(cube);

    cube = new Cube();
    cube.scale.x = 2.5;
    cube.scale.y = 2.5;
    cube.scale.z = 2.5;
    cube.translation.x = -2.5;
    cube.translation.y = -2.5;
    cube.translation.z = -2.5;
    cube.solid = false;
    cube.color = new Color(255,255,255,1);
    cubes.push(cube);

    for (var i = 0; i < 128; i++) {
        cube = new Cube();
        cube.scale.x = 0.25;
        cube.scale.y = 0.25;
        cube.scale.z = 0.25;
        cube.translation.x = Math.floor(3 * Math.random()) * 5 - 5;
        cube.translation.y = Math.floor(3 * Math.random()) * 5 - 5;
        cube.translation.z = Math.floor(3 * Math.random()) * 5 - 5;
        var dThree = Math.random();
        if (dThree < 0.3) { 
            cube.velocity.x = Math.random() * 0.05;// - 0.05;
            cube.rotationDX = Math.random() * 0.05;
        } else if (dThree < 0.6) {
            cube.velocity.y = Math.random() * 0.05;// - 0.05;
            cube.rotationDY = Math.random() * 0.05;
        } else {
            cube.velocity.z = Math.random() * 0.05;// - 0.05;
            cube.rotationDZ = Math.random() * 0.05;
        }
        cube.color = new Color();
        cubes.push(cube);
    }

    var canvasRender = document.getElementById("renderer");
    renderContext = canvasRender.getContext("2d");

    viewportWidth = canvasRender.width;
    viewportHeight = canvasRender.height;

    setInterval(Update,
        10);

    setInterval(Render,
        10);
});

function Update() {

    var dTicks = (new Date()).getTime() / 30000;
    var dSin = Math.sin(dTicks);
    var dCos = Math.cos(dTicks);
    camera = new Camera(new Vector3(8 * dSin, 8 * dSin * dCos, 8 * dCos),
        new Vector3(0, 0, 0),
        0);

    for (var i = 0; i < cubes.length; i++) {
        var cube = cubes[i];
        cube.update(viewportWidth,
            viewportHeight,
            camera);
    }
}

function Render() {

    renderContext.fillStyle = "rgba(0,0,0,0.09)";
    renderContext.fillRect(0, 0, viewportWidth, viewportHeight);

    for (var i = 0; i < cubes.length; i++) {
        var cube = cubes[i];
        cube.render(renderContext);
    }
}
