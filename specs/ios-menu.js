"use strict";
require("../helpers/setup");
var wd = require("wd");


var iosMenu = function (options, site) {

    describe("THG_IOS_MENU: " + site.name, function () {
        this.timeout(100000);
        var allPassed = true,
            driver,
            desired = options.desired,
            tries_threshold = 2,
            siteUrl = site.urls[options.env];

        before(function () {
            driver = wd.promiseChainRemote(options.serverConfig);
            require("../helpers/logging").configure(driver);
            desired.name = 'iOS - Menu: ' + site.name;
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

        function menu() {

        }

        it("MENU_SPEC: " + site.name + " - Open and Close Menu", function () {
                return driver.chain()
                    .get(siteUrl)
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
                    .title().should.eventually.include(site.keys.logIn);
            }
        )
        ;
    });
};

module.exports = iosMenu;