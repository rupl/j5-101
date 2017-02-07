var pixel = require("node-pixel");
var five = require("johnny-five");

var board = new five.Board();
var strip = null;
var colorShift = 0;

var shift = .5; // how fast the colors rotate, 0-255
var subdivide = 1; // every Nth LED will light up
var fps = 60; // how often to refresh per second, ~60 is max

board.on("ready", function() {
  console.log("board.ready");

  var led = new five.Led(10);
  led.brightness(48);

  strip = new pixel.Strip({
    board: this,
    controller: "FIRMATA",
    strips: [ {pin: 6, length: 12}, ],
    gamma: 2.8, // set to a gamma that works nicely for WS2812
  });

  strip.on("ready", function() {
    strip.off();
    console.log("👍  strip.ready with " + strip.length + " LEDs");
    chase(subdivide, fps, shift);
  });


  function chase(step, framerate, shift) {
    var roundTrip = setInterval(function(){
      for(var i = 0; i < strip.length; i += step) {
        // new pixel
        strip.pixel( i ).color( colorWheel(i*(255/strip.length) + Math.round(colorShift)));

        // shift colors
        colorShift += shift;
      }

      // update strip
      strip.show();
    }, 1000 / framerate);
  }

  // Input any value number greater than 0 to get a color value.
  // The number is the modulus of 255, and the colors progressively
  // transition in a cycle: r => g => b => r.
  function colorWheel( WheelPos ){
    var r,g,b;
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
