"use strict";

require("../helpers/setup");
const wd = require("wd");
const async = require('async');
const driverService = require('../services/driver-service');
const consoleLog = require('../helpers/console-log');

var iosProductVariations = function (options, sites, callback) {
  describe("THG_VARIATION_SUITE", function () {
    this.timeout(100000);
    let suitePassed = true;
    let driver;
    let fail = 0;
    let failSites = {};

    before(function (done) {
      options.desired.name = `THG_VARIATION_SUITE: ${options.os}`;
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

      describe(`PRODUCT_VARIATION_SPEC: ${site.name}`, function () {
        let sitePassed = true;

        afterEach(function () {
          if (this.currentTest.state != 'passed') {
            consoleLog(`FAILED TEST RECORDED: key`);
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
              search.flick(0, 0, 1, (err) => {
                if (err) throw err;
                driver.elementByCss('#search-text', 10000, (err, el) => {
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

        it(`VARIATIONS: ${site.name} - Add Product Variation to Basket`, () => {
          return driver.chain()
            .elementByCss('.item', (err, itemEl) => {
              itemEl.elementByCss('a').click();
            })
            .waitForElementByCss('.productoptions', 10000, (err, el) => {
              el.elementsByCss('form', function elCb(err, forms) {
                async.forEachOfSeries(forms, (form, key, callback) => {
                  form.elementsByCss('option', (err, options) => {
                    if (options.length > 1) {
                      options[1].click();
                    } else {
                      options[0].click();
                    }
                    callback(err);
                  });
                }, (err) => {
                  if (err) throw err;
                  driver.elementByCss('.buy-button').click();
                });
              })
            })
            .sleep(1000)
            .waitForElementByCss('.btn-ajax-basket', 10000);
        });
      });
    });
  });
};

module.exports = iosProductVariations;
