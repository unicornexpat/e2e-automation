"use strict";

require("../helpers/setup");
const wd = require("wd");
const async = require('async');
const driverService = require('../services/driver-service');
const consoleLog = require('../helpers/console-log');

const iosSearch = (options, sites, callback) => {
    describe("THG_SEARCH_SUITE", function () {
        this.timeout(100000);
        let suitePassed = true;
        let driver;
        let fail = 0;
        let failSites = {};

        before(function (done) {
            options.desired.name = 'THG_SEARCH_SUITE: ' + options.os;
            driverService.init(options, function (wd) {
                driver = wd;
                done();
            });
        });

        after(function (done) {
            driverService.quit(driver, suitePassed, options.sauceLabs, () => done(callback(failSites)));
        });

        afterEach(function (done) {
            suitePassed = suitePassed && this.currentTest.state === 'passed';
            if (fail > 8) driverService.quit(driver, suitePassed, options.sauceLabs, function () {
                driverService.init(options, function (wd) {
                    driver = wd;
                    fail = 0;
                    done();
                });
            });
            else driverService.assure(driver, options, function (wd) {
                driver = wd;
                done();
            });
        });

        Object.keys(sites).forEach(function(key) {
            var site = sites[key];

            describe('SEARCH_SPEC: ' + site.name, function () {
                var sitePassed = true;

                afterEach(function () {
                    if(this.currentTest.state !='passed'){
                        driverService.takeScreenshot(driver, key);
                        consoleLog('FAILED TEST RECORDED: ' + key);
                        failSites[key] = site;
                        fail++;
                    }
                    sitePassed = sitePassed && this.currentTest.state === 'passed';
                });

                it("SEARCH: " + site.name + " - Return At Least 1 Item", function sectionsClick() {
                    return driver.chain()
                        .get(site.urls[options.env])
                        .elementByCss('.search-focus', function touchSearch(err, search) {
                            if (err) throw err;
                            search.flick(0, 0, 1, function flickCb(err) {
                                if (err) throw err;
                                driver.elementByCss('#search-text', 10000, function (err, el) {
                                    el.sendKeys(wd.SPECIAL_KEYS.Return);
                                });
                            })
                        })
                        .sleep(1000)
                        .waitForElementByCss('.item', 20000, function elementCb(err, el) {
                            if (err) throw err;
                            should.exist(el);
                        })
                        .title().should.eventually.include(site.keys.searchFound);
                });
            });
        });
    });
};

module.exports = iosSearch;