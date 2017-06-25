var pixel = require("node-pixel");
var five = require("johnny-five");
var colorwheel = require("./_utils.js").colorwheel;

var board = new five.Board();
var strip = null;
var colorShift = 0;

board.on("ready", function() {
  console.log("board.ready");

  var led = new five.Led(10);
  led.brightness(48);

  var shift = 2; // how fast the colors rotate, 0-255
  var fps = 1; // how often to refresh per second, ~300 is max

  const NUM_ROWS = 8;
  const NUM_COLS = 1;

  strip = new pixel.Strip({
    board: this,
    controller: "FIRMATA",
    strips: [ {pin: 6, length: NUM_ROWS*NUM_COLS}, ],
    gamma: 2.2, // 3.6 = night, 2.6 = bright day
  });

  strip.on("ready", function() {
    strip.off();
    console.log("👍  strip.ready with " + strip.length + " LEDs");
    loop(fps);
  });

  // setting this up so the syntax highlighter works to our advantage in the
  // patterns below.
  var X = true;

  // Patterns are defined in rows of arrays. Each row can be as long as you
  // want, but they should all be the same length.
  var pattern1 = [
    // HELLO, WORLD!!!
    [0,0,0,0,0,0,0,X,X,0,0,X,X,0,0,X,X,X,X,X,0,0,X,X,0,0,0,0,0,X,X,0,0,0,0,0,X,X,X,X,X,X,0,0,0,0,0,X,X,0,0,0,0,0,X,X,0,X,X,X,X,X,X,0,0,X,X,X,X,0,0,0,0,X,X,0,0,0,0,X,X,X,0,0,0,0,X,X,X,0,0,X,X,X,0,0,X,X,X,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,X,X,0,0,X,X,0,0,X,X,0,0,0,0,0,X,X,0,0,0,0,0,X,X,0,0,0,0,0,X,X,0,0,X,X,0,0,0,0,0,X,X,0,0,0,0,0,X,X,0,X,X,0,0,X,X,0,0,X,X,0,0,X,0,0,0,X,X,0,0,0,0,X,X,0,X,0,0,0,X,X,X,0,0,X,X,X,0,0,X,X,X,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,X,X,0,0,X,X,0,0,X,X,0,0,0,0,0,X,X,0,0,0,0,0,X,X,0,0,0,0,0,X,X,0,0,X,X,0,0,0,0,0,X,X,0,0,0,0,0,X,X,0,X,X,0,0,X,X,0,0,X,X,0,0,X,0,0,0,X,X,0,0,0,0,X,X,0,0,X,0,0,X,X,X,0,0,X,X,X,0,0,X,X,X,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,X,X,0,0,X,X,0,0,X,X,0,0,0,0,0,X,X,0,0,0,0,0,X,X,0,0,0,0,0,X,X,0,0,X,X,0,0,0,0,0,0,X,X,0,0,0,X,X,0,0,X,X,0,0,X,X,0,0,X,X,X,X,0,0,0,0,X,X,0,0,0,0,X,X,0,0,X,0,0,X,X,X,0,0,X,X,X,0,0,X,X,X,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,X,X,X,X,X,X,0,0,X,X,X,X,X,0,0,X,X,0,0,0,0,0,X,X,0,0,0,0,0,X,X,0,0,X,X,0,0,0,0,0,0,X,X,0,0,0,X,X,0,0,X,X,0,0,X,X,0,0,X,X,0,X,0,0,0,0,X,X,0,0,0,0,X,X,0,0,X,0,0,0,X,0,0,0,0,X,0,0,0,0,X,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,X,X,0,0,X,X,0,0,X,X,0,0,0,0,0,X,X,0,0,0,0,0,X,X,0,0,0,0,0,X,X,0,0,X,X,0,X,X,0,0,0,X,X,0,X,0,X,X,0,0,X,X,0,0,X,X,0,0,X,X,0,0,X,0,0,0,X,X,0,0,0,0,X,X,0,0,X,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,X,X,0,0,X,X,0,0,X,X,0,0,0,0,0,X,X,0,0,0,0,0,X,X,0,0,0,0,0,X,X,0,0,X,X,0,X,X,0,0,0,0,X,X,X,X,X,0,0,0,X,X,0,0,X,X,0,0,X,X,0,0,X,0,0,0,X,X,0,0,0,0,X,X,0,X,0,0,0,0,X,0,0,0,0,X,0,0,0,0,X,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,X,X,0,0,X,X,0,0,X,X,X,X,X,0,0,X,X,X,X,X,0,0,X,X,X,X,X,0,0,X,X,X,X,X,X,0,0,X,0,0,0,0,X,X,0,X,X,0,0,0,X,X,X,X,X,X,0,0,X,X,0,0,X,0,0,0,X,X,X,X,0,0,X,X,X,0,0,0,0,X,X,X,0,0,X,X,X,0,0,X,X,X,0,0,0,0,0,0,0,0],
  ];

  var pattern2 = [
    // HEJ, VETFEST!!!
    [0,0,0,0,0,0,0,X,X,0,0,X,X,0,0,X,X,X,X,X,X,0,0,X,X,X,X,X,X,X,0,0,0,0,X,X,0,0,0,0,0,X,X,0,X,X,X,X,X,X,0,X,X,X,X,X,X,X,X,0,X,X,X,X,X,0,X,X,X,X,X,X,0,0,X,X,X,X,0,0,X,X,X,X,X,X,X,X,0,0,X,X,X,0,0,X,X,X,0,0,X,X,X,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,X,X,0,0,X,X,0,0,X,X,X,X,X,X,0,0,X,X,X,X,X,X,X,0,0,0,0,X,X,0,0,0,0,0,X,X,0,X,X,X,X,X,X,0,X,X,X,X,X,X,X,X,0,X,X,X,X,X,0,X,X,X,X,X,X,0,X,X,X,X,X,X,0,X,X,X,X,X,X,X,X,0,0,X,X,X,0,0,X,X,X,0,0,X,X,X,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,X,X,0,0,X,X,0,0,X,X,0,0,0,0,0,0,0,0,0,X,X,0,0,0,0,0,0,0,X,X,0,0,0,X,X,0,0,X,X,0,0,0,0,0,0,0,0,X,X,0,0,0,0,X,X,0,0,0,0,X,X,0,0,0,0,0,X,X,0,0,0,X,0,0,0,0,X,X,0,0,0,0,0,X,X,X,0,0,X,X,X,0,0,X,X,X,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,X,X,X,X,X,X,0,0,X,X,X,X,0,0,0,0,0,0,0,X,X,0,0,0,0,0,0,0,X,X,0,0,0,X,X,0,0,X,X,X,X,0,0,0,0,0,0,X,X,0,0,0,0,X,X,X,X,0,0,X,X,X,X,0,0,0,X,X,X,X,0,0,0,0,0,0,X,X,0,0,0,0,0,X,X,X,0,0,X,X,X,0,0,X,X,X,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,X,X,X,X,X,X,0,0,X,X,X,X,0,0,0,0,0,0,0,X,X,0,0,0,0,0,0,0,0,X,X,0,X,X,0,0,0,X,X,X,X,0,0,0,0,0,0,X,X,0,0,0,0,X,X,X,X,0,0,X,X,X,X,0,0,0,0,X,X,X,X,0,0,0,0,0,X,X,0,0,0,0,0,0,X,0,0,0,0,X,0,0,0,0,X,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,X,X,0,0,X,X,0,0,X,X,0,0,0,0,0,0,X,0,0,X,X,0,0,X,X,0,0,0,0,X,X,0,X,X,0,0,0,X,X,0,0,0,0,0,0,0,0,X,X,0,0,0,0,X,X,0,0,0,0,X,X,0,0,0,0,0,X,0,0,0,X,X,0,0,0,0,X,X,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,X,X,0,0,X,X,0,0,X,X,X,X,X,X,0,0,X,X,X,X,X,0,0,X,X,0,0,0,0,0,X,X,X,0,0,0,0,X,X,X,X,X,X,0,0,0,0,X,X,0,0,0,0,X,X,0,0,0,0,X,X,X,X,X,X,0,X,X,X,X,X,X,0,0,0,0,X,X,0,0,0,0,0,0,X,0,0,0,0,X,0,0,0,0,X,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,X,X,0,0,X,X,0,0,X,X,X,X,X,X,0,0,0,X,X,X,0,0,0,0,X,0,0,0,0,0,X,X,X,0,0,0,0,X,X,X,X,X,X,0,0,0,0,X,X,0,0,0,0,X,X,0,0,0,0,X,X,X,X,X,X,0,0,X,X,X,X,0,0,0,0,0,X,X,0,0,0,0,0,X,X,X,0,0,X,X,X,0,0,X,X,X,0,0,0,0,0,0,0,0],
  ];

  var pattern3 = [
    // TESTING
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,X,X,X,0,X,X,X,0,0,X,X,0,X,X,X,0,X,0,X,0,0,X,0,X,X,X,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,X,0,0,X,0,0,0,X,0,0,0,0,X,0,0,X,0,X,X,0,X,0,X,0,0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,X,0,0,X,X,0,0,0,0,X,0,0,X,0,0,X,0,X,0,X,X,0,X,0,X,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0,X,0,0,X,X,X,0,X,X,X,0,0,X,0,0,X,0,X,0,0,X,0,X,X,X,0,0,0,0,0,0,0,0],
  ];

  // choose from above
  var pattern = pattern2;

  // Set the display color by adjusting RGB values here. The highest value found
  // in your `pattern` array informs you how high these numbers may be.
  //
  // use 100 as a high value
  var color = {
    red: 150,
    green: 50,
    blue: 25,
  }

  function loop(framerate) {
    var loop = setInterval(function() {
      // determine length of pattern
      var messageLength = pattern[0].length;

      // cycle through all patterns
      for (var currentFrame = 0; currentFrame < messageLength - NUM_COLS; currentFrame++) {
        for (var row = 0; row < pattern.length; row++) {
          for (var col = currentFrame; col < currentFrame + NUM_COLS; col++) {
            var thisPixel = (NUM_COLS*row) + col - currentFrame;
            // COLOR: use "greyscale" values for one hue via `colors` object
            // 'rgb(' + Math.round(pattern[row][col] * color.red) + ',' + Math.round(pattern[row][col] * color.green) + ',' + Math.round(pattern[row][col] * color.blue) + ')'

            // COLOR: use color wheel
            // colorwheel(thisPixel * (255/strip.length) + Math.round(colorShift))

            // draw new pixel.
            if (pattern[row][col]) {
              strip.pixel(thisPixel).color(colorwheel(thisPixel * (255/strip.length) + Math.round(colorShift)));
            } else {
              strip.pixel(thisPixel).off();
            }
          }

          // shift colors
          colorShift += shift;
        }

        // update strip
        strip.show();
      }
    }, 1000 / framerate);
  }

  // go nuts!
  this.repl.inject({
    strip: strip,
    led: led
  });

  // cleanup when this program is terminated
  this.on("exit", function() {
    led.off();
    strip.off(); // doesn't work, not sure why
  });
});
