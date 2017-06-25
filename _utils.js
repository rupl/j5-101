//
// Color wheel
//
// Input any number to get a color value. The number is the absolute value of
// modulus of 255, and the colors continuously transition in a seamless cycle:
//
// r ⇢ g ⇢ b ⇢ r
//
exports.colorwheel = function(WheelPos) {
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
};
