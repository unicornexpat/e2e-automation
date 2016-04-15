var wd = require("wd"),
    consoleLog = require('../helpers/console-log');
driverService = require('./driver-service');


var driverInit = function initDriver(options, done) {
    var driver = wd.promiseChainRemote(options.serverConfig);
    require("../helpers/logging").configure(driver);
    var time = 0;

    function recInit() {
        time++;
        driver.init(options.desired, function (err, sessionID, capabilities) {
            if (err && (time < 3)) {
                consoleLog(err);
                setTimeout(function () {
                    recInit();
                }, 62000);
            }
            else {
                return done(driver);
            }
        });
    }
    recInit();
};

var driverQuit = function (driver, suitePassed, sauceLabs, done) {
    driver
        .quit()
        .finally(function () {
            if (sauceLabs) {
                return driver.sauceJobStatus(suitePassed, function (err) {
                    if (err) consoleLog(err);
                    done();
                });
            }
            else {
                done();
            }
        });
};

var driverAssure = function (driver, options, done) {
    driver.status(function (err, status) {
        if (err || (options.os == 'iOS' && status.isShuttingDown != false && !options.sauceLabs)) {
            consoleLog('REINIT A NEW SESSION');
            driver.quit();
            driverService.init(options, function (wd) {
                done(wd);
            })
        }
        else {
            done(driver);
        }
    });
};

module.exports = {
    init: driverInit,
    quit: driverQuit,
    assure: driverAssure
};

