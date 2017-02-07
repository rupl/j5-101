var pixel = require("node-pixel");
var five = require("johnny-five");

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
  const NUM_COLS = 8;

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
  var pattern = pattern3;

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
            // colorWheel(thisPixel * (255/strip.length) + Math.round(colorShift))

            // draw new pixel.
            if (pattern[row][col]) {
              strip.pixel(thisPixel).color(colorWheel(thisPixel * (255/strip.length) + Math.round(colorShift)));
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

  // Input any value number greater than 0 to get a color value.
  // The number is the absolute value of modulus of 255, and the
  // colors progressively transition in a cycle: r => g => b => r
  function colorWheel( WheelPos ){
    var r,g,b;
    WheelPos = (0 > WheelPos) ? -WheelPos : WheelPos;
    WheelPos = 255 - (WheelPos % 255);

    if ( WheelPos < 85 ) {
      r = 255 - WheelPos * 3;
      g = 0;
      b = WheelPos * 3;
    } else if (WheelPos < 170) {
      WheelPos -= 85;
      r = 0;
      g = WheelPos * 3;
      b = 255 - WheelPos * 3;
    } else {
      WheelPos -= 170;
      r = WheelPos * 3;
      g = 255 - WheelPos * 3;
      b = 0;
    }

    // tone it down
    r = Math.floor(r/2);
    g = Math.floor(g/2);
    b = Math.floor(b/2);

    // returns a string with the rgb value to be used as the parameter
    return "rgb(" + r +"," + g + "," + b + ")";
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
