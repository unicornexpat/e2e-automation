"use strict";
require("../helpers/setup");
var wd = require("wd");


var iosSearch = function(options, site) {

    describe("==================== THG_IOS_SEARCH: " + site.name+" ====================", function () {
        this.timeout(100000);
        var allPassed = true;
        var driver;
        var desired = options.desired;
        var tries_threshold = 2;


        before(function(){
            driver = wd.promiseChainRemote(options.serverConfig);
            require("../helpers/logging").configure(driver);
            desired.name = 'iOS - Search: ' + site.name;
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
    });
};

module.exports = iosSearch;