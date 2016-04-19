'use strict';

const sauceConnectLauncher = require('sauce-connect-launcher');
const consoleLog = require('../helpers/console-log');

const open = (done) => {
  consoleLog('STARTING SAUCE CONNECT');
  it('Tunnel is Openned', function (next) {
    this.timeout(100000);
    sauceConnectLauncher({
        username: 'ethannguyens',
        accessKey: 'a1f85fc0-ba5f-4ac3-95e1-b2fdc1a93a9e',
        verbose: false,
        logger: console.log
      }, (err, sauceConnectProcess) => {
        if (err) consoleLog('SAUCE CONNECT FAILED TO START');
        else consoleLog('SAUCE CONNECT STARTED');
        next(done(sauceConnectProcess));
      }
    );
  });
};


const close = (sauceConnectProcess) => {
  consoleLog('CLOSING SAUCE TUNNEL');
  it('Tunnel is CLosed', function (next) {
    this.timeout(100000);
    sauceConnectProcess.close(() => {
      console.log("SAUCE CONNECT IS CLOSED");
      next();
    })
  });
};

module.exports = {
  open: open,
  close: close
};