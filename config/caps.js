var device = {},
    simulator = {};


//READ device
device.nexus5 = {
    browserName: 'chrome',
    'appium-version': '1.4.13',
    platformName: 'ANDROID',
    platformVersion: '5.1',
    deviceName: '097637cf2820fdb8',
    app: undefined
};

device.nexus5_wifi = {
    browserName: 'chrome',
    'appium-version': '1.4.13',
    platformName: 'ANDROID',
    platformVersion: '5.1',
    deviceName: '172.16.57.38',
    app: undefined
};

device.s5 = {
    browserName: 'chrome',
    'appium-version': '1.4.13',
    platformName: 'ANDROID',
    platformVersion: '5.1',
    deviceName: '5f8b9b49',
    app: undefined
};

device.s5_wifi = {
    browserName: 'chrome',
    'appium-version': '1.4.13',
    platformName: 'ANDROID',
    platformVersion: '5.1',
    deviceName: '5f8b9b49',
    app: undefined
};


device.mi_4i = {
    browserName: 'chrome',
    'appium-version': '1.4.13',
    platformName: 'ANDROID',
    platformVersion: '5.0.2',
    deviceName: 'b9cce42f',
    app: undefined
};

device.iIphone6Plus = {
    'appium-version': '1.4.13',
    platformName: 'iOS',
    platformVersion: '9.2',
    deviceName: 'iPhone 6 Plus',
    browserName: 'safari',
    //app: 'com.bytearc.SafariLaunchers',
    udid: '42a6b6cd093a321fad3f3ab691e58b235dce6ffe'
};

device.iPhone5C = {
    'appium-version': '1.4.13',
    platformName: 'iOS',
    platformVersion: '9.2',
    deviceName: 'iPhone 5C',
    browserName: 'safari',
    //app: 'com.bytearc.SafariLaunchers',
    udid: 'b55314dbda10b9ae6ab134a107558943fe3d64c2'
};

device.iPadMini3 = {
    'appium-version': '1.4.13',
    platformName: 'iOS',
    platformVersion: '9.2',
    deviceName: 'iPad Mini',
    browserName: 'safari',
    //app: 'com.bytearc.SafariLaunchers',
    udid: '3f89bf907326b1e97d7d452071b0bb209d6ca1f0'
};


//simulator
simulator.nexus6_Android19 = {
    browserName: 'chrome',
    'appium-version': '1.4.13',
    platformName: 'ANDROID',
    platformVersion: '5.1',
    deviceName: 'Android Simulator',
    app: undefined
};

simulator.iPhone5S_ios92 = {
    browserName: 'safari',
    'appium-version': '1.4.13',
    platformName: 'iOS',
    platformVersion: '9.2',
    deviceName: 'iPhone 5s',
    app: undefined
};

simulator.iPhone6S_ios92 = {
    browserName: 'safari',
    'appium-version': '1.4.13',
    platformName: 'iOS',
    platformVersion: '9.2',
    deviceName: 'iPhone 6s'
};


module.exports = {
    device: device,
    simulator: simulator
};
