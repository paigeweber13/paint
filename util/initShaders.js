/*  author: Ed Angel website:
 *  https://www.cs.unm.edu/~angel/BOOK/INTERACTIVE_COMPUTER_GRAPHICS/SEVENTH_EDITION/
 *  repo: https://github.com/esangel/WebGL
 *
 *  initShaders.js
 *
 * this function initializes the vertex and fragment shaders
 *
 * License:
 *
 * This software is provided under the MIT License
 * (http://opensource.org/licenses/MIT).
 *
 * Copyright (c) <2012-2015> Ed Angel and Dave Shreiner
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 *
 */
function initShaders( gl, vertexShaderId, fragmentShaderId ) {
	var vertShdr;
	var fragShdr;

	var vertElem = document.getElementById( vertexShaderId );
	if ( !vertElem ) {
		alert( "Unable to load vertex shader " + vertexShaderId );
		return -1;
	}
	else {
		// get the vertex shader source (string) and then compile it

		// create the vertex shader  
		vertShdr = gl.createShader(gl.VERTEX_SHADER);

		// read it - as a string
		gl.shaderSource( vertShdr, vertElem.text );

		// compile it
		gl.compileShader( vertShdr );

		// print error logs if compilation failed
		if ( !gl.getShaderParameter(vertShdr, gl.COMPILE_STATUS) ) {
			var msg = "Vertex shader failed to compile.  The error log is:"
				+ "<pre>" + gl.getShaderInfoLog( vertShdr ) + "</pre>";
			alert( msg );
			return -1;
		}
	}

	// get the fragment shader source (string) and then compile it
	var fragElem = document.getElementById( fragmentShaderId );
	if ( !fragElem ) {
		alert( "Unable to load vertex shader " + fragmentShaderId );
		return -1;
	}
	else {
		// create a fragment shader
		fragShdr = gl.createShader( gl.FRAGMENT_SHADER );

		// read it as a string
		gl.shaderSource( fragShdr, fragElem.text );

		// compile it
		gl.compileShader( fragShdr );

		// print error logs if compilation failed
		if ( !gl.getShaderParameter(fragShdr, gl.COMPILE_STATUS) ) {
			var msg = "Fragment shader failed to compile.  The error log is:"
				+ "<pre>" + gl.getShaderInfoLog( fragShdr ) + "</pre>";
			alert( msg );
			return -1;
		}
	}

	// create  a shader program 
	var program = gl.createProgram();

	// attach the two shaders to the program
	gl.attachShader( program, vertShdr );
	gl.attachShader( program, fragShdr );

	// link the program
	gl.linkProgram( program );

	// if linking failed, print error log
	if ( !gl.getProgramParameter(program, gl.LINK_STATUS) ) {
		var msg = "Shader program failed to link.  The error log is:"
			+ "<pre>" + gl.getProgramInfoLog( program ) + "</pre>";
		alert( msg );
		return -1;
	}
	return program;
}
