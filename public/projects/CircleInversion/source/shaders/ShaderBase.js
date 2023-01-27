///////////////////////////////////
// Shader Base defines the base class
// interface for all shader types.
//

class ShaderBase {

    // Public interface property.  
    get content() {

        return `

            ${(this._highPrecision ? `
            
                // Switch on high precision floats.
                #ifdef GL_ES
                    precision highp float;
                #endif` : ``)}

            ${this._innerContent}
        `;
    }

    // Protected property--extenders must overload!
    get _innerContent() {

        throw new Error(`?Must overload get _innerContent!`);
    }

    // Protected property--extenders overload 
    // this if high precision not required.
    get _highPrecision() {

        return true;
    }
}
