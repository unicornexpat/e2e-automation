var webdriverio = require('webdriverio');


var driverIoInit = function initDriverIo(options){
    var driver = webdriverio.remote(options.serverConfig);
    return driver.init(options.desired);
};

module.exports = driverIoInit;