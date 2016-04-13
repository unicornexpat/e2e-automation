"use strict";
require("../helpers/setup");
var wd = require("wd"),
    async = require('async'),
    driverService = require('../services/driver-service'),
    consoleLog = require('../helpers/console-log');


var iosFacet = function (options, sites, callback) {
    describe("THG_FACET_SUITE", function () {
        this.timeout(100000);
        var suitePassed = true,
            driver,
            failSites = {};

        before(function (done) {
            options.desired.name = 'THG_FACET_SUITE: ' + options.os;
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
            driverService.assure(driver, options, function(wd){
                driver = wd;
                done();
            });
        });

        Object.keys(sites).forEach(function(key) {
            var site = sites[key];

            describe('FACET_SPEC: ' + site.name, function () {
                var sitePassed = true;

                afterEach(function () {
                    if(this.currentTest.state !='passed'){
                        consoleLog('FAILED TEST RECORDED: ' + key);
                        failSites[key] = site;
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

