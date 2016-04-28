'use strict';
var caps = require('./config/caps');
const hosts = require('./config/appium-servers');
const siteTypes = require('./config/site-types');

const config = require('./config/index');
const Setter = require('./services/setter');
const iosRunner = require('./services/runner');

var setter = new Setter(config);

setter.excludeSites(siteTypes.main);
setter.setHost(hosts.macMini[4722]);
setter.setTarget(caps.device.iIphone6Plus);

iosRunner(config);

