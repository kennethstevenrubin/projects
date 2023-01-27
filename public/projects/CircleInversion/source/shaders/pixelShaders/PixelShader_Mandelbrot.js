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
                    value: 0.0
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
                vPos = vec2(vPos.x / 1.0 - 1.5, vPos.y / 1.0 - 1.0);

                float x = 0.0;
                float y = 0.0;
                float iteration = 0.0;
                float max_iteration = 20.0;

                for (int i = 0; i < 20; i++) 
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

                float normalizedIteration = iteration / max_iteration;
                
	            gl_FragColor =  vec4(1.0-normalizedIteration,
                    1.0-normalizedIteration,
                    1.0-normalizedIteration,
                    1.0);
            }
        `;
    }
}
