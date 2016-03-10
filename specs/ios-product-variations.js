"use strict";
require("../helpers/setup");
var wd = require("wd"),
    async = require('async');

var iosProductVariations = function (options, site) {

    describe("==================== THG_IOS_PRODUCT_VARIATIONS: " + site.name + " ====================", function () {
        this.timeout(100000);
        var allPassed = true;
        var driver;
        var desired = options.desired;
        var tries_threshold = 2;


        before(function () {
            driver = wd.promiseChainRemote(options.serverConfig);
            require("../helpers/logging").configure(driver);
            desired.name = "iOS - Product Variations: " + site.name;
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


        it("PRODUCT_VARIATIONS_SPEC: " + site.name + " - Add Product Variation to Basket", function itemClick(done) {
            var tries = 0;

            function actualVariationTest(next) {
                driver.chain()
                    .elementByCss('.item', function searchElCb(err, itemEl) {
                        itemEl.elementByCss('a').click();
                    })
                    .waitForElementByCss('.productoptions', 100000, function waitCb(err, el) {
                        el.elementsByCss('form', function elCb(err, forms) {
                            async.forEachOfSeries(forms, function formIter(form, key, callback) {
                                form.elementsByCss('option', function (err, options) {
                                    if (options.length > 1) {
                                        options[1].click();
                                    }
                                    else {
                                        options[0].click();
                                    }
                                    callback(err);
                                });
                            }, function (err) {
                                if (err) throw err;
                                driver.elementByCss('.buy-button').click();
                            });
                        })
                    })
                    .waitForElementByCss('.btn-ajax-basket', 100000, function(err, el){
                        next(err);
                    });
            }

            function variationTest() {
                try {
                    actualVariationTest(function (err) {
                        if (err && tries++ < tries_threshold) {
                            variationTest();
                        }
                        else {
                            return done(err);
                        }
                    });
                } catch (err) {
                    if (err && tries++ < tries_threshold)
                        variationTest();
                    else return done(err);
                }
            }

            variationTest();
        });

    });
};

module.exports = iosProductVariations;
