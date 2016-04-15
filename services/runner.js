"use strict";
var async = require('async'),
    fs = require('fs'),
    serverConfigs = require('../config/appium-servers'),
    sauceConnect = require('./sauce-connect'),
    consoleLog = require('../helpers/console-log');


var runner = function (config) {
    console.log('====================================================================================================');
    var serverConfig = config.serverConfig,
        desired = config.desired;

    if (config.sauceLabs) {
        desired.name = 'THG_Mobile_Automation';
        desired.tags = ['THG_AUTOMATION_EN'];
        serverConfig = serverConfigs.sauce.server1;
    }

    var options = {
        sauceLabs: config.sauceLabs,
        serverConfig: serverConfig,
        desired: desired,
        env: config.env,
        os: config.os,
        sauceConnect: config.sauceConnect
    };

    if (config.sauceConnect) {
        sauceConnect.open(function (sauceConnectProcess) {
            testExc(config.specs, config.sites, options, 5, sauceConnectProcess);
        });
    }
    else {
        testExc(config.specs, config.sites, options, 5, false);
    }
};

function testExc(specs, sites, options, retry, sauceProcess) {
    var specRun = [],
        testResults = [],
        finalResult;
    async.forEachOfSeries(specs, function (spec, specKey, callback) {
        var specSites = {};
        specRun.push(specKey);
        for (var siteKey in sites) {
            var site = sites[siteKey];
            if (site[specKey] != false) specSites[siteKey] = site;
        }
        spec(options, specSites, function (failSites) {
            if (Object.keys(failSites).length > 0) {
                consoleLog('TOTAL FAILED SITES: ' + Object.keys(failSites).length);
                testRerun(spec, failSites, options, retry, function (result) {
                    testResults.push(result);
                    consoleLog('FINAL RERUN RESULT: ' + result);
                    return callback();
                });
            }
            else {
                testResults.push('firstPassed');
                return callback();
            }
        });
    }, function () {
        if (sauceProcess) sauceConnect.close(sauceProcess);
        if (testResults.indexOf('failed') != -1) finalResult = 'failed';
        else finalResult = 'passed';
        fs.writeFile("./reports/testResult.txt", finalResult, function (err) {
            if (err) throw err;
        });
        consoleLog('SPECS RUN: ' + specRun + '\n' + 'SPEC RESULTS: ' + testResults + '\n' + 'FINAL RESULTS: ' + finalResult);
    });
}

function testRerun(spec, sites, options, retry, next) {
    var time = 0;

    function recRun(sites) {
        var result = 'failed';
        time++;
        consoleLog('RERUN: ' + time + ' ITERATION OF ' + retry);
        spec(options, sites, function (failSites) {
            if (Object.keys(failSites).length == 0) {
                result = 'passed';
                return next(result);
            }
            else {
                if (time < retry) recRun(failSites);
                else return next(result);
            }
            consoleLog(time + ' RERUN RESULT: ' + result);
        })
    }

    recRun(sites);
}

module.exports = runner;