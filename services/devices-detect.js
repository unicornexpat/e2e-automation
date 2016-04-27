"use strict";

const exec = require('child_process').exec;
const iosList = exec('idevice_id -l');
const androidList = exec('adb devices');


const devicesDetect = (done) => {
  let iosDevices  = [];
  let androidDevices = [];
  iosList.stdout.on('data', (data) => {
    iosDevices = data.split('\n');
    iosDevices.pop();
  });
  androidList.stdout.on('data', (data) => {
    const tmp = data.split('\n');
    tmp.map((id) => {
      const key = id.indexOf('\t');
      if (key > 0) androidDevices.push(id.substr(0, key));
    });
    done(iosDevices, androidDevices);
  });
};

module.exports = devicesDetect;