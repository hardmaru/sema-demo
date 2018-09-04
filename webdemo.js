// Copyright 2017 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
// implied. See the License for the specific language governing
// permissions and limitations under the License.
/**
 * Author: David Ha <hadavid@google.com>
 *
 * @fileoverview Basic p5.js sketch to show how to use sketch-rnn
 * to finish the user's incomplete drawing, and loop through different
 * endings automatically.
 */
var sketch = function( p ) {
  "use strict";

  var startingStrokesData = [
[[1,2,1,0,0],[4,19,1,0,0],[19,27,1,0,0],[17,8,1,0,0],[28,0,1,0,0],[12,-7,1,0,0],[14,-15,1,0,0],[10,-26,1,0,0],[0,-18,1,0,0],[-5,-13,1,0,0],[-11,-13,1,0,0],[-20,-9,1,0,0],[-14,0,1,0,0],[-42,18,1,0,0],[-11,15,1,0,0],[-2,15,0,1,0]],
[[0,3,1,0,0],[0,17,1,0,0],[11,17,1,0,0],[18,5,1,0,0],[16,0,1,0,0],[15,-6,1,0,0],[5,-6,1,0,0],[11,-25,1,0,0],[0,-17,1,0,0],[-12,-12,1,0,0],[-16,-6,1,0,0],[-18,0,1,0,0],[-23,12,1,0,0],[-10,9,1,0,0],[-3,15,1,0,0],[8,8,0,1,0]],
[[2,-2,1,0,0],[7,-15,1,0,0],[8,-8,1,0,0],[21,-3,1,0,0],[14,12,1,0,0],[5,13,1,0,0],[0,12,1,0,0],[-9,11,1,0,0],[-27,4,1,0,0],[-17,-11,1,0,0],[-2,-13,0,1,0]],
[[-1,3,1,0,0],[-1,21,1,0,0],[8,9,1,0,0],[25,7,1,0,0],[22,0,1,0,0],[9,-7,1,0,0],[3,-23,1,0,0],[-7,-12,1,0,0],[-33,-2,1,0,0],[-24,4,0,1,0]],
[[1,-2,1,0,0],[18,-23,1,0,0],[20,-4,1,0,0],[13,6,1,0,0],[9,9,1,0,0],[6,12,1,0,0],[1,13,1,0,0],[-15,12,1,0,0],[-29,6,1,0,0],[-20,-13,1,0,0],[-3,-6,1,0,0],[2,-10,0,1,0]],
[[-2,2,1,0,0],[-2,18,1,0,0],[3,6,1,0,0],[6,7,1,0,0],[19,6,1,0,0],[12,-1,1,0,0],[20,-9,1,0,0],[5,-7,1,0,0],[3,-13,1,0,0],[0,-14,1,0,0],[-4,-6,1,0,0],[-21,-10,1,0,0],[-16,1,1,0,0],[-29,21,0,1,0]],
[[-1,8,1,0,0],[0,43,1,0,0],[3,2,1,0,0],[52,4,1,0,0],[27,-5,1,0,0],[3,-13,1,0,0],[-2,-53,1,0,0],[-3,-2,1,0,0],[-33,5,1,0,0],[-26,7,1,0,0],[-23,0,0,1,0]],
[[3,0,1,0,0],[61,0,1,0,0],[24,-6,1,0,0],[-14,-60,1,0,0],[-23,-2,1,0,0],[-67,9,1,0,0],[-1,56,0,1,0]],
[[-1,-3,1,0,0],[0,-45,1,0,0],[83,0,1,0,0],[6,39,1,0,0],[-2,60,1,0,0],[-83,2,1,0,0],[-3,-51,0,1,0]],
[[0,4,1,0,0],[0,37,1,0,0],[86,2,1,0,0],[4,-2,1,0,0],[2,-9,1,0,0],[2,-62,1,0,0],[-10,-2,1,0,0],[-29,4,1,0,0],[-57,-3,1,0,0],[-5,5,1,0,0],[-1,9,1,0,0],[8,18,0,1,0]],
[[0,7,1,0,0],[0,17,1,0,0],[5,21,1,0,0],[14,15,1,0,0],[13,4,1,0,0],[73,0,1,0,0],[9,-16,1,0,0],[0,-21,1,0,0],[7,-27,1,0,0],[0,-19,1,0,0],[-1,-4,1,0,0],[-11,-4,1,0,0],[-31,10,1,0,0],[-48,0,1,0,0],[-9,2,1,0,0],[-21,14,0,1,0]],
[[0,-3,1,0,0],[-4,-28,1,0,0],[2,-6,1,0,0],[7,-3,1,0,0],[66,-1,1,0,0],[18,9,1,0,0],[5,7,1,0,0],[-3,16,1,0,0],[-18,14,1,0,0],[-11,2,1,0,0],[-29,-4,1,0,0],[-19,3,1,0,0],[-14,-2,0,1,0]],
[[1,-4,1,0,0],[26,-62,1,0,0],[5,1,1,0,0],[10,9,1,0,0],[19,54,1,0,0],[-61,6,0,1,0]],
[[6,0,1,0,0],[56,-43,1,0,0],[24,-24,1,0,0],[13,-3,1,0,0],[32,9,1,0,0],[22,11,1,0,0],[28,18,1,0,0],[48,39,1,0,0],[-1,3,1,0,0],[-29,9,1,0,0],[-64,0,1,0,0],[-134,-17,0,1,0]],
[[1,-7,1,0,0],[1,-62,1,0,0],[9,-5,1,0,0],[49,0,1,0,0],[63,9,1,0,0],[35,0,1,0,0],[24,4,1,0,0],[21,5,1,0,0],[13,9,1,0,0],[14,16,1,0,0],[0,9,1,0,0],[-8,10,1,0,0],[-17,11,1,0,0],[-16,5,1,0,0],[-68,-1,1,0,0],[-68,-10,1,0,0],[-53,2,0,1,0]],
[[6,-1,1,0,0],[251,-2,1,0,0],[3,1,1,0,0],[3,10,1,0,0],[3,47,1,0,0],[-7,19,1,0,0],[-19,26,1,0,0],[-44,33,1,0,0],[-57,17,1,0,0],[-56,8,1,0,0],[-37,0,1,0,0],[-18,-8,1,0,0],[-16,-15,1,0,0],[-15,-28,1,0,0],[-6,-43,1,0,0],[2,-60,0,1,0]],
[[4,1,1,0,0],[146,0,1,0,0],[19,4,1,0,0],[5,34,1,0,0],[-2,23,1,0,0],[-18,29,1,0,0],[-14,9,1,0,0],[-24,4,1,0,0],[-39,0,1,0,0],[-26,-6,1,0,0],[-21,-9,1,0,0],[-11,-9,1,0,0],[-9,-18,1,0,0],[-17,-56,0,1,0]],
[[1,3,1,0,0],[142,-2,1,0,0],[3,1,1,0,0],[0,6,1,0,0],[-21,24,1,0,0],[-29,42,1,0,0],[-16,10,1,0,0],[-8,0,1,0,0],[-19,-11,1,0,0],[-31,-29,1,0,0],[-28,-41,0,1,0]],
  ];

  var startingStrokes;
  var class_list = organize_class_list();

  var use_large_models = true;

  // sketch_rnn model
  var model_loaded = false;
  var model;
  var model_data;
  var temperature = 0.25;
  var min_sequence_length = 1;
  var refresh_count = 1;

  var modelPdf; // store all the parameters of a mixture-density distribution
  var model_state, model_state_orig;
  var modelStrokes = []; // keep track of the strokes the model drew

  var modelPen = Pen();

  function Pen() {
    var state = {
      active: false,
      x: 0, y: 0,
      dx: 0, dy: 0,
      down: 0, up: 0, end: 0,
      prevDown: 0, prevUp: 0, prevEnd: 0
    }
    state.updateCurrent = function(stroke) {
      state.dx = stroke[0]
      state.dy = stroke[1]
      // we update the previous by default
      state.updateCurrentPen(stroke.slice(2, 5))
    }
    state.updatePrev = function(stroke) {
      state.dx = stroke[0]
      state.dy = stroke[1]
      // we update the previous by default
      state.updatePrevPen(stroke.slice(2, 5))
    }
    state.updateCurrentPen = function(array) {
      state.down = array[0]
      state.up = array[1]
      state.end = array[2]
    }
    state.updatePrevPen = function(array) {
      state.prevDown = array[0]
      state.prevUp = array[1]
      state.prevEnd = array[2]
    }
    state.getStroke = function() {
      return [state.dx, state.dy, state.down, state.up, state.end]
    }
    state.getCurrentPen = function() {
      return [ state.down, state.up, state.end]
    }
    state.getPrevPen = function() {
      return [ state.prevDown, state.prevUp, state.prevEnd]
    }
    return state;
  }


  // variables for the sketch input interface.
  var userPen = {
    currentState: 0,
    prevState: 0,
  }
  var x, y; // absolute coordinates on the screen of where the pen is
  var start_x, start_y;
  var has_started; // set to true after user starts writing.
  var just_finished_line;
  var epsilon = 1.0; // to ignore data from user's pen staying in one spot.
  var raw_lines;
  var current_raw_line;
  var strokes;
  var line_color, predict_line_color;
  var line_color_alpha = 64;
  var final_color_alpha = 255;
  // demo strokes
  var startingStrokeIndex;
  var demo_finished = false;
  var last_time; // for keeping track of drawing speed
  var smallPause = false;

  // UI
  var screen_width, screen_height, temperature_slider;
  var line_width = 5;
  var screen_scale_factor = 3.0;

  // dom
  var reset_button, model_sel, random_model_button;
  var text_title, text_temperature;
  var changing_model_lock = true;
  var restarting_model_lock = false;
  var clear_text_color, random_text_color;
  var clear_text_background, random_text_background;
  var canvas;
  var title_text = "sketch-rnn predictor.";
  var old_title_text = "sketch-rnn";
  var run_encode_strokes;

  var select_dom;

  // tracking mouse  touchpad
  var tracking = {
    down: false,
    x: 0,
    y: 0
  };

  // mobile
  var md, mobile_mode = false;

  function format_title_text(name) {
    name = name.split('_').join(' ');
    var c = name[0];

    /*
    var a = ' a ';
    var c = name[0];
    if (c === 'a' || c === 'e' || c === 'i' || c === 'o' || c === 'u') {
      a = ' an ';
    }
    */

    return 'start drawing '+name+'.';
  };

  function set_title_text(new_text) {
    title_text = new_text.split('_').join(' ');
    document.getElementById("loading_text").innerText = title_text;
  };

  /*
  function draw_example(example, start_x, start_y, line_color, prev_pen_override) {
    var i;
    var ePen = Pen();
    ePen.x = start_x
    ePen.y = start_y
    ePen.updateCurrentPen([1, 0, 0])
    // var x=start_x, y=start_y;
    // var dx, dy;
    // var pen_down, pen_up, pen_end;
    // var penState = [1, 0, 0];

    if (Array.isArray(prev_pen_override)) {
      // penState = prev_pen_override;
      ePen.updatePrevPen(prev_pen_override)
    }

    for(i=0;i<example.length;i++) {
      // sample the next pen's states from our probability distribution
      // [dx, dy, pen_down, pen_up, pen_end] = example[i];
      ePen.updateCurrent(example[i])

      if (ePen.end == 1) { // end of drawing.
        break;
      }

      // only draw on the paper if the pen is touching the paper
      if (ePen.prevDown == 1) {
        p.stroke(line_color);
        p.strokeWeight(line_width);
        p.line(ePen.x, ePen.y, ePen.x+ePen.dx, ePen.y+ePen.dy); // draw line connecting prev point to current point.
      }

      // update the absolute coordinates from the offsets
      ePen.x += ePen.dx;
      ePen.y += ePen.dy;
      ePen.updatePrevPen(ePen.getCurrentPen())

      // update the previous pen's state to the current one we just sampled
      // penState = [pen_down, pen_up, pen_end];
    }

  };
  */

  var draw_example = function(example, start_x, start_y, line_color, prev_pen_override) {
    var i, j;
    var x=start_x, y=start_y;
    var dx, dy;
    var pen_down, pen_up, pen_end;
    var prev_pen = [1, 0, 0];

    if (Array.isArray(prev_pen_override)) {
      penState = prev_pen_override;
    }

    p.curveTightness(0.0);

    var lines = [];
    var line = [];
    var pt;

    line.push([x, y]);

    for(i=0;i<example.length;i++) {
      // sample the next pen's states from our probability distribution
      [dx, dy, pen_down, pen_up, pen_end] = example[i];

      if (prev_pen[2] == 1) { // end of drawing.
        break;
      }

      x += dx;
      y += dy;

      // only draw on the paper if the pen is touching the paper
      if (prev_pen[0] == 1) {
        line.push([x, y]);
      } else {
        lines.push(line);
        line = [];
        line.push([x, y]);
      }

      // update the previous pen's state to the current one we just sampled
      prev_pen = [pen_down, pen_up, pen_end];
    }
    if (line.length > 0) {
      lines.push(line);
      line = [];
    }

    p.stroke(line_color);
    p.strokeWeight(line_width);
    p.noFill();

    for (i=0;i<lines.length;i++) {
      line = lines[i];
      if (line.length > 1) {
        pt = line[0];
        p.beginShape();
        p.curveVertex(pt[0], pt[1]);
        for (j=0;j<line.length;j++) {
          pt = line[j];
          p.curveVertex(pt[0], pt[1]);
        }
        p.curveVertex(pt[0], pt[1]);
        p.endShape();
      }
    }

  };

  var init = function(cb) {

    // mobile
    // deal with mobile device nuances
    md = new MobileDetect(window.navigator.userAgent);

    ModelImporter.set_init_model(model_raw_data);
    if (use_large_models) {
      //ModelImporter.set_model_url("https://storage.googleapis.com/quickdraw-models/sketchRNN/large_models/");
      ModelImporter.set_model_url("models/");
    }

    var initial_model = 'bird';

    if (md.mobile()) {
      mobile_mode = true;
      console.log('mobile or ios: '+md.mobile());
      screen_scale_factor = 4.0;
      // Don't load large models on mobile,
      // chances are someone is using cellular data and 20mb is expensive!
      // use_large_models = false;
    } else {
        console.log('not mobile');
        initial_model = class_list[0];
    }

    // model
    set_title_text('loading model. please wait.');

    // console.log("sup?")
    ModelImporter.change_model({}, initial_model, "gen", function(new_model) {
      console.log("changing")
      model = new_model
      model.set_pixel_factor(screen_scale_factor);
      //set_title_text(format_title_text(model.info.name));
      cb();
      changing_model_lock = false;
      set_title_text('draw a shape, any shape.');
    }, true);

    screen_width = get_window_width(); //window.innerWidth
    screen_height = get_window_height(); //window.innerHeight

    document.documentElement.addEventListener('gesturestart', function (event) {
        event.preventDefault();
    }, false);

    select_dom = document.getElementById('model_selector')
    for(var i=0;i<class_list.length; i++){
      var item = document.createElement("option");
      item.text = class_list[i].replace(/_/g, ' ');
      item.value = class_list[i];
      select_dom.add(item);

      // if(item.value == word){
      //   item.selected = 'selected'
      // }
    }

    select_dom.value = initial_model;

    select_dom.addEventListener("change", function(){
      model_sel_event(select_dom.value);
    })

    document.getElementById("clear").addEventListener("click", function(e){
      reset_button_event();
    })

    document.getElementById("shuffle").addEventListener("click", function(e){
      shuffle_button_event();
    })

    /*
    document.getElementById("info").addEventListener("click", function(e){
      window.location.assign("https://magenta.tensorflow.org/sketch-rnn-demo");
    })
    */

    var canvas = document.getElementsByTagName("canvas")[0];
    canvas.addEventListener("mousedown", function(e){
      devicePressed(e.clientX, e.clientY);
    })
    canvas.addEventListener("mousemove", function(e){
      if(tracking.down){
        devicePressed(e.clientX, e.clientY);
      }
    })
    canvas.addEventListener("mouseup", function(e){
      deviceReleased();
    })

    document.addEventListener("touchstart",function(e){
      if(e.target.nodeName == 'SELECT'){

      } else if(e.target.nodeName == 'BUTTON'){
        e.preventDefault()
        e.target.click()
      } else {
        e.preventDefault()
      }

    })
    canvas.addEventListener("touchstart",function(e){
      e.preventDefault();
      devicePressed(e.touches[0].clientX, e.touches[0].clientY);
    })
    canvas.addEventListener("touchmove", function(e){
      e.preventDefault();
      if(tracking.down){
        devicePressed(e.touches[0].clientX, e.touches[0].clientY);
      }
    })
    canvas.addEventListener("touchend", function(e){
      e.preventDefault();
      deviceReleased();
    })

  };

  var encode_strokes = function(sequence) {

    // draw line connecting prev point to current point.
    console.log("encoding");

    model_state_orig = model.zero_state();

    if (sequence.length <= min_sequence_length) {
      return;
    }

    // encode sequence
    model_state_orig = model.update(model.zero_input(), model_state_orig);
    for (var i=0;i<sequence.length-1;i++) {
      model_state_orig = model.update(sequence[i], model_state_orig);
    }

    restart_model(sequence);

    modelPen.active = true;

    set_title_text('')
    console.log("finished encoding");

  }

  function restart_model(sequence) {
    model_state = model.copy_state(model_state_orig); // bounded
    modelStrokes = []

    var idx = raw_lines.length-1;
    var last_point = raw_lines[idx][raw_lines[idx].length-1];
    var last_x = last_point[0];
    var last_y = last_point[1];
    var s = sequence[sequence.length-1];

    modelPen.x = last_x;
    modelPen.y = last_y;
    modelPen.updatePrev(s)
  }

  function init_model_coordinates() {
    x = screen_width/2.75;
    y = screen_height/2.0;
    start_x = x;
    start_y = y;

    modelPen.x = x;
    modelPen.y = y;
    modelPen.updatePrevPen([0, 0, 0])
    modelPen.active = false;

    // demo_finished = false;
    startingStrokeIndex = 0;
  }

  function restart() {
    // reinitialize variables before calling p5.js setup.
    line_color = p.color(0,0,0,line_color_alpha);
    predict_line_color = p.color(p.random(64, 224), p.random(64, 224), p.random(64, 224),line_color_alpha);

    // make sure we enforce some minimum size of our demo
    screen_width = Math.max(window.innerWidth, 400);
    screen_height = Math.max(window.innerHeight, 320);

    // variables for the sketch input interface.
    userPen.currentState = 0
    userPen.prevState = 1
    // pen = 0;
    // prev_pen = 1;
    has_started = false; // set to true after user starts writing.
    just_finished_line = false;
    raw_lines = [];
    current_raw_line = [];
    strokes = [];
    modelStrokes = [];
    startingStrokes = startingStrokesData[Math.floor(Math.random() * startingStrokesData.length)];
    // start drawing from somewhere in middle of the canvas
    init_model_coordinates();

  };

  function clear_screen() {
    // console.log("CLEAR")
    p.fill(255);
    p.noStroke();
    // p.rect(0, 0, screen_width, screen_height-41);
    p.rect(0, 0, screen_width, screen_height);
    p.stroke(0);
  };

  p.windowResized = function() {
    "use strict";
    screen_width = get_window_width(); //window.innerWidth
    screen_height = get_window_height(); //window.innerHeight

    p.resizeCanvas(screen_width, screen_height);

    canvas.size(screen_width, screen_height);
    clear_screen();
    draw_example(strokes, start_x, start_y, line_color);
    if (strokes.length > min_sequence_length) {
      restart_model(strokes);
    }
  };

  function draw_random_example() {
    var drawing = model.generate(temperature);
    var image_size = Math.min(screen_width, screen_height)*0.6;
    drawing = model.scale_drawing(drawing, image_size);
    drawing = model.center_drawing(drawing);
    draw_example(drawing, screen_width/2, screen_height/2, p.color(0, 0, 0, 32), [0, 1, 0]);
  }

  p.setup = function() {
    init(function(){
      console.log('ready.');
      // draw_random_example();
      model_loaded = true;
    });
    restart();
    canvas = p.createCanvas(screen_width, screen_height);
    p.frameRate(30);
    clear_screen();

    last_time = +new Date()

  };

  function inside_box(x, y, w, h) {
    var result = false;
    if ((tracking.x > x) && (tracking.x < (x+w)) && (tracking.y > y) && tracking.y < (y+h)) {
      result = true;
    }
    return result;
  }

  function get_window_width() {
    // return p.windowWidth;
    return window.innerWidth;
  }

  function get_window_height() {
    // return p.windowHeight;
    return window.innerHeight;
  }

  p.draw = function() {
    screen_width = get_window_width(); //
    screen_height = get_window_height(); //

    if (run_encode_strokes) {
      run_encode_strokes = false;
      encode_strokes(strokes);
      set_title_text(format_title_text(model.name));
    }

    // record pen drawing from user:
    clear_text_color = "rgba(0,0,0,0.5)"; // #3393d1
    random_text_color = "rgba(0,0,0,0.5)"; // #3393d1
    clear_text_background = false;
    random_text_background = false;

    // console.log(model, has_started, demo_finished)
    if(restarting_model_lock) return;

    if (tracking.down && (tracking.x > 0) && (tracking.x < screen_width) && (tracking.y > 0) && tracking.y < screen_height) { // pen is touching the paper
      if (has_started == false) { // first time anything is written
        restart();
        strokes = [];
        clear_screen();
        has_started = true;
        demo_finished = true;

        line_color_alpha = final_color_alpha;
        line_color = p.color(0,0,0,line_color_alpha);
        predict_line_color = p.color(p.random(64, 224), p.random(64, 224), p.random(64, 224),line_color_alpha);

        x = tracking.x;
        y = tracking.y;
        start_x = x;
        start_y = y;
        userPen.currentState = 0;
        current_raw_line.push([x, y]);
      } else {
        var dx0 = tracking.x-x; // candidate for dx
        var dy0 = tracking.y-y; // candidate for dy
        if (dx0*dx0+dy0*dy0 > epsilon*epsilon) { // only if pen is not in same area
          var dx = dx0;
          var dy = dy0;
          userPen.currentState = 0

          if (userPen.prevState == 0) {
            p.stroke(line_color);
            p.strokeWeight(line_width); // nice thick line
            p.line(x, y, x+dx, y+dy); // draw line connecting prev point to current point.
          }

          // update the absolute coordinates from the offsets
          x += dx;
          y += dy;

          // update raw_lines
          current_raw_line.push([x, y]);
          just_finished_line = true;

          // using the previous pen states, and hidden state, get next hidden state
          // update_rnn_state();
        }
      }
    } else if(model_loaded && !has_started && !demo_finished) {
      // console.log("drawin!")
      // we draw the existing strokes
      if(smallPause) return;
      var ms = +new Date()
      if(ms - last_time < 100) {
        return;
      }
      last_time = ms;

      if(startingStrokeIndex < startingStrokes.length) {
        stroke = startingStrokes[startingStrokeIndex];
        dx = stroke[0];
        dy = stroke[1];

        p.stroke(line_color);
        p.strokeWeight(line_width); // nice thick line
        p.line(x, y, x+dx, y+dy); // draw line connecting prev point to current point.

        x += dx;
        y += dy;
        current_raw_line.push([x, y]);
        just_finished_line = true;

        startingStrokeIndex++;

      // if(startingStrokeIndex >= startingStrokes.length) {
      } else {
        smallPause = true
        setTimeout(function() {
          smallPause = false
          startingStrokes = startingStrokesData[Math.floor(Math.random() * startingStrokesData.length)];
          init_model_coordinates();
          clear_screen();
        }, 500)
      }

    } else { // pen is above the paper
      userPen.currentState = 1;
      if (just_finished_line) {
        var current_raw_line_simple = DataTool.simplify_line(current_raw_line);
        var idx, last_point, last_x, last_y;

        if (current_raw_line_simple.length > 1) {
          if (raw_lines.length === 0) {
            last_x = start_x;
            last_y = start_y;
          } else {
            idx = raw_lines.length-1;
            last_point = raw_lines[idx][raw_lines[idx].length-1];
            last_x = last_point[0];
            last_y = last_point[1];
          }
          var stroke = DataTool.line_to_stroke(current_raw_line_simple, [last_x, last_y]);
          raw_lines.push(current_raw_line_simple);
          strokes = strokes.concat(stroke);

          // redraw simplified strokes
          clear_screen();
          draw_example(strokes, start_x, start_y, line_color);

          old_title_text = title_text;
          set_title_text("sketch-rnn is working ...");

          // initialize rnn:
          run_encode_strokes = true;

          /*
          p.stroke(line_color);
          p.strokeWeight(2.0);
          p.ellipse(x, y, 5, 5); // draw line connecting prev point to current point.
          */

        } else {
          if (raw_lines.length === 0) {
            has_started = false;
          }
        }

        current_raw_line = [];
        just_finished_line = false;
      }

      // have machine take over the drawing here:
      if (modelPen.active) {

        modelPen.updateCurrentPen(modelPen.getPrevPen())

        model_state = model.update(modelPen.getStroke(), model_state);
        modelPdf = model.get_pdf(model_state);
        var s =  model.sample(modelPdf, temperature);
        modelPen.updateCurrent(s)
        modelStrokes.push(s)

        if (modelPen.end === 1) {
          // predict_line_color = p.color(p.random(64, 224), p.random(64, 224), p.random(64, 224), line_color_alpha);
          clear_screen();
          draw_example(strokes.concat(modelStrokes), start_x, start_y, p.color(0,0,0,line_color_alpha));
          restart_model(strokes);
          restarting_model_lock = true;
          setTimeout(function() {
            predict_line_color = p.color(p.random(64, 224), p.random(64, 224), p.random(64, 224), line_color_alpha);
            clear_screen();
            draw_example(strokes, start_x, start_y, line_color);
            restarting_model_lock = false;
          }, 1500)
        } else {

          if (modelPen.prevDown === 1) {
            // draw line connecting prev point to current point.
            p.stroke(predict_line_color);
            p.strokeWeight(line_width);
            p.line(modelPen.x, modelPen.y, modelPen.x + modelPen.dx, modelPen.y + modelPen.dy);
          }

          modelPen.updatePrevPen(modelPen.getCurrentPen())

          modelPen.x += modelPen.dx;
          modelPen.y += modelPen.dy;
        }
      }

    }

    userPen.prevState = userPen.currentState;
  };

  var model_sel_event = function(item) {
    var model_mode = "gen";
    console.log("user wants to change to model " + item);
    changing_model_lock = true;
    var call_back = function(new_model) {
      demo_finished = true;
      model = new_model;
      model.set_pixel_factor(screen_scale_factor);
      // encode_strokes(strokes);
      restart();
      clear_screen();
      // draw_example(strokes, start_x, start_y, line_color);
      set_title_text(format_title_text(model.info.name));
      changing_model_lock = false;
    }
    set_title_text('Sketch-RNN is loading '+item+' model ...');
    console.log("MODEL", model)
    ModelImporter.change_model(model, item, model_mode, call_back, true);
  };


  var reset_button_event = function() {
    restart();
    clear_screen();
  };

  var shuffle_button_event = function() {
    var the_class_list = organize_class_list(refresh_count);
    refresh_count += 1;
    var item = the_class_list[Math.floor(Math.random() * the_class_list.length)];
    if (!changing_model_lock) {
      select_dom.value = item;
      // model_sel_event(select_dom.value);
      model_sel_event(item);
    }
  };

  var temperature_slider_event = function() {
    temperature = temperature_slider.value()/100;
    clear_screen();
    draw_example(strokes, start_x, start_y, line_color);
  };

  var deviceReleased = function() {
    tracking.down = false;
  }

  var devicePressed = function(x, y) {
    tracking.x = x;
    tracking.y = y;
    if (!tracking.down) {
      tracking.down = true;
    }
  };
};
var custom_p5 = new p5(sketch, 'sketch');
