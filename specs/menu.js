"use strict";

require("../helpers/setup");
const wd = require("wd");
const async = require('async');
const driverService = require('../services/driver-service');
const consoleLog = require('../helpers/console-log');

const menu = (options, sites, callback) => {
  describe('THG_MENU_SUITE', function () {
    this.timeout(100000);
    let suitePassed = true;
    let driver;
    let fail = 0;
    let failSites = {};

    before(function (done) {
      options.desired.name = `THG_MENU_SUITE: ${options.os}`;
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
        driverService.init(options, function (wd) {
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
      describe(`MENU_SPEC: ${site.name}`, function () {
        var sitePassed = true;

        afterEach(function () {
          if (this.currentTest.state !== 'passed') {
            driverService.takeScreenshot(driver, key);
            consoleLog(`FAILED TEST RECORDED: + ${key}`);
            fail++;
            failSites[key] = site;
          }
          sitePassed = sitePassed && this.currentTest.state === 'passed';
        });

        it(`MENU: ${site.name} - Open and Close Menu`, () => {
          return driver.chain()
            .get(site.urls[options.env])
            .elementByCss('.header-menu-icon').flick(0, 0, 1)
            .waitForElementByCss('.slide-out-navigation', 5000, (err, el) => {
              if (err) throw err;
              should.exist(el);
            })
            .elementByCss('.header-menu-icon')
            .sleep(1000)
            .flick(0, 0, 1)
            .sleep(1000)
            .flick(0, 0, 1)
            .elementByCss('.account-list-item', (err, el) => {
              el.elementByCss('a').click();
            })
            .waitForElementByCss('.login-existing-user-wrapper', 10000)
            .title().should.eventually.include(site.keys.logIn);
        });
      });
    });
  });
};

module.exports = menu;