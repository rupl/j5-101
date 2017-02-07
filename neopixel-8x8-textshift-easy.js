var pixel = require("node-pixel");
var five = require("johnny-five");

var board = new five.Board();
var strip = null;
var colorShift = 0;

//
//
// Write whatever you want here in English or Swedish!
// Skriv vad du vill här på engelska eller svenska!
//
//
var MY_MESSAGE = 'Change me...';

board.on("ready", function() {
  console.log("board.ready");

  var led = new five.Led(10);
  led.brightness(48);

  var cshift = 1; // how fast the colors rotate, 0-255
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
    loop();
  });

  // setting this up so the syntax highlighter works to our advantage in the
  // patterns below.
  var X = true;

  // Each character is a property of this object. You can access the data using
  // dot-syntax for regular letters, and array index syntax for punctuation.
  //
  // If you add new characters (which )
  //
  // Valid examples:
  //  - chars.A
  //  - chars.B
  //  - chars.C
  //  - chars['A']
  //  - chars[' ']
  //
  var chars = {
    ' ': [
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
    ],
    'A': [
      [0,0,0,X,X,0,0,0,0],
      [0,0,X,X,X,X,0,0,0],
      [0,0,X,0,0,X,0,0,0],
      [0,X,X,0,0,X,X,0,0],
      [0,X,X,X,X,X,X,0,0],
      [X,X,X,X,X,X,X,X,0],
      [X,X,0,0,0,0,X,X,0],
      [X,0,0,0,0,0,0,X,0],
    ],
    'B': [
      [X,X,X,X,0,0,0],
      [X,X,X,X,X,0,0],
      [X,X,0,0,X,0,0],
      [X,X,X,X,0,0,0],
      [X,X,X,X,0,0,0],
      [X,X,0,0,X,0,0],
      [X,X,X,X,X,0,0],
      [X,X,X,X,0,0,0],
    ],
    'C': [
      [0,0,X,X,X,0,0,0],
      [0,X,X,X,X,X,0,0],
      [X,X,X,0,0,X,0,0],
      [X,X,0,0,0,0,0,0],
      [X,X,0,0,0,0,0,0],
      [X,X,X,0,0,X,0,0],
      [0,X,X,X,X,X,0,0],
      [0,0,X,X,X,0,0,0],
    ],
    'D': [
      [X,X,X,X,0,0,0,0],
      [X,X,X,X,X,0,0,0],
      [X,X,0,0,X,X,0,0],
      [X,X,0,0,0,X,0,0],
      [X,X,0,0,0,X,0,0],
      [X,X,0,0,X,X,0,0],
      [X,X,X,X,X,0,0,0],
      [X,X,X,X,0,0,0,0],
    ],
    'E': [
      [X,X,X,X,X,X,0,0],
      [X,X,X,X,X,X,0,0],
      [X,X,0,0,0,0,0,0],
      [X,X,X,X,0,0,0,0],
      [X,X,X,X,0,0,0,0],
      [X,X,0,0,0,0,0,0],
      [X,X,X,X,X,X,0,0],
      [X,X,X,X,X,X,0,0],
    ],
    'F': [
      [X,X,X,X,X,0,0],
      [X,X,X,X,X,0,0],
      [X,X,0,0,0,0,0],
      [X,X,X,X,0,0,0],
      [X,X,X,X,0,0,0],
      [X,X,0,0,0,0,0],
      [X,X,0,0,0,0,0],
      [X,X,0,0,0,0,0],
    ],
    'G': [
      [0,0,X,X,X,0,0,0],
      [0,X,X,X,X,X,0,0],
      [X,X,X,0,0,X,0,0],
      [X,X,0,0,0,0,0,0],
      [X,X,0,0,X,X,X,0],
      [X,X,X,0,0,X,X,0],
      [0,X,X,X,X,X,X,0],
      [0,0,X,X,X,0,X,0],
    ],
    'H': [
      [X,X,0,0,X,X,0,0],
      [X,X,0,0,X,X,0,0],
      [X,X,0,0,X,X,0,0],
      [X,X,X,X,X,X,0,0],
      [X,X,X,X,X,X,0,0],
      [X,X,0,0,X,X,0,0],
      [X,X,0,0,X,X,0,0],
      [X,X,0,0,X,X,0,0],
    ],
    'I': [
      [X,X,X,X,X,X,0,0],
      [X,X,X,X,X,X,0,0],
      [0,0,X,X,0,0,0,0],
      [0,0,X,X,0,0,0,0],
      [0,0,X,X,0,0,0,0],
      [0,0,X,X,0,0,0,0],
      [X,X,X,X,X,X,0,0],
      [X,X,X,X,X,X,0,0],
    ],
    'J': [
      [0,X,X,X,X,X,X,0,0],
      [0,X,X,X,X,X,X,0,0],
      [0,0,0,X,X,0,0,0,0],
      [0,0,0,X,X,0,0,0,0],
      [0,0,0,X,X,0,0,0,0],
      [X,0,0,X,X,0,0,0,0],
      [X,X,X,X,X,0,0,0,0],
      [0,X,X,X,0,0,0,0,0],
    ],
    'K': [
      [X,X,0,0,0,X,X,0],
      [X,X,0,0,X,X,0,0],
      [X,X,0,X,X,0,0,0],
      [X,X,X,X,0,0,0,0],
      [X,X,X,X,0,0,0,0],
      [X,X,0,X,X,0,0,0],
      [X,X,0,0,X,X,0,0],
      [X,X,0,0,0,X,X,0],
    ],
    'L': [
      [X,X,0,0,0,0,0],
      [X,X,0,0,0,0,0],
      [X,X,0,0,0,0,0],
      [X,X,0,0,0,0,0],
      [X,X,0,0,0,0,0],
      [X,X,0,0,0,0,0],
      [X,X,X,X,X,0,0],
      [X,X,X,X,X,0,0],
    ],
    'M': [
      [X,X,0,0,0,0,X,X,0],
      [X,X,X,0,0,X,X,X,0],
      [X,X,X,X,X,X,X,X,0],
      [X,X,0,X,X,0,X,X,0],
      [X,X,0,X,X,0,X,X,0],
      [X,X,0,0,0,0,X,X,0],
      [X,X,0,0,0,0,X,X,0],
      [X,X,0,0,0,0,X,X,0],
    ],
    'N': [
      [X,X,0,0,0,X,X,0,0],
      [X,X,0,0,0,X,X,0,0],
      [X,X,X,0,0,X,X,0,0],
      [X,X,X,X,0,X,X,0,0],
      [X,X,0,X,X,X,X,0,0],
      [X,X,0,0,X,X,X,0,0],
      [X,X,0,0,0,X,X,0,0],
      [X,X,0,0,0,X,X,0,0],
    ],
    'O': [
      [0,0,X,X,X,X,0,0,0,0],
      [0,X,X,0,0,X,X,0,0,0],
      [X,X,0,0,0,0,X,X,0,0],
      [X,X,0,0,0,0,X,X,0,0],
      [X,X,0,0,0,0,X,X,0,0],
      [X,X,0,0,0,0,X,X,0,0],
      [0,X,X,0,0,X,X,0,0,0],
      [0,0,X,X,X,X,0,0,0,0],
    ],
    'P': [
      [X,X,X,X,0,0,0,0],
      [X,X,X,X,X,0,0,0],
      [X,X,0,0,X,X,0,0],
      [X,X,0,0,X,X,0,0],
      [X,X,X,X,X,0,0,0],
      [X,X,X,X,0,0,0,0],
      [X,X,0,0,0,0,0,0],
      [X,X,0,0,0,0,0,0],
    ],
    'Q': [
      [0,0,X,X,X,X,0,0,0,0],
      [0,X,X,0,0,X,X,0,0,0],
      [X,X,0,0,0,0,X,X,0,0],
      [X,X,0,0,0,0,X,X,0,0],
      [X,X,0,0,X,0,X,X,0,0],
      [X,X,0,0,X,0,X,X,0,0],
      [0,X,X,0,0,X,X,0,0,0],
      [0,0,X,X,X,0,X,X,X,0],
    ],
    'R': [
      [X,X,X,X,0,0,0],
      [X,X,0,0,X,0,0],
      [X,X,0,0,X,0,0],
      [X,X,X,X,0,0,0],
      [X,X,0,X,0,0,0],
      [X,X,0,0,X,0,0],
      [X,X,0,0,X,0,0],
      [X,X,0,0,X,0,0],
    ],
    'S': [
      [0,X,X,X,X,0,0,0],
      [X,X,X,X,X,X,0,0],
      [X,X,0,0,0,X,0,0],
      [X,X,X,X,0,0,0,0],
      [0,X,X,X,X,0,0,0],
      [X,0,0,0,X,X,0,0],
      [X,X,X,X,X,X,0,0],
      [0,X,X,X,X,0,0,0],
    ],
    'T': [
      [X,X,X,X,X,X,X,X,0],
      [X,X,X,X,X,X,X,X,0],
      [0,0,0,X,X,0,0,0,0],
      [0,0,0,X,X,0,0,0,0],
      [0,0,0,X,X,0,0,0,0],
      [0,0,0,X,X,0,0,0,0],
      [0,0,0,X,X,0,0,0,0],
      [0,0,0,X,X,0,0,0,0],
    ],
    'U': [
      [X,X,0,0,0,0,X,X,0,0],
      [X,X,0,0,0,0,X,X,0,0],
      [X,X,0,0,0,0,X,X,0,0],
      [X,X,0,0,0,0,X,X,0,0],
      [X,X,0,0,0,0,X,X,0,0],
      [X,X,0,0,0,0,X,X,0,0],
      [0,X,X,X,X,X,X,0,0,0],
      [0,0,X,X,X,X,0,0,0,0],
    ],
    'V': [
      [X,X,0,0,0,0,0,X,X,0],
      [X,X,0,0,0,0,0,X,X,0],
      [0,X,X,0,0,0,X,X,0,0],
      [0,X,X,0,0,0,X,X,0,0],
      [0,0,X,X,0,X,X,0,0,0],
      [0,0,X,X,0,X,X,0,0,0],
      [0,0,0,X,X,X,0,0,0,0],
      [0,0,0,X,X,X,0,0,0,0],
    ],
    'W': [
      [X,X,0,0,0,0,0,0,X,X,0],
      [X,X,0,0,0,0,0,0,X,X,0],
      [X,X,0,0,0,0,0,0,X,X,0],
      [0,X,X,0,0,0,0,X,X,0,0],
      [0,X,X,0,X,X,0,X,X,0,0],
      [0,X,X,0,X,X,0,X,X,0,0],
      [0,0,X,X,X,X,X,X,0,0,0],
      [0,0,X,X,0,0,X,X,0,0,0],
    ],
    'X': [
      [X,0,0,0,0,0,X,0],
      [X,X,0,0,0,X,X,0],
      [0,X,X,0,X,X,0,0],
      [0,0,X,X,X,0,0,0],
      [0,0,X,X,X,0,0,0],
      [0,X,X,0,X,X,0,0],
      [X,X,0,0,0,X,X,0],
      [X,0,0,0,0,0,X,0],
    ],
    'Y': [
      [X,X,0,0,0,0,X,X,0],
      [X,X,0,0,0,0,X,X,0],
      [X,X,0,0,0,0,X,X,0],
      [0,X,X,0,0,X,X,0,0],
      [0,0,X,X,X,X,0,0,0],
      [0,0,0,X,X,0,0,0,0],
      [0,0,0,X,X,0,0,0,0],
      [0,0,0,X,X,0,0,0,0],
    ],
    'Z': [
      [X,X,X,X,X,X,X,0,0],
      [X,X,X,X,X,X,X,0,0],
      [0,0,0,0,X,X,0,0,0],
      [0,0,0,X,X,0,0,0,0],
      [0,0,X,X,0,0,0,0,0],
      [0,X,X,0,0,0,0,0,0],
      [X,X,X,X,X,X,X,0,0],
      [X,X,X,X,X,X,X,0,0],
    ],
    'Å': [
      [0,0,0,X,X,0,0,0,0]
      [0,0,0,0,0,0,0,0,0],
      [0,0,X,X,X,X,0,0,0],
      [0,0,X,X,X,X,0,0,0],
      [0,X,X,0,0,X,X,0,0],
      [0,X,X,X,X,X,X,0,0],
      [X,X,X,X,X,X,X,X,0],
      [X,X,0,0,0,0,X,X,0],
    ],
    'Ä': [
      [0,X,X,0,0,X,X,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,X,X,X,X,0,0,0],
      [0,0,X,X,X,X,0,0,0],
      [0,X,X,0,0,X,X,0,0],
      [0,X,X,X,X,X,X,0,0],
      [X,X,X,X,X,X,X,X,0],
      [X,X,0,0,0,0,X,X,0],
    ],
    'Ö': [
      [0,X,X,0,0,X,X,0,0],
      [0,0,0,0,0,0,0,0,0],
      [0,0,X,X,X,X,0,0,0],
      [0,X,X,0,0,X,X,0,0],
      [X,X,0,0,0,0,X,X,0],
      [X,X,0,0,0,0,X,X,0],
      [0,X,X,0,0,X,X,0,0],
      [0,0,X,X,X,X,0,0,0],
    ],
    '0': [
      [0,X,X,X,X,0,0,0,0],
      [X,X,0,0,X,X,0,0,0],
      [X,X,0,0,X,X,0,0,0],
      [X,X,0,X,X,X,0,0,0],
      [X,X,X,0,X,X,0,0,0],
      [X,X,0,0,X,X,0,0,0],
      [X,X,0,0,X,X,0,0,0],
      [0,X,X,X,X,0,0,0,0],
    ],
    '1': [
      [0,0,X,X,0,0,0],
      [0,X,X,X,0,0,0],
      [X,X,X,X,0,0,0],
      [X,0,X,X,0,0,0],
      [0,0,X,X,0,0,0],
      [0,0,X,X,0,0,0],
      [X,X,X,X,X,X,0],
      [X,X,X,X,X,X,0],
    ],
    '2': [
      [0,0,X,X,X,0,0,0],
      [0,X,X,X,X,X,0,0],
      [0,X,0,0,X,X,0,0],
      [0,0,0,X,X,0,0,0],
      [0,0,X,X,0,0,0,0],
      [0,X,X,0,0,0,0,0],
      [X,X,X,X,X,X,0,0],
      [X,X,X,X,X,X,0,0],
    ],
    '3': [
      [0,X,X,X,0,0,0],
      [X,X,X,X,X,0,0],
      [X,0,0,0,X,0,0],
      [0,0,0,X,X,0,0],
      [0,0,X,X,X,0,0],
      [X,0,0,0,X,0,0],
      [X,X,X,X,X,0,0],
      [0,X,X,X,0,0,0],
    ],
    '4': [
      [X,X,0,0,X,X,0,0],
      [X,X,0,0,X,X,0,0],
      [X,X,0,0,X,X,0,0],
      [X,X,X,X,X,X,0,0],
      [0,0,X,X,X,X,0,0],
      [0,0,0,0,X,X,0,0],
      [0,0,0,0,X,X,0,0],
      [0,0,0,0,X,X,0,0],
    ],
    '5': [
      [X,X,X,X,X,X,0,0],
      [X,X,X,X,X,X,0,0],
      [X,X,0,0,0,0,0,0],
      [X,X,X,X,0,0,0,0],
      [X,X,X,X,X,0,0,0],
      [0,0,0,0,X,X,0,0],
      [X,X,X,X,X,X,0,0],
      [X,X,X,X,X,0,0,0],
    ],
    '6': [
      [X,X,0,0,0,0,0,0],
      [X,X,0,0,0,0,0,0],
      [X,X,0,0,0,0,0,0],
      [X,X,X,X,X,0,0,0],
      [X,X,X,X,X,X,0,0],
      [X,X,0,0,0,X,0,0],
      [X,X,X,X,X,X,0,0],
      [X,X,X,X,X,0,0,0],
    ],
    '7': [
      [X,X,X,X,X,X,0,0],
      [X,X,X,X,X,X,0,0],
      [0,0,0,0,X,X,0,0],
      [0,0,X,X,X,X,X,0],
      [0,0,0,X,X,0,0,0],
      [0,0,X,X,0,0,0,0],
      [0,X,X,0,0,0,0,0],
      [X,X,0,0,0,0,0,0],
    ],
    '8': [
      [0,X,X,X,0,0,0],
      [X,X,X,X,X,0,0],
      [X,0,0,0,X,0,0],
      [0,X,X,X,0,0,0],
      [X,0,0,0,X,0,0],
      [X,0,0,0,X,0,0],
      [X,X,X,X,X,0,0],
      [0,X,X,X,0,0,0],
    ],
    '9': [
      [0,X,X,X,X,X,0,0],
      [X,X,X,X,X,X,0,0],
      [X,0,0,0,X,X,0,0],
      [X,X,X,X,X,X,0,0],
      [0,X,X,X,X,X,0,0],
      [0,0,0,0,X,X,0,0],
      [0,0,0,0,X,X,0,0],
      [0,0,0,0,X,X,0,0],
    ],
    '.': [
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [X,X,0,0],
      [X,X,0,0],
    ],
    ',': [
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [X,X,0,0],
      [X,X,0,0],
      [0,X,0,0],
    ],
    '!': [
      [X,X,X,0,0],
      [X,X,X,0,0],
      [X,X,X,0,0],
      [X,X,X,0,0],
      [0,X,0,0,0],
      [0,0,0,0,0],
      [0,X,0,0,0],
      [X,X,X,0,0],
    ],
    '-': [
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,X,X,X,0],
      [0,X,X,X,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
      [0,0,0,0,0],
    ],
    '/': [
      [0,0,0,X,0],
      [0,0,0,X,0],
      [0,0,X,0,0],
      [0,0,X,0,0],
      [0,X,0,0,0],
      [0,X,0,0,0],
      [X,0,0,0,0],
      [X,0,0,0,0],
    ],
    '\\': [
      [X,0,0,0,0],
      [X,0,0,0,0],
      [0,X,0,0,0],
      [0,X,0,0,0],
      [0,0,X,0,0],
      [0,0,X,0,0],
      [0,0,0,X,0],
      [0,0,0,X,0],
    ],
    ':': [
      [0,0,0],
      [0,0,0],
      [X,X,0],
      [X,X,0],
      [0,0,0],
      [X,X,0],
      [X,X,0],
      [0,0,0],
    ],
    ';': [
      [0,0,0],
      [0,0,0],
      [X,X,0],
      [X,X,0],
      [0,0,0],
      [X,X,0],
      [X,X,0],
      [0,X,0],
    ],
    ')': [
      [X,X,0,0,0,0],
      [0,0,X,0,0,0],
      [0,0,0,X,0,0],
      [0,0,0,X,0,0],
      [0,0,0,X,0,0],
      [0,0,0,X,0,0],
      [0,0,X,0,0,0],
      [X,X,0,0,0,0],
    ],
    '(': [
      [0,0,X,X,0,0],
      [0,X,0,0,0,0],
      [X,0,0,0,0,0],
      [X,0,0,0,0,0],
      [X,0,0,0,0,0],
      [X,0,0,0,0,0],
      [0,X,0,0,0,0],
      [0,0,X,X,0,0],
    ],
    '😄': [
      [0,X,0,0,0,X,0,0],
      [0,X,0,0,0,X,0,0],
      [0,X,0,0,0,X,0,0],
      [0,0,0,0,0,0,0,0],
      [X,0,0,0,0,0,X,0],
      [X,0,0,0,0,0,X,0],
      [0,X,0,0,0,X,0,0],
      [0,0,X,X,X,0,0,0],
    ],
  };

  // Start with blank pattern. 8 rows for the 8x8 matrix.
  var pattern = [
    [],
    [],
    [],
    [],
    [],
    [],
    [],
    [],
  ];

  // Define our message.
  // Append two spaces on either side because spaces are 4-LEDs wide and we want
  // the message to wipe across the whole screen at the beginning and end.
  var message = '  ' + MY_MESSAGE + '  ';
  message = message.toUpperCase().split('');

  // Build `pattern` by assembling each letter from the message string.
  message.forEach(function (v,i,a) {
    for (var line = 0; line < chars[v].length; line++) {
      for (var char = 0; char < chars[v][0].length; char++) {
        pattern[line].push(chars[v][line][char]);
      }
    }
  });

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
          colorShift += cshift;
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
    r = Math.floor(r/1.5);
    g = Math.floor(g/1.5);
    b = Math.floor(b/1.5);

    // returns a string with the rgb value to be used as the parameter
    return "rgb(" + r +"," + g + "," + b + ")";
  }

  // cleanup when this program is terminated
  this.on("exit", function() {
    led.off();
    strip.off(); // doesn't work, not sure why
  });
});
