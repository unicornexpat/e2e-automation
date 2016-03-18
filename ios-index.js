var caps = require('./config/caps');

var config = require('./config/index'),
    Setter = require('./config/setter'),
    setter = new Setter(config),
    iosRunner = require('./specs/ios-runner');

setter.useSauceLabs().setTarget(caps.simulator.iPhone5S_ios92);
//console.log(config);
iosRunner(config);
