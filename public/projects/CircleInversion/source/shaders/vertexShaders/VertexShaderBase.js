///////////////////////////////////
// Vertex Shader Base defines the base 
// class interface for all vertex shaders.
//
// Clients access content propery.  
//

class VertexShaderBase extends ShaderBase {

    // Initialize class hierarchy.
    constructor() {

        super();
    }

    get _innerContent() {

        return `

            // Define entry-point for vertex shader.
            void main()
            {
                ${this._main}
            }
        `;
    }

    get _main() {

        throw new Error("?Must overload get _main!");
    }
}
