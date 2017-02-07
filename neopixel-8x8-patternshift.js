var pixel = require("node-pixel");
var five = require("johnny-five");

var board = new five.Board();
var strip = null;
var colorShift = 0;

board.on("ready", function() {
  var led = new five.Led(10);
  led.brightness(32);

  //
  // LED Dance
  //
  // Color shifting can be distracting in this mode. Using the permanence
  // of color lets the eye focus on movement. Using solid colors is also nice.
  //
  // Set `fps` to theoretical max because we want the cycle to go continuously
  // and the drawing itself produces enough delay for one frame.
  //

  var cshift = 2; // how fast the colors rotate, 0-255
  var fps = 60; // how often to refresh per second, ~60 is max
  const ROW_LENGTH = 8; // based on physical specs of your LED matrix.
  const ROW_LIMIT = 8; // based on physical specs of your LED matrix.

  strip = new pixel.Strip({
    board: this,
    controller: "FIRMATA",
    strips: [ {pin: 6, length: ROW_LIMIT*ROW_LENGTH}, ], // 8x8 matrix = 64 LEDs
    gamma: 3.6, // 3.6 = night, 2.6 = bright day
  });

  strip.on("ready", function() {
    console.log("👍  Matrix is ready — " + strip.length + " LEDs");
    strip.off();
    loop(fps);
  });

  // Patterns are defined in rows of arrays. If the length of any row array is
  // longer than strip.length, the excess is ignored automatically.

  var pattern = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0],
    [0,1,0,0,0,0,0,0],
    [0,0,1,0,0,0,0,0],
    [0,0,0,1,0,0,0,0],
    [1,0,0,0,1,0,0,0],
    [0,1,0,0,0,1,0,0],
    [0,0,1,0,0,0,1,0],
    [0,0,0,1,0,0,0,1],
    [0,0,1,0,0,0,1,0],
    [0,1,0,0,0,1,0,0],
    [1,0,0,0,1,0,0,0],
    [0,0,0,1,0,0,0,0],
    [0,0,1,0,0,0,0,0],
    [0,1,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
  ];

  var pattern = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0],
    [1,1,0,0,0,0,0,0],
    [1,1,1,0,0,0,0,0],
    [1,1,1,1,0,0,0,0],
    [1,1,1,1,1,0,0,0],
    [1,1,1,1,1,1,0,0],
    [1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,0],
    [1,1,1,1,1,1,0,0],
    [1,1,1,1,1,0,0,0],
    [1,1,1,1,0,0,0,0],
    [1,1,1,0,0,0,0,0],
    [1,1,0,0,0,0,0,0],
    [1,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
  ];


  function loop(framerate) {
    var counter = 0;
    var loop = setInterval(function() {
      for (var push = 0; push < pattern.length - ROW_LIMIT; push++) {
        for (var row = push; row < ROW_LIMIT + push; row++) {
          for (var col = 0; col < ROW_LENGTH; col++) {
            // draw new pixel.
            var thisPixel = (ROW_LENGTH*row) + col - (ROW_LIMIT*push);

            if (pattern[row][col]) {
              strip.pixel(thisPixel).color(colorWheel(Math.round(col * (255/strip.length) + colorShift)));
            } else {
              strip.pixel(thisPixel).off();
            }
          }

          // shift colors
          colorShift += cshift;
        }

        // update strip
        strip.show();
      }
    }, 1000 / framerate);
  }

  // Input any number to get a color value.
  //
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
    r = Math.round(r/2);
    g = Math.round(g/2);
    b = Math.round(b/2);

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
