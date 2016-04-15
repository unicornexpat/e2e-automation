"use strict";
require("../helpers/setup");
var wd = require("wd"),
    async = require('async'),
    driverService = require('../services/driver-service'),
    consoleLog = require('../helpers/console-log');


var iosPagination = function (options, sites, callback) {
    describe("THG_PAGINATION_SUITE", function () {
        this.timeout(100000);
        var suitePassed = true,
            driver,
            fail = 0,
            failSites = {};

        before(function (done) {
            options.desired.name = 'THG_PAGINATION_SUITE: ' + options.os;
            driverService.init(options, function (wd) {
                driver = wd;
                done();
            });
        });

        after(function (done) {
            driverService.quit(driver, suitePassed, options.sauceLabs, function () {
                done(callback(failSites));
            })
        });

        afterEach(function (done) {
            suitePassed = suitePassed && this.currentTest.state === 'passed';
            if (fail > 10) driverService.quit(driver, suitePassed, options.sauceLabs, function () {
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

            describe('PAGINATION_SPEC: ' + site.name, function () {
                var sitePassed = true;

                afterEach(function () {
                    if(this.currentTest.state !='passed'){
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

                it("PAGINATION: " + site.name + " - Next Page", function itemClick() {
                    return driver.chain()
                        .elementByCssIfExists('.btn-next', function (err, btnEl) {
                            btnEl.elementByCss('a', function (err, btnA) {
                                if (err) btnEl.click();
                                else btnA.click();
                            })
                        })
                        .waitForElementByCss('.btn-previous', 10000)
                        .url().should.eventually.include(site.keys.pagination);
                });
            });
        });
    });
};

module.exports = iosPagination;