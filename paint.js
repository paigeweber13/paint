
var gl;

var delay = 10;
var primitive_selection = "square";
var color_selection = [230.0/255.0, 38.0/255.0, 31.0/255.0, 1.0 ];
var canvas;
var vBuffer, cBuffer;
var isMouseDown = false;

var program;
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

  // get a location to the color attribute's location ('vColor')
  var vColor = gl.getAttribLocation(program, "vColor");

  // specifies the vertex color attribute information (in an array), used
  // for rendering 
  gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);

  // enable this attribute, with the given attribute name
  gl.enableVertexAttribArray(vColor);
};

/* TODO: 
 *   - track separate arrays for squares and points
 *   - how does `gl.drawArrays(gl.TRIANGLES, 0, n);` know WHICH
 *     array to draw?
 */
function addPrimitive(x, y, color, type) {
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

  for (var i = 0; i < num_vertices_added; i++) {
    vertex_colors.push(color[0], color[1], color[2], color[3]);
  }
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
  addPrimitive(converted_coords.x, converted_coords.y, color_selection, primitive_selection);
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

  // triggers when primitive-types selection changes
  document.getElementById("primitive-types").addEventListener("change", function(){
    primitive_selection = document.getElementById("primitive-types").value;

    if(primitive_selection === "brush"){
      console.error("Sorry, not implemented yet!");
      primitive_selection = "square";
      document.getElementById("primitive-types").value = primitive_selection;
    }
  });

  // handle color buttons
  document.getElementById("btn-red").addEventListener("click",         
    function(){ color_selection = [230.0/255.0, 38.0/255.0, 31.0/255.0, 1.0 ] });
  document.getElementById("btn-orange").addEventListener("click",      
    function(){ color_selection = [235.0/255.0, 117.0/255.0, 50.0/255.0, 1.0] });
  document.getElementById("btn-yellow").addEventListener("click",      
    function(){ color_selection = [247.0/255.0, 208.0/255.0, 56.0/255.0, 1.0] });
  document.getElementById("btn-light-green").addEventListener("click", 
    function(){ color_selection = [163.0/255.0, 224.0/255.0, 72.0/255.0, 1.0] });
  document.getElementById("btn-sea-green").addEventListener("click",   
    function(){ color_selection = [73.0/255.0, 218.0/255.0, 154.0/255.0, 1.0] });
  document.getElementById("btn-light-blue").addEventListener("click",  
    function(){ color_selection = [52.0/255.0, 187.0/255.0, 230.0/255.0, 1.0] });
  document.getElementById("btn-blue").addEventListener("click",        
    function(){ color_selection = [67.0/255.0, 85.0/255.0, 219.0/255.0, 1.0 ] });
  document.getElementById("btn-magenta").addEventListener("click",     
    function(){ color_selection = [210.0/255.0, 59.0/255.0, 231.0/255.0, 1.0] });
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

  gl.drawArrays(gl.TRIANGLES, 0, vertices.length/2);

  setTimeout(
    function () { requestAnimFrame(render); }, delay
  );
}

function test_performance(){
  var num_primitives = 1e6;

  var before = new Date();
  for(var i = 0; i < num_primitives; i++){
    c = displayToNDC(i, i, num_primitives, num_primitives);
    addPrimitive(c.x, c.y, [0.0, 0.0, 0.0, 1.0], primitive_selection);
  }
  var after = new Date();
  var duration_ms = Math.abs(after - before);

  console.log("INFO: milliseconds to draw", num_primitives, primitive_selection + "s:", duration_ms);
}
