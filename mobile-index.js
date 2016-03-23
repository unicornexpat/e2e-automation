var caps = require('./config/caps');
var hosts = require('./config/appium-servers');

var config = require('./config/index'),
    Setter = require('./services/setter'),
    setter = new Setter(config),
    iosRunner = require('./services/runner');

setter
    //.useSauceLabs().setTarget(caps.simulator.nexus6_Android19);
   //.setTarget(caps.simulator.iPhone5S_ios92);
    //.runOnlySpec('menu');
    //.runOnlySite('myGeekBox');
    .setOs('Android').setHost(hosts.local.host3).setTarget(caps.device.s5);
    //.setOs('Android');

iosRunner(config);
