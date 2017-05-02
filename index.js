'use strict';

var five = require("johnny-five");
var Raspi = require("raspi-io");
var admin = require("firebase-admin");

var serviceAccount = require("./smarthome-d94d7-firebase-adminsdk-bw5qa-995d0a6dd0");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smarthome-d94d7.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("climate");
var ledRef = refLed.chield("humidity");
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
});


// var db = admin.database();
// var ref = db.ref("server/saving-data/fireblog/posts");

// // Attach an asynchronous callback to read the data at our posts reference
// ref.on("value", function(snapshot) {
//   console.log(snapshot.val());
// }, function (errorObject) {
//   console.log("The firebase.db read failed: " + errorObject.code);
// });

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
