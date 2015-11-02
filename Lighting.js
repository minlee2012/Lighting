/**
 * Min Lee
 * Jami Montgomery
 * COSC-275 Computer Graphics
 */
/**
 *
 */
// Main function
// Runs in Browser

function main() {
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }//Rendering context

    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to initialize shaders.');
        return;
    }//Initializing source shaders 

    var n = initCubeBuffers(gl);
    if (n < 0) {
        console.log('Failed to set the positions of the cube vertices');
        return;
    }//Initializing cube buffers

    //Setting canvas color
    gl.clearColor(0, 0.5, 1, 1);

    var u_mvpMatrix = gl.getUniformLocation(gl.program, 'u_mvpMatrix');
    if (!u_mvpMatrix) {
        console.log('Failed to get the storage locations of u_mvpMatrix');
        return;
    }//Storage location of u_mvpMatrix

    //initialize model, view, and projection matrices
    //combined view and projection as one matrix from the beginning
    //mvp will be the final one that houses all three to be sent down to the vertex shader (for efficiency)
    var modelMatrix = new Matrix4(); // The model matrix
    var vpMatrix = new Matrix4(); //The view * projection matrix
    var mvpMatrix = new Matrix4();    // Model view projection matrix

    //Setting perspective and camera view
    vpMatrix.setPerspective(40, 1, 1, 100);
    vpMatrix.lookAt(3, 2, 7, 0, 0, 0, 0, 1, 0);

    // Clear color and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    //Depth testing
    gl.enable(gl.DEPTH_TEST);

    //DRAWING*********************************************************************************

    //TOP LEFT VIEWPORT (NO LIGHTING) --------------------------------------------------------
    gl.viewport(0, gl.drawingBufferHeight/2, gl.drawingBufferWidth/2, gl.drawingBufferHeight/2);
    mvpMatrix.set(vpMatrix).multiply(modelMatrix);
    //sending mvpMatrix down
    gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

    //drawing cube
    gl.drawArrays(gl.TRIANGLES, 0, n);

    //initializing buffer for pyramid
    var m = initPyramidBuffers(gl);
    //Rotate, translating and scaling model matrix to apply to pyramid
    modelMatrix.translate(0, -1.5, 0);
    mvpMatrix.set(vpMatrix).multiply(modelMatrix);
    gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);
    //drawing pyramid
    gl.drawArrays(gl.TRIANGLES, 0, m);

    //reinitializing cube buffers so that the other draw functions draw that and not a pyramid
    initCubeBuffers(gl);

    //BOTTOM LEFT VIEWPORT (JUST AMBIENT LIGHTING) ---------------------------------------------
    gl.viewport(0, 0, gl.drawingBufferWidth/2, gl.drawingBufferHeight/2);
    if (!initShaders(gl, VSHADER_AMBIENT, FSHADER_AMBIENT)) {
        console.log('Failed to initialize ambient shaders.');
        return;
    }
    var u_mvpMatrix = gl.getUniformLocation(gl.program, 'u_mvpMatrix');
    var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
    if (!u_mvpMatrix || !u_AmbientLight) {
        console.log('Failed to get the storage locations of ambient uniforms');
        return;
    }//Storage location of ambient uniforms

    // Set the ambient light
    gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

    modelMatrix.translate(0, 1.5, 0);
    mvpMatrix.set(vpMatrix).multiply(modelMatrix);
    //sending mvpMatrix down
    gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

    //drawing cube
    gl.drawArrays(gl.TRIANGLES, 0, n);

    //initializing buffer for pyramid
    var m = initPyramidBuffers(gl);
    //Rotate, translating and scaling model matrix to apply to pyramid
    modelMatrix.translate(0, -1.5, 0);
    mvpMatrix.set(vpMatrix).multiply(modelMatrix);
    gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);
    //drawing pyramid
    gl.drawArrays(gl.TRIANGLES, 0, m);
    //reinitializing cube buffers so that the other draw functions draw that and not a pyramid
    initCubeBuffers(gl);

    //TOP RIGHT VIEWPORT (DIRECTIONAL AND DIFFUSE LIGHTING) --------------------------------------
    gl.viewport(gl.drawingBufferWidth/2, gl.drawingBufferHeight/2, gl.drawingBufferWidth/2, gl.drawingBufferHeight/2);
    if (!initShaders(gl, VSHADER_DIR_DIFFUSE, FSHADER_DIR_DIFFUSE)) {
        console.log('Failed to initialize directional and diffuse shaders.');
        return;
    }
    var u_mvpMatrix = gl.getUniformLocation(gl.program, 'u_mvpMatrix');
    var u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
    var u_lightDirection = gl.getUniformLocation(gl.program, 'u_lightDirection');
    if (!u_mvpMatrix || !u_lightColor || !u_lightDirection) {
        console.log('Failed to get the storage locations of directional and diffuse uniforms');
        return;
    }//Storage location of directional and diffuse uniforms

    initCubeBuffers(gl);

    // Set the light color (white)
    gl.uniform3f(u_lightColor, 1.0, 1.0, 1.0);
    // Set the light direction (in the world coordinate)
    var lightDirection = new Vector3([0.5, 3.0, 4.0]);
    lightDirection.normalize();
    gl.uniform3fv(u_lightDirection, lightDirection.elements);

    modelMatrix.translate(0, 1.5, 0);
    mvpMatrix.set(vpMatrix).multiply(modelMatrix);
    //sending mvpMatrix down
    gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

    //drawing cube
    gl.drawArrays(gl.TRIANGLES, 0, n);

    //initializing buffer for pyramid
    var m = initPyramidBuffers(gl);
    //Rotate, translating and scaling model matrix to apply to pyramid
    modelMatrix.translate(0, -1.5, 0);
    mvpMatrix.set(vpMatrix).multiply(modelMatrix);
    gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);
    //drawing pyramid
    gl.drawArrays(gl.TRIANGLES, 0, m);
    //reinitializing cube buffers so that the other draw functions draw that and not a pyramid
    initCubeBuffers(gl);

    //BOTTOM RIGHT VIEWPORT (ALL LIGHTING) --------------------------------------
    gl.viewport(gl.drawingBufferWidth/2, 0, gl.drawingBufferWidth/2, gl.drawingBufferHeight/2);
    if (!initShaders(gl, VSHADER_ALL, FSHADER_ALL)) {
        console.log('Failed to initialize all-lighting shaders.');
        return;
    }
    var u_mvpMatrix = gl.getUniformLocation(gl.program, 'u_mvpMatrix');
    var u_lightColor = gl.getUniformLocation(gl.program, 'u_lightColor');
    var u_lightDirection = gl.getUniformLocation(gl.program, 'u_lightDirection');
    var u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
    if (!u_mvpMatrix || !u_lightColor || !u_lightDirection || !u_AmbientLight) {
        console.log('Failed to get the storage locations of all-lighting uniforms');
        return;
    }//Storage location of all-lighting uniforms

    initCubeBuffers(gl);

    // Set the ambient light
    gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);
    // Set the light color (white)
    gl.uniform3f(u_lightColor, 1.0, 1.0, 1.0);
    // Set the light direction (in the world coordinate)
    var lightDirection = new Vector3([0.5, 3.0, 4.0]);
    lightDirection.normalize();
    gl.uniform3fv(u_lightDirection, lightDirection.elements);

    modelMatrix.translate(0, 1.5, 0);
    mvpMatrix.set(vpMatrix).multiply(modelMatrix);
    //sending mvpMatrix down
    gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);

    //drawing cube
    gl.drawArrays(gl.TRIANGLES, 0, n);

    //initializing buffer for pyramid
    var m = initPyramidBuffers(gl);
    //Rotate, translating and scaling model matrix to apply to pyramid
    modelMatrix.translate(0, -1.5, 0);
    mvpMatrix.set(vpMatrix).multiply(modelMatrix);
    gl.uniformMatrix4fv(u_mvpMatrix, false, mvpMatrix.elements);
    //drawing pyramid
    gl.drawArrays(gl.TRIANGLES, 0, m);

}//main

function initCubeBuffers(gl) {

    var cubeVertices = new Float32Array([
        //Front face
        0.5,  0.5,  0.5,
        -0.5,  0.5,  0.5,
        -0.5, -0.5,  0.5,

        -0.5, -0.5,  0.5,
        0.5, -0.5,  0.5,
        0.5,  0.5,  0.5,

        //Top face
        0.5,  0.5,  0.5,
        0.5,  0.5, -0.5,
        -0.5,  0.5, -0.5,

        -0.5,  0.5, -0.5,
        -0.5,  0.5,  0.5,
        0.5,  0.5,  0.5,

        //Right face
        0.5,  0.5,  0.5,
        0.5,  0.5, -0.5,
        0.5, -0.5, -0.5,

        0.5, -0.5, -0.5,
        0.5, -0.5,  0.5,
        0.5,  0.5,  0.5,

        //Left face
        -0.5,  0.5,  0.5,
        -0.5,  0.5, -0.5,
        -0.5, -0.5, -0.5,

        -0.5, -0.5, -0.5,
        -0.5, -0.5,  0.5,
        -0.5,  0.5,  0.5,

        //Bottom face
        0.5,  -0.5,  0.5,
        0.5,  -0.5, -0.5,
        -0.5,  -0.5, -0.5,

        -0.5, -0.5, -0.5,
        -0.5,  -0.5,  0.5,
        0.5,  -0.5,  0.5,

        //Back face
        0.5,  0.5,  -0.5,
        -0.5,  0.5,  -0.5,
        -0.5, -0.5,  -0.5,

        -0.5, -0.5,  -0.5,
        0.5, -0.5,  -0.5,
        0.5,  0.5,  -0.5,

    ]);

    var n = 36; // The number of vertices

    // Create a buffer object
    var cubeVertexBuffer = gl.createBuffer();
    if (!cubeVertexBuffer) {
        console.log('Failed to create the buffer object for vertices');
        return -1;
    }

    // Bind the vertex buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    var cubeColors = new Float32Array([
        //Front face
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        //Top face
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        //Right face
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        //Left face
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        //Bottom face
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        //Back face
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0

    ]);

    var cubeColorBuffer = gl.createBuffer();
    if (!cubeColorBuffer) {
        console.log('Failed to create the buffer object for color');
        return -1;
    }

    // Bind the color buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, cubeColors, gl.STATIC_DRAW);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return -1;
    }

    // Assign the buffer object to a_Color variable
    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Color variable
    gl.enableVertexAttribArray(a_Color);

    var cubeNormals = new Float32Array([
        // Front face
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,

        // Top face
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,
       0.0,  1.0,  0.0,

        // Right face
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,

        // Left face
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,

        // Bottom face
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,

        // Back face
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0
    ]);

    var cubeNormalBuffer = gl.createBuffer();
    if (!cubeNormalBuffer) {
        console.log('Failed to create the buffer object for normals');
        return -1;
    }

    // Bind the color buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, cubeNormals, gl.STATIC_DRAW);

    var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Normal');
        return -1;
    }

    // Assign the buffer object to a_Normal variable
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Normal variable
    gl.enableVertexAttribArray(a_Normal);

    return n;
}//initCubeBuffers

function initPyramidBuffers(gl) {

    var pyramidVertices = new Float32Array([

        //Pyramid Vertices

        //Front Face
        -0.5, -0.5, 0.5,
        0.0, 0.5, 0.0,
        0.5, -0.5, 0.5,

        //Right Face
        0.5, -0.5, 0.5,
        0.0, 0.5, 0.0,
        0.5, -0.5, -0.5,

        //Back Face
        0.5, -0.5, -0.5,
        0.0, 0.5, 0.0,
        -0.5, -0.5, -0.5,

        //Left Face
        -0.5, -0.5, -0.5,
        0.0, 0.5, 0.0,
        -0.5, -0.5, 0.5,

        //Bottom Face
        -0.5, -0.5, 0.5,
        -0.5, -0.5, -0.5,
        0.5, -0.5, -0.5,

        0.5, -0.5, -0.5,
        0.5, -0.5, 0.5,
        -0.5, -0.5, 0.5

    ]);

    var m = 18; // The number of vertices

    // Create a buffer object
    var pyramidVertexBuffer = gl.createBuffer();
    if (!pyramidVertexBuffer) {
        console.log('Failed to create the buffer object for vertices');
        return -1;
    }

    // Bind the vertex buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, pyramidVertices, gl.STATIC_DRAW);

    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }

    // Assign the buffer object to a_Position variable
    gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Position variable
    gl.enableVertexAttribArray(a_Position);

    var pyramidColors = new Float32Array([

        //Pyramid Colors

        //Front face
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        //Right face
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        //Back face
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        //Left face
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,

        //Bottom face
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0,
        1.0, 0.0, 0.0, 1.0

    ]);

    var pyramidColorBuffer = gl.createBuffer();
    if (!pyramidColorBuffer) {
        console.log('Failed to create the buffer object for color');
        return -1;
    }

    // Bind the color buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidColorBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, pyramidColors, gl.STATIC_DRAW);

    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return -1;
    }

    // Assign the buffer object to a_Color variable
    gl.vertexAttribPointer(a_Color, 4, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Color variable
    gl.enableVertexAttribArray(a_Color);

    var pyramidNormals = new Float32Array([
        // Front face
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,
       0.0,  0.0,  1.0,

        // Right face
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,
       1.0,  0.0,  0.0,

        // Back face
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,
       0.0,  0.0, -1.0,

        // Left face
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,
      -1.0,  0.0,  0.0,

        // Bottom face
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0,
       0.0, -1.0,  0.0
    ]);

    var pyramidNormalBuffer = gl.createBuffer();
    if (!pyramidNormalBuffer) {
        console.log('Failed to create the buffer object for pyramid normals');
        return -1;
    }

    // Bind the color buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidNormalBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, pyramidNormals, gl.STATIC_DRAW);

    var a_Normal = gl.getAttribLocation(gl.program, 'a_Normal');
    if (a_Color < 0) {
        console.log('Failed to get the storage location of a_Normal');
        return -1;
    }

    // Assign the buffer object to a_Normal variable
    gl.vertexAttribPointer(a_Normal, 3, gl.FLOAT, false, 0, 0);

    // Enable the assignment to a_Normal variable
    gl.enableVertexAttribArray(a_Normal);

    return m;
}//initPyramidBuffers

// Shaders
// Vertex and Fragment
var VSHADER_SOURCE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_mvpMatrix;\n' +
  'varying lowp vec4 vColors;\n' +
  'void main() {\n' +
  '  vColors = a_Color;\n' +
  '  gl_Position = u_mvpMatrix * a_Position;\n' +
'}\n';

var FSHADER_SOURCE =
  'varying lowp vec4 vColors;\n' +
  'precision mediump float;\n' +
  'void main() {\n' +
  '  gl_FragColor = vColors;\n' +
  '}\n';

//*******************************************************
var VSHADER_AMBIENT =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'uniform mat4 u_mvpMatrix;\n' +
  'uniform vec3 u_AmbientLight;\n' +
  'varying lowp vec4 vColors;\n' +
  'void main() {\n' +
  '  gl_Position = u_mvpMatrix * a_Position;\n' +
  '  vec3 ambient = u_AmbientLight * a_Color.rgb;\n' +
  '  vColors = vec4(ambient, a_Color.a);\n' +
'}\n';

var FSHADER_AMBIENT =
  'varying lowp vec4 vColors;\n' +
  'precision mediump float;\n' +
  'void main() {\n' +
  '  gl_FragColor = vColors;\n' +
  '}\n';

//*******************************************************
var VSHADER_DIR_DIFFUSE =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec3 a_Normal;\n' +
  'uniform mat4 u_mvpMatrix;\n' +
  'uniform vec3 u_lightColor;\n' +
  'uniform vec3 u_lightDirection;\n' +
  'varying lowp vec4 vColors;\n' +
  'void main() {\n' +
  '  gl_Position = u_mvpMatrix * a_Position;\n' +
  '  vec3 N = normalize(a_Normal);\n' +
  '  float cosineTheta = max(dot(N, u_lightDirection), 0.0);\n' +
  '  vec3 I_diffuse = a_Color.rgb * u_lightColor.rgb * cosineTheta;\n' +
  '  vColors = vec4(I_diffuse, 1.0);\n' +
'}\n';

var FSHADER_DIR_DIFFUSE =
  'varying lowp vec4 vColors;\n' +
  'precision mediump float;\n' +
  'void main() {\n' +
  '  gl_FragColor = vColors;\n' +
  '}\n';

//*******************************************************
var VSHADER_ALL =
  'attribute vec4 a_Position;\n' +
  'attribute vec4 a_Color;\n' +
  'attribute vec3 a_Normal;\n' +
  'uniform mat4 u_mvpMatrix;\n' +
  'uniform vec3 u_lightColor;\n' +
  'uniform vec3 u_lightDirection;\n' +
  'uniform vec3 u_AmbientLight;\n' +
  'varying lowp vec4 vColors;\n' +
  'void main() {\n' +
  '  gl_Position = u_mvpMatrix * a_Position;\n' +
  '  vec3 N = normalize(a_Normal);\n' +
  '  float cosineTheta = max(dot(N, u_lightDirection), 0.0);\n' +
  '  vec3 I_diffuse = a_Color.rgb * u_lightColor.rgb * cosineTheta;\n' +
  '  vec3 ambient = u_AmbientLight * a_Color.rgb;\n' +
  '  vColors = vec4(I_diffuse + ambient, 1.0);\n' +
'}\n';

var FSHADER_ALL =
  'varying lowp vec4 vColors;\n' +
  'precision mediump float;\n' +
  'void main() {\n' +
  '  gl_FragColor = vColors;\n' +
  '}\n';
