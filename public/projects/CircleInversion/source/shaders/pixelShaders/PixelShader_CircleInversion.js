///////////////////////////////////
// Pixel Shader.
//

class PixelShader_CircleInversion extends PixelShaderBase {

    // Initialize class hierarchy.
    constructor(speedFactor) {

        super(speedFactor);
    }

    updateUniforms() {

        this.uniforms.resolution.value = new THREE.Vector2(window.innerWidth,
            window.innerHeight);
        this.uniforms.time.value = ((new Date().getTime() - this.startTime) / this.speedFactor);
    }

    get uniforms() {

        if (!this.m_uniforms) {

            this.m_uniforms = {

                time: {

                    type: "f",
                    shaderType: "float",
                    value: 0.1
                },
                resolution: {

                    type: "v2",
                    shaderType: "vec2",
                    value: new THREE.Vector2(window.innerWidth,
                        window.innerHeight)
                },
                aspectstretch: {

                    type: "v2",
                    shaderType: "vec2",
                    value: new THREE.Vector2(1,
                        1)
                },
                scale: {

                    type: "v2",
                    shaderType: "vec2",
                    value: new THREE.Vector2(1,
                        1)
                },
                cycleoffset: {

                    type: "v2",
                    shaderType: "vec2",
                    value: new THREE.Vector2(0.0010123,
                        0.100567)
                },
                reflectionradius: {

                    type: "f",
                    shaderType: "float",
                    value: 0.75
                },
                colorfactors: {

                    type: "v3",
                    shaderType: "vec3",
                    value: new THREE.Vector3(0.0073,
                        0.0037,
                        0.0083)
                }
            };
        }
        return this.m_uniforms;
    }

    get _subRoutines() {

        return `
        
            // Define inversion sub-routine from the definition
            // as specified by Apollonius of Perga circa ~200 BC.
            vec2 CircleInversion(vec2 vPos,
                vec2 vOrigin,
                float fRadius)
            {
                // Define a ray from the origin to the specified position.
	            vec2 vOP = vPos - vOrigin;

                // Choose a point along the ray.
	            vOrigin = vOrigin - vOP * fRadius / dot(vOP, vOP);
	            // Used to be: vOrigin = vOrigin - vOP * fRadius * fRadius / dot(vOP, vOP);?

                // Reflect about the circumfrence.
	            vOrigin.x += sin(vOrigin.x * aspectstretch.x);
	            vOrigin.y -= cos(vOrigin.y * aspectstretch.y);

                // Return.
	            return vOrigin;
            }
        `;
    }

    get _main() {

        return `

            // Main method: normalizes fragment position,
            // chooses a point on the circle, recursively
            // iterates its inversion and ouputs to geometry.
            void main(void)
            {
                // Get position in [-0.5..0.5].
	            vec2 vPos = gl_FragCoord.xy / resolution.xy - 0.5;

                // Adjust for aspect ratio.
	            vPos.x *= resolution.x / resolution.y;

                // Choose a time-based point on or around the circle as a re-entrant fractal seed.
                // Notice the X parameter of the offset is sinusoidal, and the Y parameter is tangental.
	            vec2 vOffset = vec2(sin(time * cycleoffset.x),
                    atan(time * cycleoffset.y));

                // Iterate the fractal.
                for (int i = 0; i < 32; i++)
	            {
                    // This abs call is critical to getting the kaleidoscope effect.
		            vPos.x = abs(vPos.x);

                    // Here, each iteration is bounced around the circle.
		            vPos = vPos * scale + vOffset;

                    // Call down to the inversion routine--this evicerates the circle, exposing structure.
                    // Notice that the circle inversion takes the output position as an input parameter.
		            vPos = CircleInversion(vPos,
                        vec2(0.5,
                            0.5),             // The center.
                        reflectionradius);    // Magic number.  Too small -> mush.  Too big -> mush.  Just right -> awesome!
	            }

                // Cycle the colors...slowly.
	            float fR = sin(time * colorfactors.x);
	            float fG = cos(time * colorfactors.y);
	            float fB = sin(time * colorfactors.z);

                // Normalize to get into full color space.
	            vec3 vBaseColor = normalize(vec3(fR / 2.0 + 0.5,
                    fG / 2.0 + 0.5,
                    fB / 2.0 + 0.5));

                // Position length is critical to differentiating the intensity of the shape.
                float fPosLength = length(vPos);
	            vec3 vColor = vBaseColor * fPosLength * fPosLength;

                // Soften up the color slightly.
	            vColor = 1.0 - exp2(-vColor);

                // Finally, output with full opacity.
	            gl_FragColor = vec4(vColor,
                    1.0);
            }
        `;
    }
}
