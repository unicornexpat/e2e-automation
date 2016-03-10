"use strict";
var async = require('async');
var     _ = require('underscore');
var serverConfigs = require('./config/appium-servers');
var serverConfig = process.env.SAUCE ?
    serverConfigs.sauce.server1 : serverConfigs.local.host1;
var desired = _.clone(require("./config/caps").device.iIphone6Plus);
desired.browserName = 'safari';
if (process.env.SAUCE) {
    desired.tags = ['THG_AUTOMATION_EN'];
}
var options = {
    serverConfig: serverConfig,
    desired: desired
};

var sites = require('./config/sites');
var iosSearch = require('./specs/ios-search');
var iosProductVariation = require('./specs/ios-product-variations');

var specRunner = function (){
    switch(option){
        case sanity:
            async.series(
                search: async.forEachOfSeries(sites, function(site, key, callback){
                        iosMenu(options, site);
                        callback();
                    }, function (err) {
                        if (err) console.error(err.message);
                        console.log('TEST COMPLETED');
                    });
            )
            break;
        case full:
            break;
        default:
            break;
    }
};



module.exports = specRunner;