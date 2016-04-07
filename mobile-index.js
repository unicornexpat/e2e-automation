var caps = require('./config/caps');
var hosts = require('./config/appium-servers');

var config = require('./config/index'),
    Setter = require('./services/setter'),
    setter = new Setter(config),
    iosRunner = require('./services/runner');

setter
//.runOnlySpec('menu');
    //.setOs('iOS').useSauceLabs().setTarget(caps.simulator.iPhone5S_ios92).runOnlySpec('menu');
    //.setOs('Android').useSauceLabs().setTarget(caps.simulator.nexus6_Android19);
   //.setTarget(caps.device.iPhone5C);
    .setOs('Android').setTarget(caps.device.nexus5).runOnlySpec('menu').runOnlySite('manKind');
    //.setTarget(caps.device.iPadMini3);
    //.runOnlySite('menu').runOnlySpec('menu');
iosRunner(config);
