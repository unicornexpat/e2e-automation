"use strict";
require("../helpers/setup");
var wd = require("wd"),
    async = require('async'),
    driverService = require('../services/driver-service'),
    consoleLog = require('../helpers/console-log');

var menu = function (options, sites, callback) {
    describe("THG_MENU_SUITE", function () {
        this.timeout(100000);
        var suitePassed = true,
            driver,
            fail = 0,
            failSites = {};

        before(function (done) {
            options.desired.name = 'THG_MENU_SUITE: ' + options.os;
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
            if (fail > 8) driverService.quit(driver, suitePassed, options.sauceLabs, function () {
                driverService.init(options, function (wd) {
                    driver = wd;
                    fail = 0;
                    done();
                });
            });
            else driverService.assure(driver, options, function (wd) {
                driver = wd;
                done();
            });
        });

        Object.keys(sites).forEach(function (key) {
            var site = sites[key];
            describe('MENU_SPEC: ' + site.name, function () {
                var sitePassed = true;

                afterEach(function () {
                    if (this.currentTest.state != 'passed') {
                        consoleLog('FAILED TEST RECORDED: ' + key);
                        fail++;
                        failSites[key] = site;
                    }
                    sitePassed = sitePassed && this.currentTest.state === 'passed';
                });

                it("MENU: " + site.name + " Open and Close Menu", function () {
                    return driver.chain()
                        .get(site.urls[options.env])
                        .elementByCss('.header-menu-icon').flick(0, 0, 1)
                        .waitForElementByCss('.slide-out-navigation', 5000, function (err, el) {
                            if (err) throw err;
                            should.exist(el);
                        })
                        .elementByCss('.header-menu-icon')
                        .sleep(1000)
                        .flick(0, 0, 1)
                        .sleep(1000)
                        .flick(0, 0, 1)
                        .elementByCss('.account-list-item', function (err, el) {
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