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
var refAll = db.ref("lamp/all");
var counter = 0;
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



// var hopperRef = refAll.child("led");
// hopperRef.update({
//   "led": "Amazing Grace"
// });





var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function () {
  var ledGreen = new five.Led("P1-11");
  var ledYellow = new five.Led("P1-13");
  var ledRed = new five.Led("P1-15");

  refAll.on("child_changed", function (snapshot) {
    var changedPost = snapshot.val();
    if (changedPost == 1) {
      refBathroom.update({
        "led": 1
      });
      refKitchen.update({
        "led": 1
      });
      refSaloon.update({
        "led": 1
      });
    } else {
      refBathroom.update({
        "led": 0
      });
      refKitchen.update({
        "led": 0
      });
      refSaloon.update({
        "led": 0
      });
    }
  });


  refBathroom.on("child_changed", function (snapshot) {
    var changedPost = snapshot.val();
    if (changedPost == 1) {
      allLedCounter(1);
      ledGreen.on();
    } else {
      allLedCounter(-1);
      ledGreen.off();
    }
  });

  refKitchen.on("child_changed", function (snapshot) {
    var changedPost = snapshot.val();
    if (changedPost == 1) {
      allLedCounter(1);
      ledYellow.on();
    } else {
      allLedCounter(-1);
      ledYellow.off();
    }
  });

  refSaloon.on("child_changed", function (snapshot) {
    var changedPost = snapshot.val();
    if (changedPost == 1) {
      allLedCounter(1);
      ledRed.on();
    } else {
      allLedCounter(-1);
      ledRed.off();
    }
  });

  var allLedCounter = function (counter) {
    if (counter < 0)
      return;

    counter = 0 + counter;
    if (counter == 3) {
      refAll.update({
        "led": 1
      });
    }
     if (counter == 0) {
      refAll.update({
        "led": 0
      });
    }
  };
});
