'use strict';

const wd = require("wd");
const consoleLog = require('../helpers/console-log');
const driverService = require('./driver-service');
const fs = require('fs');



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
  return driver
    .deleteAllCookies()
    .close()
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

const takeScreenshot = (driver, site) => {
  driver.takeScreenshot((err, screenShot) => {
    const date = new Date();
    const fileName = `${site}_${date}.png`;
    consoleLog(fileName);
    fs.writeFile(`./screenshot/${fileName}`, screenShot, 'base64', function(err){
      if (err) consoleLog(err);
    })
  })
};

module.exports = {
  init: driverInit,
  quit: driverQuit,
  assure: driverAssure,
  takeScreenshot: takeScreenshot
};

