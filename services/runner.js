"use strict";
var serverConfigs = require('../config/appium-servers'),
    sauceConnect = require('../config/sauce-connect'),
    driverInit = require('../services/driver-init');

var async = require('async');
var fs = require('fs');

var runner = function (config) {
    console.log('****************************************************************************************************');
    var serverConfig = config.serverConfig,
        desired = config.desired;

    if (config.sauceLabs) {
        desired.name = 'THG_Mobile_Automation';
        desired.tags = ['THG_AUTOMATION_EN'];
        serverConfig = serverConfigs.sauce.server1;
        if (config.env == 'dev') {
            console.log('*************************************');
            console.log('STARTING SAUCE CONNECT');
            console.log('*************************************');
            sauceConnect();
        }
    }

    var options = {
        sauceLabs: config.sauceLabs,
        serverConfig: serverConfig,
        desired: desired,
        env: config.env,
        os: config.os
    };

    testExc(config.specs, config.sites, options, 5);
};

function testExc(specs, sites, options, retry) {
    var specRun = [],
        testResults = [],
        finalResult;

    async.forEachOfSeries(specs, function (spec, specKey, callback) {
        var specSites = {};
        specRun.push(specKey);
        for (var siteKey in sites) {
            var site = sites[siteKey];
            if (site[specKey] != false) {
                specSites[siteKey] = site;
            }
        }
        spec(options, specSites, function (failSites) {
            if (Object.keys(failSites).length > 0) {
                console.log('=====================================');
                console.log('TOTAL FAILED SITES: ' + Object.keys(failSites).length);
                console.log('=====================================');
                testRerun(spec, failSites, options, retry, function (result) {
                    testResults.push(result);
                    console.log('=====================================');
                    console.log('TOTAL RERUN RESULT: ' + result);
                    console.log('=====================================');
                    return callback();
                });
            }
            else {
                testResults.push('firstPassed');
                return callback();
            }
        });
    }, function () {
        if (testResults.indexOf('failed') != -1) {
            finalResult = 'failed';
        }
        else {
            finalResult = 'passed';
        }
        fs.writeFile("./reports/testResult.txt", finalResult, function (err) {
            if (err) throw err;
        });
        console.log('*************************************');
        console.log('SPECS RUN: ' + specRun);
        console.log('SPEC RESULTS: ' + testResults);
        console.log('FINAL RESULTS: ' + finalResult);
        console.log('*************************************');
    });
}

function testRerun(spec, sites, options, retry, next) {
    var time = 0;

    function recRun(sites) {
        var result = 'failed';
        time++;
        console.log('-------------------------------------');
        console.log(time + ' ITERATION OF ' + retry);
        console.log('-------------------------------------');
        spec(options, sites, function (failSites) {
            if (Object.keys(failSites).length == 0) {
                result = 'passed';
                return next(result);
            }
            else {
                if (time < retry) recRun(failSites);
                else {
                    return next(result);
                }
            }
            console.log('-------------------------------------');
            console.log('RERUN RESULT: ' + result);
            console.log('-------------------------------------');
        })
    }

    recRun(sites);
}

module.exports = runner;