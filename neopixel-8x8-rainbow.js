pixel = require("node-pixel");
five = require("johnny-five");

var board = new five.Board();
var strip = null;
var fps = 60;

board.on("ready", function() {
  var led = new five.Led(10);
  led.brightness(32);

  strip = new pixel.Strip({
    board: this,
    controller: "FIRMATA",
    strips: [ {pin: 6, length: 64}, ],
    gamma: 2, // 3.6 = night, 2.6 = bright day
  });

  strip.on("ready", function() {
    console.log("Strip ready, let's go");
    strip.off();
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

      var swing = {
        from: 22,
        to: 32
      }

      // update matrix
      for (var o = swing.from; o < swing.to; o++) {
        for(var i = 0; i < strip.length; i++) {
          showColor = colorWheel( ( cwi+i*o ) & 255 );
          strip.pixel(i).color( showColor );
        }
        strip.show();
      }

      // update in reverse
      for (var o = swing.to; o > swing.from; o--) {
        for(var i = 0; i < strip.length; i++) {
          showColor = colorWheel( ( cwi+i*o ) & 255 );
          strip.pixel(i).color( showColor );
        }
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
    r = Math.round(r/3);
    g = Math.round(g/3);
    b = Math.round(b/3);

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
