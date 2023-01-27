///////////////////////////////////
// Vertex Shader Base defines the base 
// class interface for all vertex shaders.
//

class VertexShader_Orthographic extends VertexShaderBase {

    // Initialize class hierarchy.
    constructor() {

        super();
    }

    get _main() {

        return `

            // Just perform normal view/model/projection transformation to quad.
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        `;
    }
}
