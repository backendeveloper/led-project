'use strict';

var five = require("johnny-five");
var Raspi = require("raspi-io");
var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function() {
  var ledGreen = new five.Led("P1-11");
  var ledYellow = new five.Led("P1-13");
  var ledRed = new five.Led("P1-15");

  ledGreen.blink();
  if (ledGreen.on){
    ledYellow.blink();
    if (ledYellow.on) {
      ledRed.blink();
    }
  }

});
