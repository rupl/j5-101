//
// Flickering NeoPixel candle
//
// Inspired by and uses data from:
//  - https://cpldcpu.wordpress.com/2016/01/05/reverse-engineering-a-real-candle/
//  - https://github.com/cpldcpu/RealCandle
//
var pixel = require('node-pixel');
var five = require('johnny-five');
var child_process = require('child_process');

var board = new five.Board();
var strip = null;

board.on('ready', function boardReady() {
  console.log('💥  board.ready');

  var led = new five.Led(10);
  led.brightness(48);

  // How often to refresh per second, ~300 is max.
  // The sample data was collected at 175HZ.
  var fps = 175;

  const NUM_ROWS = 1;
  const NUM_COLS = 7;

  strip = new pixel.Strip({
    board: this,
    controller: 'FIRMATA',
    strips: [ {pin: 6, length: NUM_ROWS*NUM_COLS}, ],
    gamma: 2.2, // 3.6 = night, 2.6 = bright day
  });

  strip.on('ready', function stripReady() {
    strip.off();
    console.log('👍  strip.ready with ' + strip.length + ' LEDs');

    var forever = setInterval(function forever() {
      loop(fps);
    }, 1);
  });

  // Load data from JSON. Original was CSV with timing column but I stripped
  // it out and the JSON is just a n array of points inside `data` prop.
  var pattern = require('./data/candle-1.json').data;
  var patternLength = pattern.length;
  var patternMax = Math.max.apply(Math, pattern);

  // counter
  var counter = 0;

  // 8-bit color: 0-255
  var color = {
    r: 255,
    g: 130,
    b: 0,
  };

  function loop(framerate) {
    var r = Math.floor(color.r * pattern[counter] / patternMax);
    var g = Math.floor(color.g * pattern[counter] / patternMax);
    var b = Math.floor(color.b * pattern[counter] / patternMax);

    // DEBUG
    console.log('🔥', (g>70?'💥':''), r, g, b);

    // draw new pixel
    strip.color(`rgb(${r}, ${g}, ${b})`);

    // increment counter
    if (counter < patternLength - 1) {
      counter++;
    } else {
      counter = 0;
      console.log('🔥  Restarting pattern...');
    }

    // update strip and delay
    strip.show();
    child_process.execSync('sleep ' + 1 / framerate);
  }

  // cleanup when this program is terminated
  this.on('exit', function exit() {
    led.off();
    strip.off(); // doesn't work, not sure why
  });
});
