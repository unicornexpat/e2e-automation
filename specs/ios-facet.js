"use strict";
require("../helpers/setup");
var wd = require("wd"),
    async = require('async');

var iosFacet = function (options, site) {

    describe("==================== THG_IOS_PRODUCT_VARIATIONS: " + site.name + " ====================", function () {
        this.timeout(100000);
        var allPassed = true;
        var driver;
        var desired = options.desired;
        var tries_threshold = 2;


        before(function () {
            driver = wd.promiseChainRemote(options.serverConfig);
            require("../helpers/logging").configure(driver);
            desired.name = "iOS - Facet: " + site.name;
            return driver.init(desired);
        });

        after(function () {
            return driver
                .quit()
                .finally(function () {
                    if (process.env.SAUCE) {
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
                    .get(site.urls.live)
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

        it("FACET_SPEC: " + site.name + " - Filter Products", function sectionsClick(done){
            var tries = 0;

            function actualFacetTest(next) {
                 driver.chain()
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
                    .url(function(err, url){
                         if (url.indexOf(site.keys.facet) == -1) {
                             return next('Url not match');
                         }
                         return next(err);
                     })
            }

            function facetTest() {
                try {
                    actualFacetTest(function (err) {
                        if (err && tries++ < tries_threshold) {
                            facetTest();
                        }
                        else {
                            return done(err);
                        }
                    });
                } catch (err) {
                    if (err && tries++ < tries_threshold)
                        facetTest();
                    else return done(err);
                }
            }

            facetTest();

        });
    });
};

module.exports = iosFacet;
