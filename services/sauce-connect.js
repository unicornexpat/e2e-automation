var sauceConnectLauncher = require('sauce-connect-launcher'),
    consoleLog = require('../helpers/console-log');

var sauceConnectOpen = function (next) {
    consoleLog('STARTING SAUCE CONNECT');
    sauceConnectLauncher({
        username: 'ethannguyens',
        accessKey: 'a1f85fc0-ba5f-4ac3-95e1-b2fdc1a93a9e',
        verbose: false,
        logger: console.log
    }, function (err, sauceConnectProcess) {
        if(err){
            consoleLog('SAUCE CONNECT FAILED TO START');
        }
        else{
            consoleLog('SAUCE CONNECT STARTED');
        }
        next(sauceConnectProcess);
    });
};

var sauceConnectClose = function(sauceConnectProcess){
    consoleLog('CLOSING SAUCE CONNECT');
    sauceConnectProcess.close(function () {
        console.log("SAUCE CONNECT IS CLOSED");
    })
};

module.exports = {
    open : sauceConnectOpen,
    close: sauceConnectClose
};