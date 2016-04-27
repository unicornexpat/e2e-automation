"use strict";

const exec = require('child_process').exec;
const webkit = exec('ttab ios_webkit_debug_proxy');
const devicesDetect = require('./services/devices-detect');
const iosNode = require('./services/ios-node');
const androidNode = require('./services/android-node');


devicesDetect((iosDevices, androidDevices) => {
  console.log(iosDevices);
  iosDevices.map((id) => {
    iosNode(id);
  });
  console.log(androidDevices);
  androidDevices.map((id) => {
    androidNode(id);
  });
});
