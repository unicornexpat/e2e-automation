"use strict";
var async = require('async');
var serverConfigs = require('../config/appium-servers');
var sauceConnect = require('../config/sauce-connect');

var iosRunner = function(config) {
    var serverConfig = config.serverConfig,
        desired = config.desired;

    var options = {
        sauceLabs: config.sauceLabs,
        serverConfig: serverConfig,
        desired: desired,
        env: config.env
    };

    if (config.useSauceLabs) {
        desired.name = 'ios - safari';
        desired.tags = ['THG_AUTOMATION_EN'];
        options.serverConfig = serverConfigs.sauce.server1;
        if(config.env == 'dev'){
            sauceConnect();
        }
    }

    testExc(config.specs, config.sites, options);
};

function testExc(specs, sites, options) {
    async.forEachOf(specs, function(spec, key, next){
        spec(options, sites);
    }, function(err){
        if (err) console.log(err);
    })
}

module.exports = iosRunner;