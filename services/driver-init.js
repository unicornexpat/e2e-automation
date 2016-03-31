var wd = require("wd");


var driverInit = function initDriver(options){
    var driver = wd.promiseChainRemote(options.serverConfig);
    require("../helpers/logging").configure(driver);
    return driver.init(options.desired);
};

module.exports = driverInit;
