'use strict';
const caps = require('./config/caps');
const hosts = require('./config/appium-servers');
const siteTypes = require('./config/site-types');

const config = require('./config/index');
const Setter = require('./services/setter');
const iosRunner = require('./services/runner');

let setter = new Setter(config);

setter.runSites(siteTypes.main);

iosRunner(config);
