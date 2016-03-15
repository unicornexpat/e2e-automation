"use strict";
var async = require('async');
var serverConfigs = require('../config/appium-servers');

var iosRunner = function(config) {
    var serverConfig = config.serverConfig;
    var desired = config.desired;
    console.log(config.useSauceLabs);
    if (config.useSauceLabs) {
        desired.name = 'ios - safari';
        desired.tags = ['THG_AUTOMATION_EN'];
        serverConfig = serverConfigs.sauce.server1;
    }
    var options = {
        serverConfig: serverConfig,
        desired: desired
    };
    console.log(options);
    async.forEachOfSeries(config.sites, function (site, key, callback) {
        async.forEachOfSeries(config.specs, function(spec, key, next){
            spec(options, site);
            next()
        }, function(err){
            if (err) callback(err)
            callback();
        })
    }, function (err) {
        if (err) throw err;
    });
}

module.exports = iosRunner;