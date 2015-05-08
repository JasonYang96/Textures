//represent gl object
var gl;

//points holds vertices for triangles
var points = [];
var colors = [];
var texCoords = [];

//theta variables and bools along with it
var cubeTheta = 0.0;
var cubeRotate = true;
var textureTheta = 0.0;
var textureRotate = true;

//vertex color location variable
var vColorLoc;

//perspective matrix variables
var pMatrix;
var fov = 45.0;
var aspect;
var near = 0.1;
var far = 200;

//different matrices
var tMatrix;
var mvMatrix;
var Matrix;
var MatrixLoc;

//x,y,z coord, and heading variable for camera movement
var coord = [ 0, 0, 0 ];

//texture coordinates
var texture;
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

//vertex vectors
var vertices = [
    vec4( -1.0, -1.0,  1.0, 1.0 ),
    vec4( -1.0,  1.0,  1.0, 1.0 ),
    vec4(  1.0,  1.0,  1.0, 1.0 ),
    vec4(  1.0, -1.0,  1.0, 1.0 ),
    vec4( -1.0, -1.0, -1.0, 1.0 ),
    vec4( -1.0,  1.0, -1.0, 1.0 ),
    vec4(  1.0,  1.0, -1.0, 1.0 ),
    vec4(  1.0, -1.0, -1.0, 1.0 ),
];

//color array
var vertexColors = [
    [ 0.0, 0.0, 0.0, 1.0 ],  // black
    [ 0.0, 0.0, 1.0, 1.0 ],  // blue
    [ 0.0, 1.0, 0.0, 1.0 ],  // green
    [ 0.0, 1.0, 1.0, 1.0 ],  // cyan
    [ 1.0, 0.0, 0.0, 1.0 ],  // red
    [ 1.0, 0.0, 1.0, 1.0 ],  // magenta
    [ 1.0, 1.0, 0.0, 1.0 ],  // yellow
    [ 0.5, 0.5, 0.5, 1.0 ],  // grey
];

//array of matrices to instance 2 cubes
var cubes = [
    translate( 5, 0, 0),
    translate( -5, 0, 0),
];

//push vertices for one cube at origin
function quad(a, b, c, d) {
     points.push(vertices[a]); 
     colors.push(vertexColors[a]); 
     //texCoords.push(texCoord[0]);

     points.push(vertices[b]); 
     colors.push(vertexColors[a]);
     //texCoords.push(texCoord[1]); 

     points.push(vertices[c]); 
     colors.push(vertexColors[a]);
     //texCoords.push(texCoord[2]); 
   
     points.push(vertices[a]); 
     colors.push(vertexColors[a]);
     //texCoords.push(texCoord[0]); 

     points.push(vertices[c]); 
     colors.push(vertexColors[a]);
     //texCoords.push(texCoord[2]); 

     points.push(vertices[d]); 
     colors.push(vertexColors[a]);
     //texCoords.push(texCoord[3]);   
}

//creates one cube at the origin
function cube()
{
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

window.onload = function init()
{
	//initialize canvas and webGL
    var canvas = document.getElementById( "gl-canvas" );
    aspect = canvas.width/canvas.height;
	    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebG isn't available" ); }

    //create a cube
    cube();

    //configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    // get variable from shader
    MatrixLoc = gl.getUniformLocation( program, "Matrix");

    //create and bind color buffer
    var cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );
    
    //send to shader
    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );

    //create and bind vertex buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    
    //send to shader
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    /*//create and bind texel buffer
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoords), gl.STATIC_DRAW );
    
    //send to shader
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord )*/;

    //event listener
    window.onkeydown = function(event) {
        var key = event.keyCode > 48 ? String.fromCharCode(event.keyCode) : event.keyCode;
        var radian = radians(headingAngle);
        switch(key) {
            case 'I':
                coord[0] -=(.25 * Math.sin(radian));
                coord[2] +=(.25 * Math.cos(radian));
                break;
            case 'O':
                coord[0] +=(.25 * Math.sin(radian));
                coord[2] -=(.25 * Math.cos(radian));
                break;   
            case 'R':
                break;
            case 'S':
                break;
            case 'T':
                break;
            default:
                break;
        }
    };
    
    render();
};

function render() {
    //clear canvas
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );
    
    //rotate by theta and send to shader
    cubeTheta += 36.0;

    //apply model-view matrix
    pMatrix = perspective(fov, aspect, near, far);
    tMatrix = translate( coord[0], coord[1], coord[2]);
    mvMatrix = mult(pMatrix, tMatrix);

    gl.uniformMatrix4fv(MatriLxoc, false, flatten(mvMatrix));
    gl.drawArrays( gl.TRIANGLES, 0, 36 );

    /*//instance 2 cubes with different colors
    for (var i = 0; i < cubes.length; ++i) {
        Matrix = mult(mvMatrix, cubes[i]);
        gl.uniformMatrix4fv(MatrixLoc, false, flatten(Matrix));

        //set up color of triangles then draw
        //gl.uniform4fv(vColorLoc, [ 1.0, 0.0, 0.0, 1.0 ]);
        gl.drawArrays( gl.TRIANGLES, 0, 36 );
    }*/

    //call render on browser refresh
    requestAnimFrame( render );
}