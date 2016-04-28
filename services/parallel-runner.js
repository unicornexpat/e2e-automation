"use strict";
const async = require('async');
const fs = require('fs');
const serverConfigs = require('../config/appium-servers');
const caps = require('../config/caps');
const sauceConnect = require('./sauce-connect');
const consoleLog = require('../helpers/console-log');
const udid = require('../config/udid');
const _ = require('underscore');
const sites = require('../config/sites');
const specs = require('../specs/index');

const deviceIds = ['097637cf2820fdb8', '5f8b9b49'];
let devices = {};

deviceIds.map((id) => {
  devices[id] = {
    id: id,
    active: true
  }
});

/*for (let spec in specs) {
 let activeDevice;
 //while(!activeDevice) {
 activeDevice = _.findWhere(devices, {active: true});
 //}
 if(activeDevice) {
 devices[activeDevice.id].active = false;
 console.log(specs[spec]);
 console.log('activeDevice', activeDevice);
 specExec(activeDevice.id, specs[spec], sites);
 }
 }*/

/*async.forEachOf(specs, (spec, specKey, callback) => {
    let activeDevice;
    // while (!activeDevice) {
    activeDevice = _.findWhere(devices, {active: true});
    // }
    if (activeDevice) {
      devices[activeDevice.id].active = false;
      console.log(specs[spec]);
      console.log('activeDevice', activeDevice);
      specExec(activeDevice.id, spec, sites, () => {
        callback();
      });
    }
  },
  () => {
    console.log('TEST SUITE DONE');
  });*/


specExec(deviceIds[0], specs['search'], sites);
//specExec(deviceIds[1], specs['menu'], sites);

function specExec(deviceId, spec, sites) {

  const id = udid[deviceId];
  const serverConfig = serverConfigs.macMini[id.port];
  const desired = caps.device[id.name];
  const options = {
    serverConfig: serverConfig,
    desired: desired
  };

  console.log(options);

  spec(options, sites, (failSites) => {
    if (Object.keys(failSites).length > 0) {
      consoleLog('TOTAL FAILED SITES: ' + Object.keys(failSites).length);
      specRerun(spec, failSites, options, 0, (result) => {
        consoleLog('FINAL RERUN RESULT: ' + result);
        devices[deviceId].active = true;
      });
    }
  });
}

function specRerun(spec, sites, options, retry, next) {
  let time = 0;

  function recRun(sites) {
    let result = 'failed';
    time++;
    consoleLog('RERUN: ' + time + ' ITERATION OF ' + retry);
    spec(options, sites, (failSites) => {
      if (Object.keys(failSites).length === 0) {
        result = 'passed';
        return next(result);
      } else {
        if (time < retry) recRun(failSites);
        else return next(result);
      }
      consoleLog(time + ' RERUN RESULT: ' + result);
    })
  }

  recRun(sites);
}

// module.exports = runner;