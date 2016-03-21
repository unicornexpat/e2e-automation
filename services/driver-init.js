var wd = require("wd");


var driverInit = function initDriver(options){
    var driver = wd.promiseChainRemote(options.serverConfig);
    require("../helpers/logging").configure(driver);
    var desired = options.desired;
    desired.name = 'iOS - Menu: ';
    return driver.init(desired);
}

module.exports = driverInit;