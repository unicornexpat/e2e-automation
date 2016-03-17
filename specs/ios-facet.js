"use strict";
require("../helpers/setup");
var wd = require("wd"),
    async = require('async');

var iosFacet = function (options, site) {

    describe("THG_IOS_FACET: " + site.name, function () {
        this.timeout(100000);
        var allPassed = true,
            driver,
            desired = options.desired,
            tries_threshold = 2,
            siteUrl = site.urls[options.env];

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
                    if (options.sauceLabs) {
                        return driver.sauceJobStatus(allPassed);
                    }
                });
        });

        afterEach(function () {
            allPassed = allPassed && this.currentTest.state === 'passed';
        });

        it("SEARCH_SPEC: " + site.name + " - Return At Least 1 Item", function sectionsClick() {
            return driver.chain()
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
                .title().should.eventually.include(site.keys.searchFound);
        });

        it("FACET_SPEC: " + site.name + " - Filter Products", function sectionsClick() {
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
    })
};

module.exports = iosFacet;
