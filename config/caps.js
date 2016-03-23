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

device.s5 = {
    browserName: 'chrome',
    'appium-version': '1.4.13',
    platformName: 'ANDROID',
    platformVersion: '5.1',
    deviceName: '5f8b9b49',
    app: undefined
};

device.iIphone6Plus = {
    browserName: 'safari',
    'appium-version': '1.4.13',
    platformName: 'iOS',
    platformVersion: '9.2',
    deviceName: 'iPhone 6 Plus',
    app: undefined
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
    deviceName: 'iPhone 6s',
    app: undefined
};


module.exports = {
    device: device,
    simulator: simulator
};
