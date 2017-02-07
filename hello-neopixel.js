pixel = require("node-pixel");
five = require("johnny-five");

var board = new five.Board();
var strip = null;

board.on("ready", function() {
  var led = new five.Led(10);
  led.on();

  strip = new pixel.Strip({
    board: this,
    controller: "FIRMATA",
    strips: [ {pin: 6, length: 12}, ],
    gamma: 2.8, // set to a gamma that works nicely for WS2812
  });

  strip.on("ready", function() {
    strip.color('#903');
    strip.show();
  });

  // go nuts!
  this.repl.inject({
    strip: strip,
    led: led
  });

  // cleanup when this program is terminated
  this.on("exit", function() {
    led.off();
    // strip.off(); // doesn't work, not sure why
  });
});
