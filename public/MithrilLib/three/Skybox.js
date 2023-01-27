////////////////////////////////////////
// Cube with texture mapped to the inside.
// Returns constructor function.

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js"],
    function (THREE) {

        // Define Skybox constructor function.
        var functionSkybox = function Skybox(context,
            strPrefix,
            strTop,
            strBottom,
            strLeft,
            strRight,
            strFront,
            strBack,
            iSize,
            bTransparent) {

            // As with all modules, define "this" closure up-front.
            var self = this;

            // On allocation, simply augment the scene with the meshes.

            /////////////////////////////////
            // Bottom.
            var geometry = new THREE.PlaneGeometry(iSize,
                iSize);
            var texture = THREE.ImageUtils.loadTexture(strPrefix +
                strBottom);
            var material = new THREE.MeshBasicMaterial({

                color: 0xffffff,
                transparent: bTransparent || false,
                map: texture
            });
            var mesh = new THREE.Mesh(geometry,
                material);
            mesh.rotation.x = -Math.PI / 2;
            mesh.position.y = -iSize / 2;

            context.scene.add(mesh);

            /////////////////////////////////
            // Top.
            geometry = new THREE.PlaneGeometry(iSize,
                iSize);
            texture = THREE.ImageUtils.loadTexture(strPrefix +
                strTop);
            material = new THREE.MeshBasicMaterial({

                color: 0xffffff,
                transparent: bTransparent || false,
                map: texture
            });
            mesh = new THREE.Mesh(geometry,
                material);
            mesh.rotation.x = Math.PI / 2;
            mesh.position.y = iSize / 2;
            context.scene.add(mesh);

            /////////////////////////////////
            // Left.
            geometry = new THREE.PlaneGeometry(iSize,
                iSize);
            texture = THREE.ImageUtils.loadTexture(strPrefix +
                strLeft);
            material = new THREE.MeshBasicMaterial({

                color: 0xffffff,
                transparent: bTransparent || false,
                map: texture
            });
            mesh = new THREE.Mesh(geometry,
                material);
            mesh.rotation.y = Math.PI / 2;
            mesh.position.x = -iSize / 2;
            context.scene.add(mesh);

            /////////////////////////////////
            // Right.
            geometry = new THREE.PlaneGeometry(iSize,
                iSize);
            texture = THREE.ImageUtils.loadTexture(strPrefix +
                strRight);
            material = new THREE.MeshBasicMaterial({

                color: 0xffffff,
                transparent: bTransparent || false,
                map: texture
            });
            mesh = new THREE.Mesh(geometry,
                material);
            mesh.rotation.y = -Math.PI / 2;
            mesh.position.x = iSize / 2;
            context.scene.add(mesh);

            /////////////////////////////////
            // Back.
            geometry = new THREE.PlaneGeometry(iSize,
                iSize);
            texture = THREE.ImageUtils.loadTexture(strPrefix +
                strBack);
            material = new THREE.MeshBasicMaterial({

                color: 0xffffff,
                transparent: bTransparent || false,
                map: texture
            });
            mesh = new THREE.Mesh(geometry,
                material);
            mesh.position.z = -iSize / 2;
            context.scene.add(mesh);

            /////////////////////////////////
            // Front.
            geometry = new THREE.PlaneGeometry(iSize,
                iSize);
            texture = THREE.ImageUtils.loadTexture(strPrefix +
                strFront);
            material = new THREE.MeshBasicMaterial({

                color: 0xffffff,
                transparent: bTransparent || false,
                map: texture
            });
            mesh = new THREE.Mesh(geometry,
                material);
            mesh.rotation.y = -Math.PI;
            mesh.position.z = iSize / 2;
            context.scene.add(mesh);
        };

        // Return constructor function.
        return functionSkybox;
    });