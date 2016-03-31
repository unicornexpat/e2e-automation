var wd = require("wd"),
    webdriverio = require('webdriverio');


var driverInit = function initDriver(options){
    var driver = wd.promiseChainRemote(options.serverConfig);
    require("../helpers/logging").configure(driver);
    return driver.init(options.desired);
};

var driverIoInit = function initDriverIo(options){
    var driver = webdriverio.remote(options.serverConfig);
    return driver.init(options.desired);
};

module.exports = {
    driverInit: driverInit,
    driverIoInit: driverIoInit
};