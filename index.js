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
var refBathroom = db.ref("lamp/bathroom");
var refKitchen = db.ref("lamp/kitchen");
var refSaloon = db.ref("lamp/saloon");
//  var ledBathroomRef = refLed.chield("bathroom");
// var ledKitchenRef = refLed.chield("kitchen");
// var ledSaloonRef = refLed.chield("saloon");
// ref.once("value", function(snapshot) {
//   console.log(snapshot.val());
// });

// ref.once("value", function(snapshot) {
//   console.log(snapshot.val());
// }, function (errorObject) {
//   console.log("The firebase.db read failed: " + errorObject.code);
// });

// refBathroom.on("child_changed", function (snapshot) {
//   var changedPost = snapshot.val();
//   if (changedPost == 1) {

//   }
//   console.log("The updated post title is " + changedPost);
// });







var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function () {
  var ledGreen = new five.Led("P1-11");
  var ledYellow = new five.Led("P1-13");
  var ledRed = new five.Led("P1-15");



  refBathroom.on("child_changed", function (snapshot) {
    var changedPost = snapshot.val();
    if (changedPost == 1) {
      ledGreen.on();
    } else {
      ledGreen.off();
    }
  });

  refKitchen.on("child_changed", function (snapshot) {
    var changedPost = snapshot.val();
    if (changedPost == 1) {
      ledYellow.on();
    } else {
      ledYellow.off();
    }
  });

  refSaloon.on("child_changed", function (snapshot) {
    var changedPost = snapshot.val();
    if (changedPost == 1) {
      ledRed.on();
    } else {
      ledRed.off();
    }
  });

  // ledGreen.blink();
  // if (ledGreen.on){
  //   ledYellow.blink();
  //   if (ledYellow.on) {
  //     ledRed.blink();
  //   }
});
