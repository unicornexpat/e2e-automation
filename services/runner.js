"use strict";
const async = require('async');
const fs = require('fs');
const serverConfigs = require('../config/appium-servers');
const sauceConnect = require('./sauce-connect');
const consoleLog = require('../helpers/console-log');


const runner = (config) => {
  console.log('====================================================================================================');
  let serverConfig = config.serverConfig;
  const desired = config.desired;

  if (config.sauceLabs) {
    desired.name = 'THG_Mobile_Automation';
    desired.tags = ['THG_AUTOMATION_EN'];
    serverConfig = serverConfigs.sauce.server1;
  }

  let options = {
    sauceLabs: config.sauceLabs,
    serverConfig: serverConfig,
    desired: desired,
    env: config.env,
    os: config.os,
    sauceConnect: config.sauceConnect
  };

  if (config.sauceConnect) {
    sauceConnect.open((sauceConnectProcess) => {
      testExc(config.specs, config.sites, options, 5, sauceConnectProcess);
    });
  }
  else {
    testExc(config.specs, config.sites, options, 5, false);
  }
};

function testExc(specs, sites, options, retry, sauceProcess) {
  let specRun = [];
  let testResults = [];
  let finalResult;

  async.forEachOfSeries(specs, (spec, specKey, callback) => {
    let specSites = {};
    specRun.push(specKey);
    for (let siteKey in sites) {
      const site = sites[siteKey];
      if (site[specKey] !== false) specSites[siteKey] = site;
    }
    spec(options, specSites, (failSites) => {
      if (Object.keys(failSites).length > 0) {
        consoleLog(`TOTAL FAILED SITES: ${Object.keys(failSites).length}`);
        testRerun(spec, failSites, options, retry, (result) => {
          testResults.push(result);
          consoleLog(`FINAL RERUN RESULT: ${result}`);
          return callback();
        });
      }
      else {
        testResults.push('firstPassed');
        return callback();
      }
    });
  }, () => {
    if (sauceProcess) sauceConnect.close(sauceProcess);
    if (testResults.indexOf('failed') != -1) finalResult = 'failed';
    else finalResult = 'passed';
    fs.writeFile('./reports/testResult.txt', finalResult, (err) => {
      if (err) throw err;
    });
    consoleLog(`SPECS RUN: ${specRun} \n SPEC RESULTS: ${testResults} \n FINAL RESULTS: ${finalResult}`);
  });
}

function testRerun(spec, sites, options, retry, next) {
  let time = 0;

  function recRun(sites) {
    let result = 'failed';
    time++;
    consoleLog(`RERUN: ${time} ITERATION OF ${retry}`);
    spec(options, sites, (failSites) => {
      if (Object.keys(failSites).length === 0) {
        result = 'passed';
        return next(result);
      }
      else {
        if (time < retry) recRun(failSites);
        else return next(result);
      }
      consoleLog(`${time} RERUN RESULT: ${result}`);
    })
  }

  recRun(sites);
}

module.exports = runner;