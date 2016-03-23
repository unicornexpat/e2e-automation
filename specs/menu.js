"use strict";
require("../helpers/setup");
var wd = require("wd"),
    async = require('async'),
    driverInit = require('../services/driver-init');

var menu = function (options, sites) {
    describe("THG_MENU_SUITE", function () {
        this.timeout(100000);
        var masterPassed = true,
            driver;

        before(function () {
            options.desired.name = 'THG_MENU_SUITE: ' + options.os;
            driver = driverInit(options);
        });

        after(function () {
            return driver
                .quit()
                .finally(function () {
                    if (options.sauceLabs) {
                        return driver.sauceJobStatus(masterPassed);
                    }
                });
        });

        afterEach(function () {
            masterPassed = masterPassed && this.currentTest.state === 'passed';
        });

        Object.keys(sites).forEach(function(key) {
            var site = sites[key];
            describe('MENU_SPEC: ' + site.name, function () {
                var allPassed = true;

                before(function () {
                    driver.status(function (err, status) {
                        if ((status.isShuttingDown != false && options.sauceLabs != true && options.os == 'iOS') || (status.details.status != 'available' && options.sauceLabs == true)) {
                            console.log('IMITATING A NEW SESSION');
                            driver.quit();
                            driver = driverInit(options);
                        }
                    });
                });

                afterEach(function () {
                    allPassed = allPassed && this.currentTest.state === 'passed';
                });

                it("MENU: " + site.name + " - Open and Close Menu", function () {
                    return driver.chain()
                        .get(site.urls[options.env])
                        .elementByCss('.header-menu-icon').flick(0, 0, 1)
                        .waitForElementByCss('.slide-out-navigation', 5000, function (err, el) {
                            if (err) throw err;
                            should.exist(el);
                        })
                        .elementByCss('.header-menu-icon')
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