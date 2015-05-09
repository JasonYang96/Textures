var gl;
var program;

var pointsArray = [];
var texCoordsArray = [];

var texture;
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];

var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5,  0.5,  0.5, 1.0 ),
    vec4( 0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5,  0.5, -0.5, 1.0 ),
    vec4( 0.5, -0.5, -0.5, 1.0 )
];    

var rotation = true;
var theta = 0.0;
var axis = [
    [0, 1, 0],
    [1, 0, 0],
];

var tMatrix;
var mvMatrix;
var Matrix;
var MatrixLoc;

//perspective matrix variables
var pMatrix;
var fov = 45.0;
var aspect;
var near = 0.1;
var far = 200;

var coord = [ 0, 0, -5];

var cubes = [
    translate( -2, 0, 0),
    translate(  2, 0, 0),
];

var thetaLoc;

function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, 
         gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, 
                      gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}


function quad(a, b, c, d) {
     pointsArray.push(vertices[a]); 
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     texCoordsArray.push(texCoord[1]); 

     pointsArray.push(vertices[c]);
     texCoordsArray.push(texCoord[2]); 
   
     pointsArray.push(vertices[a]);
     texCoordsArray.push(texCoord[0]); 

     pointsArray.push(vertices[c]);
     texCoordsArray.push(texCoord[2]); 

     pointsArray.push(vertices[d]);
     texCoordsArray.push(texCoord[3]);   
}


function colorCube() {
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

window.onload = function init() {

    var canvas = document.getElementById( "gl-canvas" );
    aspect = canvas.width/canvas.height;
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    colorCube();

    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    //
    // Initialize a texture
    //
    var image = document.getElementById("texImage");
    configureTexture( image );

    thetaLoc = gl.getUniformLocation(program, "theta"); 
    vColorLoc = gl.getUniformLocation(program, "vColor");
    MatrixLoc = gl.getUniformLocation(program, "Matrix");

    //event listener
    window.onkeydown = function(event) {
        var key = event.keyCode > 48 ? String.fromCharCode(event.keyCode) : event.keyCode;
        switch(key) {
            case 'I':
                coord[2] +=.25
                break;
            case 'O':
                coord[2] -=.25
                break;
            case 'R':
                rotation = !rotation;
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
}

var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    if(rotation) {
        theta += 1.0;
    }
    
    pMatrix = perspective(fov, aspect, near, far);
    tMatrix = translate(coord[0], coord[1], coord[2]);
    mvMatrix = mult(pMatrix,tMatrix);

    for(var i = 0; i < cubes.length; i++)
    {
        Matrix = mult(mvMatrix, cubes[i]);
        Matrix = mult(Matrix, rotate(theta, axis[i]));
        gl.uniformMatrix4fv(MatrixLoc, false, flatten(Matrix));
        gl.uniform4fv(vColorLoc, [1.0, 1.0, 1.0, 1.0]);
        gl.uniform1f(thetaLoc, theta);
        gl.drawArrays( gl.TRIANGLES, 0, 36 );
    }
    requestAnimFrame(render);
}