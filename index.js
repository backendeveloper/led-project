'use strict';

var five = require("johnny-five");
var Raspi = require("raspi-io");
var admin = require("firebase-admin");

var serviceAccount = require("./smarthome-d94d7-firebase-adminsdk-bw5qa-60aedc44f9");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://smarthome-d94d7.firebaseio.com"
});

var db = admin.database();
var refBathroom = db.ref("lamp/bathroom");
var refKitchen = db.ref("lamp/kitchen");
var refSaloon = db.ref("lamp/saloon");
var refAll = db.ref("lamp/all");
var refFreq = db.ref("climate/frequency");
var counter = 0;
var allCounter = 0;
// var changedFreq = 5000;


refFreq.on("child_changed", function (snapshot) {
  var changedPost = snapshot.val();
});

// refFreq.on("value", function (snapshot) {
//   var changedPost = snapshot.val().value;
// });


var myObject = {
  firstName: "John",
  lastName: "Doe",
  fullName: function () {
    this.fullName = 1000;
    return this;
  }
}
var asd = myObject.fullName().fullName;

var board = new five.Board({
  io: new Raspi()
});

board.on("ready", function () {
  var ledGreen = new five.Led("P1-11");
  var ledYellow = new five.Led("P1-13");
  var ledRed = new five.Led("P1-15");
  var piezo = new five.Piezo("P1-12");
  var multis = function () {
    var _freq = 10000;
    refFreq.on("child_changed", function (snapshot) {
      _freq = snapshot.val();
    });
    var multi = new five.Multi({
      controller: "BME280",
      freq: _freq
    });
    multi.on("data", function () {
    console.log("Thermometer");
    console.log("  celsius      : ", this.thermometer.celsius);
    console.log("  fahrenheit   : ", this.thermometer.fahrenheit);
    console.log("  kelvin       : ", this.thermometer.kelvin);
    console.log("--------------------------------------");

    console.log("Barometer");
    console.log("  pressure     : ", this.barometer.pressure);
    console.log("--------------------------------------");

    console.log("Hygrometer");
    console.log("  humidity     : ", this.hygrometer.relativeHumidity);
    console.log("--------------------------------------");

    console.log("Altimeter");
    console.log("  feet         : ", this.altimeter.feet);
    console.log("  meters       : ", this.altimeter.meters);
    console.log("--------------------------------------");
  });
  }

  // var multi = new five.Multi({
  //   controller: "BME280",
  //   freq: 1000
  // });
  // board.repl.inject({
  //   piezo: piezo
  // });
  multi.on("data", function () {
    console.log("Thermometer");
    console.log("  celsius      : ", this.thermometer.celsius);
    console.log("  fahrenheit   : ", this.thermometer.fahrenheit);
    console.log("  kelvin       : ", this.thermometer.kelvin);
    console.log("--------------------------------------");

    console.log("Barometer");
    console.log("  pressure     : ", this.barometer.pressure);
    console.log("--------------------------------------");

    console.log("Hygrometer");
    console.log("  humidity     : ", this.hygrometer.relativeHumidity);
    console.log("--------------------------------------");

    console.log("Altimeter");
    console.log("  feet         : ", this.altimeter.feet);
    console.log("  meters       : ", this.altimeter.meters);
    console.log("--------------------------------------");
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
  });
});



















// board.on("ready", function () {
//   var multi = new five.Multi({
//     controller: "BME280"
//   });

//   multi.on("data", function () {
//     console.log("Thermometer");
//     console.log("  celsius      : ", this.thermometer.celsius);
//     console.log("  fahrenheit   : ", this.thermometer.fahrenheit);
//     console.log("  kelvin       : ", this.thermometer.kelvin);
//     console.log("--------------------------------------");

//     console.log("Barometer");
//     console.log("  pressure     : ", this.barometer.pressure);
//     console.log("--------------------------------------");

//     console.log("Hygrometer");
//     console.log("  humidity     : ", this.hygrometer.relativeHumidity);
//     console.log("--------------------------------------");

//     console.log("Altimeter");
//     console.log("  feet         : ", this.altimeter.feet);
//     console.log("  meters       : ", this.altimeter.meters);
//     console.log("--------------------------------------");
//   });
// });
