var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {
  var led = new five.Led(10);
  led.blink(500);

  // This will grant access to the led instance
  // from within the REPL that's created when
  // running this program.
  this.repl.inject({
    led: led
  });

  // Cleanup when this program is terminated.
  this.on("exit", function() {
    led.off();
  });
});
