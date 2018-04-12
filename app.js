var vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'',
'void main() {',
'	gl_Position = vec4(vertPosition, 0.0, 1.0);',
'	fragColor = vertColor;',
'}'
].join('\n');

var fragmentShaderText = 
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'',
'void main() {',
'	gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

var triangleVertices = [
	0.0, 0.5,
	-0.5, -0.5,
	0.5, -0.5
];
var triangleColors = [
	1.0, 0.5, 0.0,
	0.5, 1.0, 0.0,
	0.5, 0.5, 1.0
];

var createShaderProgram = function (gl) {

	// create the shader
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR: compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR: compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR: linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR: validating program!', gl.getProgramInfoLog(program));
		return;
	}

	return program;
};

var createBuffers = function (gl, shader) {

	var VBO = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, VBO);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertices), gl.STATIC_DRAW);
	var positionAttribLoc = gl.getAttribLocation(shader, 'vertPosition');
	gl.vertexAttribPointer
	(positionAttribLoc, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.enableVertexAttribArray(positionAttribLoc);

	var colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleColors), gl.STATIC_DRAW);
	var colorLoc = gl.getAttribLocation(shader, 'vertColor');
	gl.vertexAttribPointer
	(colorLoc, 2, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);
	gl.enableVertexAttribArray(colorLoc);

	return VBO;
};

var InitDemo = function () {
	console.log('This is working');

	var canvas = document.getElementById('game-surface');
	var gl = canvas.getContext('webgl');

	if (!gl) {
		console.log('WebGL no supported, falling back on experimental-webgl');
		gl = canvas.getContext('experimental-webgl');
	}

	if (!gl) {
		alert('Your browser does not support WebGL');
	}

	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;

	gl.viewport(0, 0, window.innerWidth, window.innerHeight);

	// clear the screen 
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var shader = createShaderProgram(gl);
	var VBO = createBuffers(gl, shader);

	gl.useProgram(shader);
	gl.drawArrays(gl.TRIANGLES, 0, 3);
};
