pixel = require("node-pixel");
five = require("johnny-five");

var board = new five.Board();
var strip = null;
var fps = 60;

board.on("ready", function() {
  var led = new five.Led(10);
  led.on();

  strip = new pixel.Strip({
    board: this,
    controller: "FIRMATA",
    strips: [ {pin: 6, length: 12}, ],
    gamma: 3.6, // 3.6 = night, 2.6 = bright day
  });

  strip.on("ready", function() {
    console.log("Strip ready, let's go");
    dynamicRainbow(fps);
  });

  function dynamicRainbow( framerate ){
    console.log( 'dynamicRainbow' );

    var showColor;
    var cwi = 0; // colour wheel index (current position on colour wheel)
    var foo = setInterval(function(){
      if (++cwi > 255) {
        cwi = 0;
      }

      for(var i = 0; i < strip.length; i++) {
        showColor = colorWheel( ( cwi+i ) & 255 );
        strip.pixel( i ).color( showColor );
      }
      strip.show();
    }, 1000 / framerate);
  }

  // Input a value 0 to 255 to get a color value.
  // The colors are a transition r - g - b - back to r.
  function colorWheel( WheelPos ){
    var r,g,b;
    WheelPos = 255 - WheelPos;

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
