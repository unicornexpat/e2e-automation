"use strict";

require("../helpers/setup");
const wd = require("wd");
const async = require('async');
const driverService = require('../services/driver-service');
const consoleLog = require('../helpers/console-log');

const iosPagination = (options, sites, callback) => {
  describe('THG_PAGINATION_SUITE', function () {
    this.timeout(100000);
    let suitePassed = true;
    let driver;
    let fail = 0;
    let failSites = {};

    before(function (done) {
      options.desired.name = `THG_PAGINATION_SUITE: ${options.os}`;
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
      if (fail > 10) driverService.quit(driver, suitePassed, options.sauceLabs, () => {
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
      var site = sites[key];

      describe(`PAGINATION_SPEC: ${site.name}`, function () {
        var sitePassed = true;

        afterEach(function () {
          if (this.currentTest.state !== 'passed') {
            consoleLog(`FAILED TEST RECORDED: ${key}`);
            failSites[key] = site;
            fail++;
            driverService.takeScreenshot(driver, key);
          }
          sitePassed = sitePassed && this.currentTest.state === 'passed';
          done();
        });

        it(`SEARCH: ${site.name} - Return At Least 1 Item`, () => {
          return driver.chain()
            .get(site.urls[options.env])
            .elementByCss('.search-focus', (err, search) => {
              if (err) throw err;
              search.flick(0, 0, 1, (err) => {
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

        it(`PAGINATION: ${site.name} - Next Page`, () => {
          return driver.chain()
            .elementByCssIfExists('.btn-next', (err, btnEl) => {
              btnEl.elementByCss('a', (err, btnA) => {
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