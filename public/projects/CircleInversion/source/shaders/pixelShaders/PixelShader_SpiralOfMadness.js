///////////////////////////////////
// Pixel Shader.
//

class PixelShader_SpiralOfMadness extends PixelShaderBase {

    // Initialize class hierarchy.
    constructor(speedFactor) {

        super(speedFactor);
    }

    updateUniforms() {

        this.uniforms.resolution.value = new THREE.Vector2(window.innerWidth,
            window.innerHeight);
        this.uniforms.time.value = (new Date().getTime() - this.startTime) / this.speedFactor;
    }

    get uniforms() {

        if (!this.m_uniforms) {

            this.m_uniforms = {

                time: {

                    type: "f",
                    shaderType: "float",
                    value: 0
                },
                resolution: {

                    type: "v2",
                    shaderType: "vec2",
                    value: new THREE.Vector2(window.innerWidth,
                        window.innerHeight)
                }
            };
        }
        return this.m_uniforms;
    }

    get _subRoutines() {

        return ``;
    }

    get _main() {

        return `

            void main (void)
            {
                // Spiral of madness.
                vec2 p = (gl_FragCoord.xy / resolution.xy) - 0.5;
                float c = 0.0;
                float a = atan(p.x, p.y) * 10.0;
                float d = 8.0 / length(p);
                c = (atan(cos(d-a+time)*20.)*9./pow((d),1.15));
                gl_FragColor = vec4(vec3(2.0, 1.5, 8.0) * vec3(c * c, c * c - c, c * c * c / (1.0 + c)), 1);
            }
        `;
    }
}
