const caps = require('./config/caps');
const hosts = require('./config/appium-servers');
const siteTypes = require('./config/site-types');
const config = require('./config/index');
const Setter = require('./services/setter');
const iosRunner = require('./services/runner');

var setter = new Setter(config);

iosRunner(config);
