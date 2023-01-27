///////////////////////////////////
// Pixel Shaders.
//

class PixelShaderBase extends ShaderBase {

    constructor(speedFactor) {

        super();

        this.speedFactor = speedFactor;
        this.startTime = new Date().getTime();
    }

    updateUniforms() {

        // Do nothing in base.
    }

    get uniforms() {

        throw new Error("?Must overload get _uniforms!");
    }

    get _innerContent() {

        // Build up uniform string.
        let uniformString = ``;
        for (let uniformKey in this.uniforms) {

            uniformString += `uniform ${this.uniforms[uniformKey].shaderType} ${uniformKey}; `;
        }

        return `

            ${uniformString}

            ${this._subRoutines}

            ${this._main}
        `;
    }

    get _subRoutines() {

        throw new Error("?Must overload get _subRoutines!");
    }

    get _main() {

        throw new Error("?Must overload get _main!");
    }
}
