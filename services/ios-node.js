"use strict";

const udid = require('../config/udid');
const exec = require('child_process').exec;

const iosNode = (id) => {
  exec(`ttab ../appium/bin/ios-webkit-debug-proxy-launcher.js -c ${id}:${udid[id].wp} -d`);
  exec(`ttab node ../appium --session-override -p ${udid[id].port} -bp ${udid[id].bp}  -U ${id} --webkit-debug-proxy-port ${udid[id].wp} --tmp /tmp/${udid[id].port}`);
};

module.exports = iosNode;
