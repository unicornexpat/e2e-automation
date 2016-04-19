'use strict';

const webdriverio = require('webdriverio');

const driverIoInit = (options) => {
  const driver = webdriverio.remote(options.serverConfig);
  return driver.init(options.desired);
};

module.exports = driverIoInit;