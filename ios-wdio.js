"use strict";
require("./helpers/setup");

var driverIoInit = require('./services/driverIo-init');
var serverConfig = require('./config/appium-servers').local.host1;


var options = {
    serverConfig: serverConfig,
    desired: require("./config/caps").device.iIphone6Plus
};


describe('Simple cases', function() {
    var driver;
    this.timeout(30000);
    before(function(done) {
        driver = driverIoInit(options);
        driver.call(done);
    });

    after(function() {
        driver.end();
    });

    it("search-function", function(done) {
        return driver
            .url('http://m.mankind.co.uk')
            .contexts().then(function(contexts){
                console.log(contexts);
            })
            .context('WEBVIEW_3')
            .touch('.header-menu-icon')
            .pause(5000)
            .call(done);
    });

});