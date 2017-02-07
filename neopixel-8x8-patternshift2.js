var pixel = require("node-pixel");
var five = require("johnny-five");

var board = new five.Board();
var strip = null;

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

  var pshift = 1; // how many LEDs the pattern shifts each iteration
  var pdir = pixel.FORWARD; // or pixel.BACKWARD
  var pwrap = true; // whether the pattern wraps at the end

  var colorShift = 1; // starting point for color shift
  var cshift = 1; // how fast the colors rotate, 0-255
  var fps = 300; // how often to refresh per second, ~300 is max

  const ROW_LENGTH = 8; // based on physical specs of your LED matrix.
  const ROW_LIMIT = 8; // based on physical specs of your LED matrix.

  strip = new pixel.Strip({
    board: this,
    controller: "FIRMATA",
    strips: [ {pin: 6, length: ROW_LIMIT*ROW_LENGTH}, ], // 8x8 matrix = 64 LEDs
    gamma: 2.2, // 3.6 = night, 2.2 = very bright
  });

  strip.on("ready", function() {
    console.log("👍  Matrix is ready — " + strip.length + " LEDs");
    strip.off();
    loop(fps);
  });

  // Patterns are defined in rows of arrays. If the length of any row array is
  // longer than strip.length, the excess is ignored automatically.

  var pattern = [
    [0,1,0,1,0,0,0,0],
    [1,0,1,0,0,0,0,0],
    [0,1,0,1,0,0,0,0],
    [1,0,1,0,0,0,0,0],
    [0,1,0,1,0,0,0,0],
    [1,0,1,0,0,0,0,0],
    [0,1,0,1,0,0,0,0],
    [1,0,1,0,0,0,0,0],
  ];

  function loop(framerate) {
    strip.pixel(0).color(colorWheel(Math.round(0 * (255/strip.length) + colorShift)));

    // draw initial frame. This happens ONCE.
    for (var row = 0; row < ROW_LIMIT; row++) {
      for (var col = 0; col < ROW_LENGTH; col++) {
        // draw new pixel.
        var thisPixel = (ROW_LENGTH*row) + col;

        if (pattern[row][col]) {
          strip.pixel(thisPixel).color(colorWheel(Math.round(thisPixel * (255/strip.length) + colorShift)));
        } else {
          strip.pixel(thisPixel).off();
        }
      }

      // shift colors
      colorShift += cshift;
    }

    // Display frame.
    strip.show();

    // loop forever shifting pattern.
    var loop = setInterval(function() {
      strip.shift(pshift, pdir, pwrap);
      strip.show();
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
