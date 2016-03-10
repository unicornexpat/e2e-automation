"use strict";
var async = require('async');
var     _ = require('underscore');
var serverConfigs = require('./config/appium-servers');
var serverConfig = process.env.SAUCE ?
    serverConfigs.sauce.server1 : serverConfigs.local.host1;
var desired = _.clone(require("./config/caps").device.iIphone6Plus);
desired.browserName = 'safari';
if (process.env.SAUCE) {
    desired.name = 'ios - safari';
    desired.tags = ['THG_AUTOMATION_EN'];
}
var options = {
    serverConfig: serverConfig,
    desired: desired
};

var sites = require('./config/sites');

var iosSearch = require('./specs/ios-search');
var iosProductVariation = require('./specs/ios-product-variations');
var iosMenu = require('./specs/ios-menu');
var iosFacet = require('./specs/ios-facet');

async.forEachOfSeries(sites, function(site, key, callback){
    iosMenu(options, site);
    iosSearch(options, site);
    if(site.facet === true) {
        iosFacet(options, site);
    }
    iosProductVariation(options, site);
    callback();

}, function (err) {
    if (err) console.error(err.message);
});
