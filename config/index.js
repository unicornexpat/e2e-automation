const _ = require('underscore');

var index = {
  debug: false,
  takeScreenShots: true,
  sauceLabs: false,
  env: 'live',
  sites: require('./sites'),
  specs: require('../specs/index'),
  serverConfig: require('./appium-servers').macMini['4722'],
  desired: _.clone(require("./caps").device.iIphone6Plus),
  os: 'iOS',
  sauceConnect: false
};

module.exports = index;
