"use strict";
require("../helpers/setup");
var wd = require("wd");


var iosMenu = function (options, site) {

    describe("==================== THG_IOS_MENU: " + site.name + " ====================", function () {
        this.timeout(100000);
        var allPassed = true;
        var driver;
        var desired = options.desired;
        var tries_threshold = 2;

        before(function () {
            driver = wd.promiseChainRemote(options.serverConfig);
            require("../helpers/logging").configure(driver);
            desired.name = 'iOS - Menu: ' + site.name;
            return driver.init(desired);
        });

        after(function () {
            console.log('After')
            return driver
                .quit()
                .finally(function () {
                    if (process.env.SAUCE) {
                        return driver.sauceJobStatus(allPassed);
                    }
                });
        });

        afterEach(function () {
            console.log('afterEach');
            allPassed = allPassed && this.currentTest.state === 'passed';
        });

        function menu() {

        }

        it("MENU_SPEC: " + site.name + " - Open and Close Menu", function (done) {
                var tries = 0;

                function actualMenuTest(next) {
                    driver.chain()
                        .get(site.urls.live)
                        .elementByCss('.header-menu-icon').flick(0, 0, 0)
                        .waitForElementByCss('.slide-out-navigation', 20000, function (err, el) {
                            if (err) throw err;
                            should.exist(el);
                        })
                        .elementByCss('.header-menu-icon')
                        .flick(0, 0, 0)
                        .flick(0, 0, 0)
                        .elementByCss('.account-list-item', function (err, el) {
                            el.elementByCss('a').click();
                        })
                        .waitForElementByCss('.login-existing-user-wrapper', 20000)
                        .title(function (err, title) {
                            if (title.indexOf(site.keys.logIn) == -1) {
                                return next('Title not match');
                            }
                            return next(err);
                        })

                }

                function menuTest() {
                    try {
                        actualMenuTest(function (err) {
                            if (err && tries++ < tries_threshold) {
                                menuTest();
                            }
                            else {
                                return done(err);
                            }
                        });
                    } catch (err) {
                        if (err && tries++ < tries_threshold)
                            menuTest();
                        else return done(err);
                    }
                }

                menuTest();

            }
        )
        ;
    });
};

module.exports = iosMenu;