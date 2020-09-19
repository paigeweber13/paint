
var gl;

var delay = 100;
var selection = "square";
var canvas;
var vBuffer, cBuffer;
var isMouseDown = false;

var program;
var num_vertices = 0;
var vertices = [];
var vertex_colors = [];

window.onload = function init() {
  canvas = document.getElementById("gl-canvas");

  gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) { alert("WebGL isn't available"); }

  //
  //  Configure WebGL
  //
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(0.8, 0.8, 0.8, 1.0);

  //  Load shaders and initialize attribute buffers

  program = initShaders(gl, "vertex-shader", "fragment-shader");
  gl.useProgram(program);


  // Create a buffer to hold the  vertices
  vBuffer = gl.createBuffer();

  // Create a buffer to hold the  colors
  cBuffer = gl.createBuffer();

  // create vertices, colors and set attributes for GL
  // updateVertices(program);

  // set mouse and keyboard handlers
  setEventHandlers();

  render();
}

function updateVertices(program) {
  // ---- vertex buffer ---- //

  // bind it to make it active
  gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);

  // send the data as an array to GL

  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  // Associate out shader variables with our data buffer

  // get a location to the vertex position's shader variable ('vPosition')
  var vPosition = gl.getAttribLocation(program, "vPosition");

  // specifies the vertex attribute information (in an array), used
  // for rendering 
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);

  // enable this attribute, with the given attribute name
  gl.enableVertexAttribArray(vPosition);


  // ---- now do the color buffer ---- //

  // bind it to make it active
  gl.bindBuffer(gl.ARRAY_BUFFER, cBuffer);

  // send the color data as an array to GL
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertex_colors), gl.STATIC_DRAW);

  // get a location to the color attribute'sp location ('vColor')
  var vColor = gl.getAttribLocation(program, "vColor");

  // specifies the vertex color attribute information (in an array), used
  // for rendering 
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

  // enable this attribute, with the given attribute name
  gl.enableVertexAttribArray(vColor);
};

/* TODO: 
 *   - use vertices.length instead of manually tracking length
 *   - track separate arrays for squares and points
 *   - how does ` gl.drawArrays(gl.TRIANGLES, 0, num_vertices);` know WHICH
 *     array to draw?
 */
function addPrimitive(x, y, type) {
  var size = 0.03;
  var num_vertices_added = 0;

  if (type === "square") {
    vertices.push(x - size, y       );
    vertices.push(x       , y + size);
    vertices.push(x       , y - size);

    vertices.push(x       , y + size);
    vertices.push(x       , y - size);
    vertices.push(x + size, y       );

    num_vertices_added = 6;
  }
  else if (type === "triangle") {
  }
  else {
    console.error("ERROR:", "unknown primitive type:", type)
  }

  color = [Math.random(), Math.random(), Math.random(), 1.0]
  for (var i = 0; i < num_vertices_added; i++) {
    vertex_colors.push(color[0], color[1], color[2], color[3]);
  }
  num_vertices += num_vertices_added;
}

function getWindowCoords(event) {
  window_coords = {};

  // this allows us to account for offset in the document
  const rect = document.getElementById("gl-canvas").getBoundingClientRect();
  window_coords.x = event.clientX - rect.left;
  window_coords.y = event.clientY - rect.top; 

  return window_coords;
}

function paintAtMouse(mouseEvent) {
  // --- get mouse position --- //
  var window_coords = getWindowCoords(mouseEvent);
  var converted_coords = displayToNDC(window_coords.x, window_coords.y, canvas.width, canvas.height);

  // --- draw square --- //
  addPrimitive(converted_coords.x, converted_coords.y, selection);

  // --- add coordinates to textArea --- //
  var output = "Display Coordinates: " + String(window_coords.x) + ", " + String(window_coords.y) + "\n" + 
    "Normalized Device Coordinates: " + String(converted_coords.x) + ", " + String(converted_coords.y) + "\n";
  document.getElementById("myTextArea").value = output;
}

function setEventHandlers() {
  document.getElementById("gl-canvas").addEventListener("click", function() {
  });

  // mouseup listener was intentionally added to document, not canvas. This
  // prevents data from continuing to populate in the text area if the mouse is
  // lifted outside the canvas
  document.addEventListener("mouseup", function() {
    isMouseDown = false;
  });

  document.getElementById("gl-canvas").addEventListener("mousedown", function(event) {
    isMouseDown = true;

    paintAtMouse(event);
  });

  document.getElementById("gl-canvas").addEventListener("mousemove", function(event){
    if(isMouseDown) {
      paintAtMouse(event)
    }
  });

  // triggers when selection changes
  document.getElementById("primitive-types").addEventListener("change", function(){
    selection = document.getElementById("primitive-types").value;

    if(selection === "brush"){
      console.error("Sorry, not implemented yet!");
      selection = "square";
      document.getElementById("primitive-types").value = selection;
    }
  });
}

// this function expects display coordinates as input
function displayToNDC(x, y, width, height) {
  converted_coords = {};
  converted_coords.x = -1.0 + (2.0 * x/width);
  converted_coords.y = 1.0 - (2.0 * y/height);
  return converted_coords;
}

function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  updateVertices(program);

  gl.drawArrays(gl.TRIANGLES, 0, num_vertices);

  setTimeout(
    function () { requestAnimFrame(render); }, delay
    // function () { requestAnimFrame(updateVertices(program)); }, delay
  );
}

function test_performance(){
  var num_primitives = 1e6;

  var before = new Date();
  for(var i = 0; i < num_primitives; i++){
    c = displayToNDC(i, i, num_primitives, num_primitives);
    addPrimitive(c.x, c.y, selection);
  }
  var after = new Date();
  var duration_ms = Math.abs(after - before);

  console.log("INFO: milliseconds to draw", num_primitives, selection + "s:", duration_ms);
}
