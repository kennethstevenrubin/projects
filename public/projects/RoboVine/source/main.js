///////////////////////////////////////
// GromBots main module.
//
// Returns singleton instance.

"use strict";

define([],
    function () {

        try {

			// Three object:
			var camera = null;
			var scene = null;
			var renderer = null;
			var stats = null;
			var controls = null;
			var arrayMeshArms = [];

			var iNumberOfSegments = 64;
			var dMaximumThickness = 2;
			var dMaximumLength = 1;
			var dMaximumAngularOffsetDivisor = 8;
			var dBaseSizeMultiplier = 1.05;
			var dMaximumRadialChange = 0.001;

			// Helper initializes three and three-scene.
			var functionInitializeThree = function () {

				try {

					// Setup stats element.
                    stats = new Stats();
                    stats.domElement.style.position = "absolute";
                    stats.domElement.style.left = "10px";
                    stats.domElement.style.bottom = "10px";
                    document.body.appendChild(stats.domElement);

					// Allocate the scene.
					scene = new THREE.Scene();

					// Create the camera, initialiez and add to the scene.
					camera = new THREE.PerspectiveCamera(75, 
						window.innerWidth / window.innerHeight, 
						1, 
						1000);
					camera.position.x = 20;
					camera.position.y = 60;
					camera.position.z = 20;
					scene.add(camera);

					// Allocate control and attach it to the camera.
					controls = new THREE.TrackballControls(camera);

					// Add directional light.
					var light = new THREE.DirectionalLight(0xffffff);
      				light.position.set(0, 
      					1, 
      					1).normalize();
      				scene.add(light);

					// Allocate the renderer, in this case, a canvas renderer.
					renderer = new THREE.WebGLRenderer();
					renderer.setSize(window.innerWidth, 
						window.innerHeight);

					// Add the DOM element.
					document.body.appendChild(renderer.domElement);

					// Base0.
					var geometry = new THREE.SphereGeometry(dMaximumThickness * dBaseSizeMultiplier, 
						50, 
						50, 
						false);
					var material = new THREE.MeshPhongMaterial({

						ambient: 0x030303, 
						color: 0xdddddd, 
						specular: 0x009900, 
						shininess: 30 });
					var meshBase = new THREE.Mesh(geometry, 
						material);
					scene.add(meshBase);
					var meshParent = meshBase;

					// Arm0.
					geometry = new THREE.CylinderGeometry(dMaximumThickness, 
						dMaximumThickness, 
						dMaximumLength, 
						50, 
						50, 
						false);
					geometry.applyMatrix(new THREE.Matrix4().rotateZ(Math.PI / 2));
					geometry.applyMatrix(new THREE.Matrix4().translate(new THREE.Vector3(dMaximumLength / 2, 
						0, 
						0)));
                	material = new THREE.MeshPhongMaterial({

						ambient: 0x435363, 
						color: 0x006d2d, 
						specular: 0x999900, 
						shininess: 30 });
					var meshArm = new THREE.Mesh(geometry, 
						material);
					meshParent.add(meshArm);
					arrayMeshArms.push(meshArm);
					meshParent = meshArm;
					var dLength = dMaximumLength;

					// Create some geometry
					for (var i = 1; i < iNumberOfSegments; i++) {

						// Base1..N.
						var geometry = new THREE.SphereGeometry((dMaximumThickness * (iNumberOfSegments - i) / iNumberOfSegments) * dBaseSizeMultiplier, 
							50, 
							50, 
							false);
						var material = new THREE.MeshPhongMaterial({

							color: 0x004d20, 
							specular: 0x004030, 
							shininess: 3 });
						meshBase = new THREE.Mesh(geometry, 
							material);
						meshParent.add(meshBase);
						meshBase.position.set(dLength,
							0,
							0);
						meshBase.rotation.x = Math.PI / (Math.random() * dMaximumAngularOffsetDivisor + 1);
						meshParent = meshBase

						// Arm1..N.
						dLength = (dMaximumLength + dMaximumThickness) * (iNumberOfSegments - i) / iNumberOfSegments;
						geometry = new THREE.CylinderGeometry(dMaximumThickness * (iNumberOfSegments - i) / iNumberOfSegments, 
							dMaximumThickness * (iNumberOfSegments - i) / iNumberOfSegments, 
							dLength, 
							50, 
							50, 
							false);
						geometry.applyMatrix(new THREE.Matrix4().rotateZ(Math.PI / 2));
						geometry.applyMatrix(new THREE.Matrix4().translate(new THREE.Vector3(dLength / 2, 
							0, 
							0)));
	                	material = new THREE.MeshPhongMaterial({

							color: 0x004d2d, 
							specular: 0x004030, 
							shininess: 3 });
						meshArm = new THREE.Mesh(geometry, 
							material);
						meshParent.add(meshArm);
						arrayMeshArms.push(meshArm);
						meshParent = meshArm;
					}

					return null;
				} catch (e) {

					return e;
				}
			};
  
			// Helper causes WebGL to output to display.
			var functionRender = function () {

				try {

					// Render out to the renderer.
					renderer.render(scene, 
						camera);

					return null;
				} catch (e) {

					return e;
				}
			};

			// Helper updates meshes.
			var functionUpdate = function () {

				try {

					for (var i = 0; i < arrayMeshArms.length; i++) {

						arrayMeshArms[i].rotation.y += /*Math.random() **/ dMaximumRadialChange;
					}

					return null;
				} catch (e) {

					return e;
				}
			};

  			// Animation callback method.
			var functionAnimate = function() {

				try {

					// Update.
					var exceptionRet = functionUpdate();
					if (exceptionRet) {

						throw exceptionRet;
					}

					// Render.
					exceptionRet = functionRender();
					if (exceptionRet) {

						throw exceptionRet;
					}

					// Controls.
					controls.update();

					// Stats.
					stats.update();

					// Queue up next call.
					requestAnimationFrame(functionAnimate);
				} catch (e) {

					alert(e.message);
				}
			};

  			// Initialize three.
			var exceptionRet = functionInitializeThree();
			if (exceptionRet) {

				throw exceptionRet;
			}

			// Start the animation sequence.
			functionAnimate();
		} catch (e) {

            alert(e.message);
        }
    });
