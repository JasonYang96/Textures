# CS174A Spring 2015 Assignment 3
* * * 
###Required Code
>1. This is a README and I have commented my code
>2. The functionality of implementing the images can be found in the function `configureTexture()`. I also loaded the images in my HTML files on lines 43 and 44.
>3. I push the necessary texCoords in the `quad()` function and send the texture I want to use in my render function.
>4. TODO:zoom out picture by 50%
>5. I implemented Mip Mapping in my `configureTexture()` function. For my first cube, I just use `gl.NEAREST` to use the nearest neighbor. For my second cube, I first generate the Mipmap and then use `gl.LINEAR_MIP_LINEAR` to get tri-linear filtering.
>6. I achieved this by using a perspective matrix as well as a translation matrix to view the two cubes in clip space.
>7. I implemented the functionality of these two keys in my event listener function in the init function.

###Extra Credit
>1. I implemented this in my render function. I increment a theta variable by 1 and .5 degrees to achieve 10 and 5 rpm respectively on the first and second cube.
>2. I implemented this in my render function. I would pass in a theta variable that will factor into the position of the TexCoord in the fragment shader
>3. I implemented this in my render function. I would pass in a vec2 to the shader that will offset the TexCoord by a certain amount. The repeat texture mode is on by default.
