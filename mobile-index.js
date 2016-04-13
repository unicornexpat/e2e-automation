var caps = require('./config/caps');
var hosts = require('./config/appium-servers');

var config = require('./config/index'),
    Setter = require('./services/setter'),
    setter = new Setter(config),
    iosRunner = require('./services/runner');

setter
//.runOnlySpec('menu');
    .setOs('iOS').useSauceLabs().setTarget(caps.simulator.iPhone5S_ios92);
    //.setOs('Android').useSauceLabs().setTarget(caps.simulator.nexus6_Android19);
   //.setTarget(caps.device.iPhone5C);
    //.setOs('Android').setTarget(caps.device.nexus5).runOnlySpec('menu');
    //.setTarget(caps.device.iPadMini3);
    //.runOnlySite('menu').runOnlySpec('menu');
    //.setOs('Android').setTarget(caps.device.nexus5);
iosRunner(config);
