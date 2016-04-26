'use strict';

const wd = require("wd");
const consoleLog = require('../helpers/console-log');
const driverService = require('./driver-service');


const driverInit = (options, done) => {
  const driver = wd.promiseChainRemote(options.serverConfig);
  require("../helpers/logging").configure(driver);

  let time = 0;

  function recInit() {
    time++;
    driver.init(options.desired, (err, sessionID, capabilities) => {
      if (err && (time < 5)) {
        consoleLog(err);
        setTimeout(function () {
          recInit();
        }, 62000);
      } else done(driver);
    });
  }

  recInit();
};

const driverQuit = (driver, suitePassed, sauceLabs, done) => {
  driver
    .quit()
    .finally(function () {
      if (sauceLabs) {
        return driver.sauceJobStatus(suitePassed, (err) => {
          if (err) consoleLog(err);
          done();
        });
      } else done();
    });
};

const driverAssure = (driver, options, done) => {
  driver.status((err, status) => {
    if (err) {
      consoleLog('RE-INIT A SESSION');
      driver.quit();
      driverService.init(options, (wd) => done(wd));
    } else done(driver);
  });
};

module.exports = {
  init: driverInit,
  quit: driverQuit,
  assure: driverAssure
};

