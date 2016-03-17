"use strict";
require("../helpers/setup");
var wd = require("wd"),
    async = require('async');

var iosProductVariations = function (options, site) {

    describe("THG_IOS_PAGINATION: " + site.name, function () {
        this.timeout(100000);
        var allPassed = true,
            driver,
            desired = options.desired,
            tries_threshold = 2,
            siteUrl = site.urls[options.env];


        before(function () {
            driver = wd.promiseChainRemote(options.serverConfig);
            require("../helpers/logging").configure(driver);
            desired.name = "iOS - Pagination: " + site.name;
            return driver.init(desired);
        });

        after(function () {
            return driver
                .quit()
                .finally(function () {
                    if (options.sauceLabs) {
                        return driver.sauceJobStatus(allPassed);
                    }
                });
        });

        afterEach(function () {
            allPassed = allPassed && this.currentTest.state === 'passed';
        });

        it("SEARCH_SPEC: " + site.name + " - Return At Least 1 Item", function sectionsClick(done) {
            var tries = 0;

            function actualSearchTest(next) {
                driver.chain()
                    .get(siteUrl)
                    .elementByCss('.search-focus', function touchSearch(err, search) {
                        if (err) throw err;
                        search.flick(1, 1, 0, function flickCb(err) {
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
                    .title(function (err, title) {
                        if (title.indexOf(site.keys.searchFound) == -1) {
                            return next('Title not match');
                        }
                        return next(err);
                    })
            }

            function searchTest() {
                try {
                    actualSearchTest(function (err) {
                        if (err && tries++ < tries_threshold) {
                            searchTest();
                        }
                        else {
                            return done(err);
                        }
                    });
                } catch (err) {
                    if (err && tries++ < tries_threshold)
                        searchTest();
                    else return done(err);
                }
            }

            searchTest();
        });


        it("PAGINATION: " + site.name + " - Next Page", function itemClick() {
            return driver.chain()
                .elementByCss('.btn-next', function (err, btnEl) {
                    btnEl.elementByCss('a', function (err, btnA) {
                        if (err) btnEl.click();
                        else btnA.click();
                    })
                })
                .waitForElementByCss('.btn-previous', 10000)
                .url().should.eventually.include(site.keys.pagination);
        });

    });
};

module.exports = iosProductVariations;
