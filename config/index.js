var _ = require('underscore');

var index = {
    debug: false,
    takeScreenShots:true,
    sauceLabs: false,
    env: 'live',
    sites: require('./sites'),
    specs: require('../specs/index'),
    serverConfig: require('./appium-servers').local.host1,
    desired: _.clone(require("./caps").device.iIphone6Plus)
};

module.exports = index;
