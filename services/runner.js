"use strict";
var serverConfigs = require('../config/appium-servers'),
    sauceConnect = require('../config/sauce-connect'),
    driverInit = require('../services/driver-init');

var runner = function(config) {
    var serverConfig = config.serverConfig,
        desired = config.desired;

    if (config.useSauceLabs) {
        desired.name = 'THG_Mobile_Automation';
        desired.tags = ['THG_AUTOMATION_EN'];
        serverConfig = serverConfigs.sauce.server1;
        if(config.env == 'dev'){
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

    testExc(config.specs, config.sites, options);
};

function testExc(specs, sites, options) {
    for (var specKey in specs) {
        var specSites = {};
        for (var siteKey in sites) {
            var site = sites[siteKey];
            if(site[specKey] != false){
                specSites[siteKey] = site;
            }
        }
        specs[specKey](options, specSites);
    }
}

module.exports = runner;