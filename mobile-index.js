var caps = require('./config/caps');
var hosts = require('./config/appium-servers');

var config = require('./config/index'),
    Setter = require('./services/setter'),
    setter = new Setter(config),
    iosRunner = require('./services/runner');

setter.runOnlySpec('search')
    //.useSauceLabs().setTarget(caps.simulator.iPhone5S_ios92);

iosRunner(config);
