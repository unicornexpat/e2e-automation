"use strict";

const udid = require('../config/udid');
const exec = require('child_process').exec;

const androidNode = (id) => {
  exec(`ttab node ../appium --session-override -p ${udid[id].port} -bp ${udid[id].bp}  -U ${id} --chromedriver-port ${udid[id].cp}`);
};

module.exports = androidNode;
