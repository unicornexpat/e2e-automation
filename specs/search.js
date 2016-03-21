"use strict";
require("../helpers/setup");
var wd = require("wd"),
    async = require('async'),
    driverInit = require('../services/driver-init');

var iosSearch = function(options, sites) {
    describe("THG_SEARCH_SUITE", function () {
        this.timeout(100000);
        var masterPassed = true,
            driver;

        before(function () {
            driver = driverInit(options);
        });

        after(function () {
            return driver
                .quit()
                .finally(function () {
                    if (options.sauceLabs) {
                        return driver.sauceJobStatus(masterPassed);
                    }
                });
        });

        afterEach(function () {
            masterPassed = masterPassed && this.currentTest.state === 'passed';
        });

        Object.keys(sites).forEach(function (key) {
            var site = sites[key];

            describe('MENU: ' + site.name, function () {
                var allPassed = true;

                before(function () {
                    driver.status(function (err, status) {
                        if ((status.isShuttingDown != false && options.sauceLabs != true) || (status.details.status != 'available' && options.sauceLabs == true)) {
                            console.log('IMITATING A NEW SESSION');
                            driver = driverInit(options);
                        }
                    });
                });

                afterEach(function () {
                    allPassed = allPassed && this.currentTest.state === 'passed';
                });

                it("SEARCH_SPEC: " + site.name + " - Return At Least 1 Item", function sectionsClick() {
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