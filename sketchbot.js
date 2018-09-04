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
 * to generate random sketchs from a random latent vector.
 *
 */

var rnn_model;
var rnn_model_data;
var screen_width;
var screen_height;

var class_list = ['bird',
  'ant',
  'ambulance',
  'angel',
  'alarm_clock',
  'antyoga',
  'backpack',
  'barn',
  'basket',
  'bear',
  'bee',
  'beeflower',
  'bicycle',
  'bird',
  'book',
  'brain',
  'bridge',
  'bulldozer',
  'bus',
  'butterfly',
  'cactus',
  'calendar',
  'castle',
  'cat',
  'catbus',
  'catpig',
  'chair',
  'couch',
  'crab',
  'crabchair',
  'crabrabbitfacepig',
  'cruise_ship',
  'diving_board',
  'dog',
  'dogbunny',
  'dolphin',
  'duck',
  'elephant',
  'elephantpig',
  'everything',
  'eye',
  'face',
  'fan',
  'fire_hydrant',
  'firetruck',
  'flamingo',
  'flower',
  'floweryoga',
  'frog',
  'frogsofa',
  'garden',
  'hand',
  'hedgeberry',
  'hedgehog',
  'helicopter',
  'kangaroo',
  'key',
  'lantern',
  'lighthouse',
  'lion',
  'lionsheep',
  'lobster',
  'map',
  'mermaid',
  'monapassport',
  'monkey',
  'mosquito',
  'octopus',
  'owl',
  'paintbrush',
  'palm_tree',
  'parrot',
  'passport',
  'peas',
  'penguin',
  'pig',
  'pigsheep',
  'pineapple',
  'pool',
  'postcard',
  'power_outlet',
  'rabbit',
  'rabbitturtle',
  'radio',
  'radioface',
  'rain',
  'rhinoceros',
  'rifle',
  'roller_coaster',
  'sandwich',
  'scorpion',
  'sea_turtle',
  'sheep',
  'skull',
  'snail',
  'snowflake',
  'speedboat',
  'spider',
  'squirrel',
  'steak',
  'stove',
  'strawberry',
  'swan',
  'swing_set',
  'the_mona_lisa',
  'tiger',
  'toothbrush',
  'toothpaste',
  'tractor',
  'trombone',
  'truck',
  'whale',
  'windmill',
  'yoga',
  'yogabicycle'];

// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var draw_example = function(example, start_x, start_y, line_color) {
  var i, j;
  var x=start_x, y=start_y;
  var dx, dy;
  var pen_down, pen_up, pen_end;
  var prev_pen = [0, 1, 0];

  curveTightness(0.0);

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
    }

    // update the previous pen's state to the current one we just sampled
    prev_pen = [pen_down, pen_up, pen_end];
  }
  if (line.length > 0) {
    lines.push(line);
    line = [];
    line.push([x, y]);
  }

  stroke(line_color);
  strokeWeight(1.0);
  noFill();

  for (i=0;i<lines.length;i++) {
    line = lines[i];
    if (line.length > 1) {
      pt = line[0];
      beginShape();
      curveVertex(pt[0], pt[1]);
      for (j=0;j<line.length;j++) {
        pt = line[j];
        curveVertex(pt[0], pt[1]);
      }
      curveVertex(pt[0], pt[1]);
      endShape();
    }
  }

};

function set_title_text(new_text) {
  var title_text = new_text.split('_').join(' ');
  document.getElementById("mainbutton").innerHTML = '&nbsp;'+title_text;
};

var setup = function() {

  var drawing, i, temperature, x_position;

  var category = "nothing";
  var category_arg = getParameterByName('c');
  if (category_arg && typeof(category_arg) == "string") {
    for (i=0;i<class_list.length;i++) {
      if (category_arg === class_list[i]) {
        category = category_arg;
        break;
      }
    }
  }
  if (category === "nothing") {
    category = class_list[Math.floor(Math.random() * class_list.length)]
  }
  console.log("category = "+category);
  set_title_text(category);

  var temperature = 0.25;
  var temperature_arg = getParameterByName('t');
  if (temperature_arg && typeof(parseFloat(temperature_arg)) == "number") {
    temperature = parseFloat(temperature_arg);
    temperature = Math.max(0.01, temperature);
    temperature = Math.min(1.00, temperature);
  }
  console.log("temperature = "+temperature);

  // make sure we enforce some minimum size of our demo
  var the_size = Math.min(window.innerWidth*0.7, window.innerHeight*0.7);
  screen_width = window.innerWidth;
  screen_height = window.innerHeight;

  createCanvas(screen_width, screen_height, SVG);

  ModelImporter.change_model({}, category, "gen", function(new_model) {
    rnn_model = new_model;
    clear();
    fill(255);
    noStroke();
    rect(0,0,screen_width,screen_height);
    drawing = rnn_model.generate(temperature);
    drawing = rnn_model.scale_drawing(drawing, the_size);
    drawing = rnn_model.center_drawing(drawing);
    draw_example(drawing, screen_width/2, screen_height/2, color(85,85,85, 0.7*255));
  }, true);

  document.getElementById("mainbutton").addEventListener("click", function(e){
    save(category+'.svg');
  })

  document.getElementById("info").addEventListener("click", function(e){
    window.location.assign("https://magenta.tensorflow.org/sketch-rnn-demo");
  })

  document.getElementById("refresh").addEventListener("click", function(e){
    if (rnn_model) {
      clear();
      fill(255);
      noStroke();
      rect(0,0,screen_width,screen_height);
      drawing = rnn_model.generate(temperature);
      drawing = rnn_model.scale_drawing(drawing, the_size);
      drawing = rnn_model.center_drawing(drawing);
      draw_example(drawing, screen_width/2, screen_height/2, color(85,85,85, 0.7*255));
    }
  })

};
