"use strict";

require("../helpers/setup");
const wd = require("wd");
const async = require('async');
const driverService = require('../services/driver-service');
const consoleLog = require('../helpers/console-log');

const iosFacet = (options, sites, callback) => {
  describe('THG_FACET_SUITE', function () {
    this.timeout(100000);
    let suitePassed = true;
    let driver;
    let fail = 0;
    let failSites = {};

    before(function (done) {
      options.desired.name = `THG_FACET_SUITE ${options.os}`;
      driverService.init(options, (wd) => {
        driver = wd;
        done();
      });
    });

    after(function (done) {
      driverService.quit(driver, suitePassed, options.sauceLabs, () => done(callback(failSites)));
    });

    afterEach(function (done) {
      suitePassed = suitePassed && this.currentTest.state === 'passed';
      if (fail > 8) driverService.quit(driver, suitePassed, options.sauceLabs, () => {
        consoleLog('CONSISTEN FAIL DETECT');
        driverService.init(options, (wd) => {
          driver = wd;
          fail = 0;
          done();
        });
      });
      else driverService.assure(driver, options, (wd) => {
        driver = wd;
        done();
      });
    });

    Object.keys(sites).forEach((key) => {
      const site = sites[key];

      describe(`FACET_SPEC: ${site.name}`, function () {
        let sitePassed = true;

        afterEach(function () {
          if (this.currentTest.state !== 'passed') {
            driver.takeScreenshot(driver, key);
            consoleLog(`FAILED TEST RECORDED: ${key}`);
            failSites[key] = site;
            fail++;
          }
          sitePassed = sitePassed && this.currentTest.state === 'passed';
        });

        it(`SEARCH: ${site.name} - Return At Least 1 Item`, () => {
          return driver.chain()
            .get(site.urls[options.env])
            .elementByCss('.search-focus', (err, search) => {
              if (err) throw err;
              search.flick(0, 0, 1, function flickCb(err) {
                if (err) throw err;
                driver.elementByCss('#search-text', 10000, (err, el) => {
                  el.sendKeys(wd.SPECIAL_KEYS.Return);
                });
              })
            })
            .sleep(1000)
            .waitForElementByCss('.item', 20000, (err, el) => {
              if (err) throw err;
              should.exist(el);
            })
            .title().should.eventually.include(site.keys.searchFound);
        });

        it(`FACET: ${site.name} - Filter Products`, () => {
          return driver.chain()
            .waitForElementByCss(".js-toggle-list-facets", 10000)
            .click()
            .waitForElementByCss("#facets-panel", 10000, (err, el) => {
              el.elementsByCss(".unit", function (err, unitOpts) {
                unitOpts[0].elementByCss('.facets-title').click((err) => {
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

