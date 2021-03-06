'use strict';

var five = require("johnny-five");
var Raspi = require("raspi-io");
var admin = require("firebase-admin");

var serviceAccount = require("./smarthome-e9e57-firebase-adminsdk-3j0s6-4e00566a10");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smarthome-e9e57.firebaseio.com"
});

var db = admin.database();
var refBathroom = db.ref("server/lamp/bathroom");
var refKitchen = db.ref("server/lamp/kitchen");
var refSaloon = db.ref("server/lamp/saloon");
var refAll = db.ref("server/lamp/all");
var refFreq = db.ref("server/climate/frequency");
var refThermometer = db.ref("server/climate/thermometer");
var refPressure = db.ref("server/climate/pressure");
var refHumidity = db.ref("server/climate/humidity");
var refFrontDoor = db.ref("server/doorAndWindow/frontDoor");
var refDoorAndWindow = db.ref("server/doorAndWindow");
var counter = 0;
var allCounter = 0;
var servoPower = 0;

var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function () {
  var ledGreen = new five.Led("P1-11");
  var ledYellow = new five.Led("P1-13");
  var ledRed = new five.Led("P1-15");
  var piezo = new five.Piezo("P1-37");
  var servo = new five.Servo({
    pin: "P1-12",
    startAt: 0
  });
  var multi = new five.Multi({
    controller: "BME280",
    freq: 3000
  });

  refDoorAndWindow.on("child_changed", function (snapshot) {
    var data = snapshot.val();
    if (data.power.value != servoPower) {
      if (data.power.value == 1) {
        servoPower = 1;
        servo.to(data.openDoor.degree, data.openDoor.speed);
      } else {
        servoPower = 0;
        servo.to(data.closeDoor.degree, data.closeDoor.speed);
      }
    }
  });
  
  multi.on("change", function () {
    refThermometer.update({
      "celsius": this.thermometer.celsius,
      "fahrenheit": this.thermometer.fahrenheit,
      "kelvin": this.thermometer.kelvin
    });
    refPressure.update({
      "value": this.barometer.pressure
    });
    refHumidity.update({
      "value": this.hygrometer.relativeHumidity
    });
    // console.log("Thermometer");
    // console.log("  celsius      : ", this.thermometer.celsius);
    // console.log("  fahrenheit   : ", this.thermometer.fahrenheit);
    // console.log("  kelvin       : ", this.thermometer.kelvin);
    // console.log("--------------------------------------");

    // console.log("Barometer");
    // console.log("  pressure     : ", this.barometer.pressure);
    // console.log("--------------------------------------");

    // console.log("Hygrometer");
    // console.log("  humidity     : ", this.hygrometer.relativeHumidity);
    // console.log("--------------------------------------");
  });

  refAll.on("child_changed", function (snapshot) {
    var changedPost = snapshot.val();
    if (changedPost == 3) {
      refBathroom.update({
        "led": 1
      });
      refKitchen.update({
        "led": 1
      });
      refSaloon.update({
        "led": 1
      });
      maestro();
    }
    if (changedPost == 0) {
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
    if (allCounter == 0 && counter < 0)
      return;

    allCounter = allCounter + counter;
    refAll.update({
      "led": allCounter
    });
  };

  var maestro = function () {
    piezo.play({
      // song is composed by a string of notes
      // a default beat is set, and the default octave is used
      // any invalid note is read as "no note"
      song: "C D F D A - A A A A G G G G - - C D F D G - G G G G F F F F - -",
      beats: 1 / 4,
      tempo: 500
    });
  };

  this.on("exit", function () {
    refAll.update({
      "led": 0
    });
    refBathroom.update({
      "led": 0
    });
    refKitchen.update({
      "led": 0
    });
    refSaloon.update({
      "led": 0
    });
    refFrontDoor.update({
      "value": 0
    });
    servo.home();
  });
  // refFreq.on("child_changed", function (snapshot) {
  //   _freq = snapshot.val();
  //   multis(_freq);
  // });

  // refFreq.on("value", function (snapshot) {
  //   _freq = snapshot.val().value;
  //   multis(_freq);
  // });
  board.repl.inject({
    servo: servo
    // animation: animation
  });
});
