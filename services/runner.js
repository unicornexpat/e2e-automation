"use strict";
var serverConfigs = require('../config/appium-servers'),
    sauceConnect = require('../config/sauce-connect'),
    driverInit = require('../services/driver-init');

var runner = function(config) {
    var serverConfig = config.serverConfig,
        desired = config.desired;

    if (config.sauceLabs) {
        desired.name = 'THG_Mobile_Automation';
        desired.tags = ['THG_AUTOMATION_EN'];
        serverConfig = serverConfigs.sauce.server1;
        if(config.env == 'dev'){
            console.log('STARTING SAUCE CONNECT');
            sauceConnect();
        }
    }

    var options = {
        sauceLabs: config.sauceLabs,
        serverConfig: serverConfig,
        desired: desired,
        env: config.env,
        os: config.os
    };

    testExc(config.specs, config.sites, options, 1);
};

function testExc(specs, sites, options, times) {
    for(var i=0; i<times; i++) {
        for (var specKey in specs) {
            var specSites = {};
            for (var siteKey in sites) {
                var site = sites[siteKey];
                if (site[specKey] != false) {
                    specSites[siteKey] = site;
                }
            }
            specs[specKey](options, specSites);
        }
    }
}

module.exports = runner;