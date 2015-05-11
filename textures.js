//WebGL objects
var gl;
var program;

//arrays to hold points and texture coords
var pointsArray = [];
var texCoordsArray = [];

//texture variables
var eggertImg;
var smallbergImg;
var scrolling = [0.0, 0.0];

//coords of texture and vertices
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0),
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

//variables dealing with rotation of cube
var rotation = true;
var theta = [0.0, 0.0, 0.0];
var thetaLoc;
var axis = [
    [0, 1, 0],
    [1, 0, 0],
];

//matrix variables
var tMatrix;
var mvMatrix;
var Matrix;

//perspective matrix variables
var pMatrix;
var fov = 45.0;
var aspect;
var near = 0.1;
var far = 200;
var coord = [ 0, 0, -5];

//translation matrices for instancing
var cubes = [
    translate( -2, 0, 0),
    translate(  2, 0, 0),
];

//configure images to textures
function configureTexture() {
    //Grab images from HTML
    var eggertImage = document.getElementById("eggertImage");
    var smallbergImage = document.getElementById("smallbergImage");

    //configure 1st image
    gl.activeTexture( gl.TEXTURE0 );
    eggertImg = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, eggertImg );
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, eggertImage );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );

    //configure 2nd image
    gl.activeTexture( gl.TEXTURE1);
    smallbergImg = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, smallbergImg );
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, smallbergImage );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
}

//push vertices and texels into arrays
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

//creates a cube
function colorCube() {
    quad( 1, 0, 3, 2 );
    quad( 2, 3, 7, 6 );
    quad( 3, 0, 4, 7 );
    quad( 6, 5, 1, 2 );
    quad( 4, 5, 6, 7 );
    quad( 5, 4, 0, 1 );
}

//init function
window.onload = function init() {
    //initialize canvas and WebGL
    var canvas = document.getElementById( "gl-canvas" );
    aspect = canvas.width/canvas.height;
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    //configure WebGL
    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.enable(gl.DEPTH_TEST);

    //  Load shaders and initialize attribute buffers
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    //create the cube
    colorCube();

    //bind vertex array
    var vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    //send to shader
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    //bind texel array
    var tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    //send to shader
    var vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    //configure Textures
    configureTexture();

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
    //clear canvas
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    //rotate cubes if rotation bool is true
    if(rotation) {
        theta[0] += 1.0;
        theta[1] += 0.5;
    }
    
    //calculate mvMatrix
    pMatrix = perspective(fov, aspect, near, far);
    tMatrix = translate(coord[0], coord[1], coord[2]);
    mvMatrix = mult(pMatrix,tMatrix);

    //instance cubes
    for(var i = 0; i < cubes.length; i++)
    {
        //scroll texture on each face for 2nd cube
        if(i == 1)
        {
            scrolling[0] += .005;
            if (scrolling[0] == 1.0)
                scrolling[0] = 0.0;
            gl.uniform2fv(gl.getUniformLocation(program, "scrolling"), scrolling);
        }
        else
            gl.uniform2fv(gl.getUniformLocation(program, "scrolling"), [0.0,0.0]);

        gl.uniform1i(gl.getUniformLocation(program, "texture"), i);
        Matrix = mult(mvMatrix, cubes[i]);
        Matrix = mult(Matrix, rotate(theta[i], axis[i]));
        gl.uniformMatrix4fv(gl.getUniformLocation(program, "Matrix"), false, flatten(Matrix));
        gl.drawArrays( gl.TRIANGLES, 0, 36 );
    }

    //call render on browser refresh
    requestAnimFrame(render);
}