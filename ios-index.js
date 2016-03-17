var caps = require('./config/caps');

var config = require('./config/index'),
    Setter = require('./config/setter'),
    setter = new Setter(config),
    iosRunner = require('./specs/ios-runner');

setter.runOnlySite('beautyExpert');

iosRunner(config);
