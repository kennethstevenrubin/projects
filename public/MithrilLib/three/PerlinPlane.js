////////////////////////////////////////
// Unit cube PerlinPlane generator.
// Returns function constructor.
// Note: object axis is oriented to z height and x*y plane.

"use strict";

// Define AMD module.
define(["/MithrilLib/three/core/three.js",
    "/MithrilLib/three/VisualObjectBase.js",
    "/MithrilLib/three/Perlin.js"],
    function (THREE,
        VisualObjectBase,
        Perlin) {

        // Define PerlinPlane constructor function.
        var functionConstructor = function PerlinPlane(iGranularity,
            v3Sun,
            v3OrthogonalColor,
            v3ParallelColor,
            arrayPasses,
            iSharpness) {

            var self = this;            // Uber closure.

            // Inherit from base class.
            self.inherits(VisualObjectBase);

            ////////////////////////////
            // Public fields.

            // The number of subdivisions of the plane.  The bigger 
            // the slower to generate and render but the more detail.
            self.granularity = iGranularity || 256;

            // The sun vector is used in the lighting equation.
            self.sun = v3Sun || new THREE.Vector3(1, 1, 1);
            self.sun.normalize();

            // The sharpness of the lighting.
            // Suggested values: 1..100.
            self.sharpness = iSharpness || 3;

            // Colors which determine the range from orthogonal to parrallel with the light source.
            self.orthogonalColor = v3OrthogonalColor || new THREE.Vector3(96, 32, 0);
            self.parallelColor = v3ParallelColor || new THREE.Vector3(200, 128, 96);

            // Define the number of passes and the frequency and magnitude therewith.
            // Note: the heights are normalized, so the magnitudes are relative.
            self.passes = arrayPasses || [{

                frequency: 4,
                magnitude: 0.5
            }, {

                frequency: 16,
                magnitude: 2
            }, {

                frequency: 64,
                magnitude: 16
            }, {

                frequency: 256,
                magnitude: 64
            }];

            // The height data.
            self.heightData = null;

            ////////////////////////////
            // Private methods.

            // Method called to generate and return a PerlinPlane mesh.
            var m_functionGenerateMesh = function () {

                try {

                    // Use Perlin noise to generate a height map.
                    self.heightData = m_functionGenerateHeightData(self.granularity);

                    // Create the geometry for the new plane.  Use granulatiry to specify 
                    // number of triangle strips and triangles per strip to generate.
                    self.geometry = new THREE.PlaneGeometry(1,
                        1,
                        self.granularity - 1,
                        self.granularity - 1);

                    // Merge the height data into the plane--note that the 
                    // plane is "on-end" so the Z-coordinate is used as height. 
                    for (var i = 0; i < self.geometry.vertices.length; i++) {

                        self.geometry.vertices[i].z = self.heightData[i];
                    }

                    // Generate a canvas image that represents the texture for the PerlinPlane with build in lighting calculation.
                    var canvasTexture = m_functionGenerateTextureCanvas(self.heightData,
                        self.granularity);

                    // Create a texture to simulate color and shadow from the height data.
                    var texture = new THREE.Texture(canvasTexture,
                        new THREE.UVMapping(),
                        THREE.ClampToEdgeWrapping,
                        THREE.ClampToEdgeWrapping);
                    texture.needsUpdate = true;

                    // Create the material from the texture.
                    self.material = new THREE.MeshBasicMaterial({

                        map: texture
                    });

                    // Put together all components to generate the mesh.
                    self.mesh = new THREE.Mesh(self.geometry,
                        self.material);

                    // Rotate so heights are in the Y-coordinate.
                    self.mesh.rotation.x = -Math.PI / 2;

                    // Return instance.
                    return null;
                } catch (e) {

                    return e;
                }
            };

            // Use Perlin noise at varying scales to compose PerlinPlane heights.
            var m_functionGenerateHeightData = function (iGranularity) {

                // Compute number of cells.
                var iNumberOfCells = iGranularity * iGranularity;
                var arrayHeightData = new Float32Array(iNumberOfCells);

                // Get Perlin generator.
                var perlin = new Perlin();

                // Just choose a reference height for Perlin coordinate.
                // Essentially picks the Perlin flavor for this generation.
                var dFlavor = Math.random() * 100;

                // Initialize collection to zero because the main 
                // generation is additive with multiple passes.
                for (var i = 0; i < iNumberOfCells; i++) {

                    arrayHeightData[i] = 0
                }

                // Add multiple passes at different amplitudes.
                for (var j = 0; j < self.passes.length; j++) {

                    // Move up in amplitude.
                    var pass = self.passes[j];

                    // Loop over each cell.
                    for (var i = 0; i < iNumberOfCells; i++) {

                        // Find the cell position coordinates.
                        var iX = i % iGranularity;
                        var iY = ~~(i / iGranularity);

                        // Update the height data cell with the Perlin value at the constructed point.
                        arrayHeightData[i] += Math.abs(perlin.noise(iX / pass.frequency,
                            iY / pass.frequency,
                            dFlavor) * pass.magnitude);
                    }
                }

                // Get the least and greatest values.
                var dLeast = Infinity;
                var dMost = -Infinity;

                // Loop over each cell to find the maxima.
                for (var i = 0; i < iNumberOfCells; i++) {

                    var dHeight = arrayHeightData[i];
                    if (dHeight > dMost) {

                        dMost = dHeight;
                    }
                    if (dHeight < dLeast) {

                        dLeast = dHeight;
                    }
                }

                // Normalize data.
                var dDifference = dMost - dLeast;
                for (var i = 0; i < iNumberOfCells; i++) {

                    arrayHeightData[i] = (arrayHeightData[i] - dLeast) / dDifference; 
                }

                // Return the collection of 
                return arrayHeightData;
            };

            // Helper method looks across the height map to determine
            // the orientation of the triangles which compreise the PerlinPlane.
            var m_functionGenerateTextureCanvas = function (data,
                iGranularity) {

                // Create the canvas to return.
                var canvas = document.createElement('canvas');

                // Size one pixel per triangle.
                canvas.width = iGranularity;
                canvas.height = iGranularity;

                // Get a context to render onto the canvas.
                var context = canvas.getContext("2d");
                context.fillStyle = "#000";
                context.fillRect(0,
                    0,
                    iGranularity,
                    iGranularity);

                // Get the image object from the canvas's context.
                var image = context.getImageData(0,
                    0,
                    canvas.width,
                    canvas.height);

                // Get the color data from the image object.
                var imageData = image.data;

                // Loop over the whole image data stream, set the 
                // color based on the shade computed from the sun.
                for (var iZ = 0; iZ < iGranularity; iZ++) {

                    for (var iX = 0; iX < iGranularity; iX++) {

                        var i = (iX + iZ * iGranularity);

                        var v3Normal = null;
                        if (iX < 2 || iX > iGranularity - 2 - 1) {

                            v3Normal = new THREE.Vector3(0, 1, 0);
                        } else if (iZ < 2 || iZ > iGranularity - 2 - 1) {

                            v3Normal = new THREE.Vector3(0, 1, 0);
                        } else {

                            v3Normal = new THREE.Vector3(data[i - 2] - data[i + 2],
                                0.1 / self.sharpness,
                                data[i - iGranularity * 2] - data[i + iGranularity * 2]);
                            v3Normal.normalize();
                        }

                        // Dot the normal with the sun to get the shade (intensity).
                        var dShade = v3Normal.dot(self.sun);

                        // Set the color components in the imageData.
                        i = (iX + iZ * iGranularity) * 4;
                        imageData[i] = (self.orthogonalColor.x + dShade * (self.parallelColor.x - self.orthogonalColor.x));
                        imageData[i + 1] = (self.orthogonalColor.y + dShade * (self.parallelColor.y - self.orthogonalColor.y));
                        imageData[i + 2] = (self.orthogonalColor.z + dShade * (self.parallelColor.z - self.orthogonalColor.z));
                    }
                }

                // Set the image data back into the context.
                context.putImageData(image,
                    0,
                    0);

                // Return the canvas.
                return canvas;
            };

            // Invoke the generate mesh function.
            var exceptionRet = m_functionGenerateMesh();
            if (exceptionRet !== null) {

                throw exceptionRet;
            }
        };

        // Do function injection.
        functionConstructor.inheritsFrom(VisualObjectBase);

        // Return constructor function.
        return functionConstructor;
    });