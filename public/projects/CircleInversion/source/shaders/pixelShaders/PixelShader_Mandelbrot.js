///////////////////////////////////
// Pixel Shader.
//

class PixelShader_Mandelbrot extends PixelShaderBase {

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
                    value: 0.0001
                },
                resolution: {

                    type: "v2",
                    shaderType: "vec2",
                    value: new THREE.Vector2(window.innerWidth,
                        window.innerHeight)
                },
                scale: {

                    type: "v2",
                    shaderType: "vec2",
                    value: new THREE.Vector2(1,
                        1)
                },
                colorfactors: {

                    type: "v3",
                    shaderType: "vec3",
                    value: new THREE.Vector3(0.7,
                        0.3,
                        1.0)
                }
            };
        }
        return this.m_uniforms;
    }

    get _subRoutines() {

        return `
        `;
    }

    get _main() {

        return `

            void main(void)
            {
                // Get position in [0.0..1.0].
	            vec2 vPos = (gl_FragCoord.xy / resolution.xy);

                float fTimeFactor = 1000.0;
                float fZoomPercent = cos(time / fTimeFactor) / 2.0 + 0.5;

                vec2 location = vec2(-0.7473, 0.1103);

                float extent = 0.0001 + 0.001 * fZoomPercent;

                vPos = vec2(location.x + (vPos.x - 0.5) * extent, 
                    location.y + (vPos.y - 0.5) * extent);

                float x = 0.0;
                float y = 0.0;
                float iteration = 0.0;
                float max_iteration = 256.0;

                for (int i = 0; i < 256; i++) 
                {
                    if (x * x + y * y > 2.0 * 2.0)
                    {
                        break;
                    }

                    float xtemp = x * x - y * y + vPos.x;
                    y = 2.0 * x * y + vPos.y;
                    x = xtemp;
                    iteration = iteration + 1.0;
                }   

                float normalizedIteration = 1.0 - iteration / max_iteration;
                
                // Cycle the colors...slowly.
	            float fR = sin((time + iteration) * colorfactors.x / 7.0);
	            float fG = cos((time + iteration) * colorfactors.y / 5.0);
	            float fB = -1.0 * sin((time + iteration) * colorfactors.z / 3.0);

                // Normalize to get into full color space.
	            vec3 vBaseColor = normalize(vec3(fR / 2.0 + 0.5,
                    fG / 2.0 + 0.5,
                    fB / 2.0 + 0.5));

	            gl_FragColor =  vec4(normalizedIteration * vBaseColor.x,
                    normalizedIteration * vBaseColor.y,
                    normalizedIteration * vBaseColor.z,
                    1.0);
            }
        `;
    }
}
