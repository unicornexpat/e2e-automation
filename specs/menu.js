"use strict";
require("../helpers/setup");
var wd = require("wd"),
    async = require('async'),
    driverInit = require('../services/driver-init');

var menu = function (options, sites, done) {
    var failSites = {};
    describe("THG_MENU_SUITE", function () {
        this.timeout(100000);
        var masterPassed = true,
            driver,
            flickSpeed = 1;

        before(function () {
            if (options.os == 'iOS') flickSpeed = 0;
            options.desired.name = 'THG_MENU_SUITE: ' + options.os;
            driver = driverInit(options);
        });

        after(function () {
            return driver
                .quit()
                .finally(function () {
                    if (options.sauceLabs) {
                        return driver.sauceJobStatus(masterPassed, function(err){
                            done(failSites);
                        });
                    }
                    done(failSites);
                });
        });

        afterEach(function () {
            masterPassed = masterPassed && this.currentTest.state === 'passed';
        });

        Object.keys(sites).forEach(function (key) {
            var site = sites[key];
            describe('MENU_SPEC: ' + site.name, function () {
                var allPassed = true;
                before(function () {
                    driver.status(function (err, status) {
                        if ((status.isShuttingDown != false && options.sauceLabs != true && options.os == 'iOS') || (status.details.status != 'available' && options.sauceLabs == true)) {
                            console.log('++++++++++++++++++++++++++++++++++++');
                            console.log('INITIATING A NEW SESSION');
                            console.log('++++++++++++++++++++++++++++++++++++');
                            driver.quit();
                            driver = driverInit(options);
                        }
                    });
                });

                afterEach(function () {
                    if(this.currentTest.state !='passed'){
                        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
                        console.log('FAILED TEST RECORDED: ' + key);
                        console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
                        failSites[key] = site;
                    }
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