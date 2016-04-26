"use strict";

const caps = require('./config/caps');
const udid = require('./config/udid');
const exec = require('child_process').exec;
const iosDetect = exec('idevice_id -l');
const androidDetect = exec('adb devices');
const webkit = exec('ttab ios_webkit_debug_proxy');

let iOsDevices  = [];
let androidDevices = [];

iosDetect.stdout.on('data', (data) => {
  iOsDevices = data.split('\n');
  iOsDevices.pop();
  console.log(iOsDevices);
  iOsDevices.map((id) => {
    exec(`ttab ../appium/bin/ios-webkit-debug-proxy-launcher.js -c ${id}:${udid[id].wp} -d`);
    exec(`ttab node ../appium --session-override -p ${udid[id].port} -bp ${udid[id].bp}  -U ${id} --webkit-debug-proxy-port ${udid[id].wp} --tmp /tmp/${udid[id].port}`);
  });
});

androidDetect.stdout.on('data', (data) => {
  const tmp = data.split('\n');
  tmp.map((id) => {
    const key = id.indexOf('\t');
    if (key > 0) androidDevices.push(id.substr(0, key));
  });
  androidDevices.map((id) => {
    exec(`ttab node ../appium --session-override -p ${udid[id].port} -bp ${udid[id].bp}  -U ${id} --chromedriver-port ${udid[id].cp}`);
  });
});



