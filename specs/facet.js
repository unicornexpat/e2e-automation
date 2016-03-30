"use strict";
require("../helpers/setup");
var wd = require("wd"),
    async = require('async'),
    driverInit = require('../services/driver-init');

var iosFacet = function (options, sites) {
    describe("THG_FACET_SUITE", function () {
        this.timeout(100000);
        var masterPassed = true,
            driver;

        before(function () {
            options.desired.name = 'THG_FACET_SUITE: ' + options.os;
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

        Object.keys(sites).forEach(function(key) {
            var site = sites[key];

            describe('FACET_SPEC: ' + site.name, function () {
                var allPassed = true;

                before(function () {
                    driver.status(function (err, status) {
                        if ((status.isShuttingDown != false && options.sauceLabs != true && options.os == 'iOS') || (status.details.status != 'available' && options.sauceLabs == true)) {
                            console.log('IMITATING A NEW SESSION');
                            driver.quit();
                            driver = driverInit(options);
                        }
                    });
                });

                afterEach(function () {
                    allPassed = allPassed && this.currentTest.state === 'passed';
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

                it("FACET: " + site.name + " - Filter Products", function sectionsClick() {
                    return driver.chain()
                        .waitForElementByCss(".js-toggle-list-facets", 10000)
                        .click()
                        .waitForElementByCss("#facets-panel", 10000, function (err, el) {
                            el.elementsByCss(".unit", function (err, unitOpts) {
                                unitOpts[0].elementByCss('.facets-title').click(function (err) {
                                    if (err) throw err;
                                    unitOpts[0].elementByCss('li').click();
                                });
                            })
                        })
                        .waitForElementByCss(".checked", 10000)
                        .elementByCss('.facets-block__results-btn').click()
                        .url().should.eventually.include(site.keys.facet);
                });
            });
        });
    });
};

module.exports = iosFacet;

