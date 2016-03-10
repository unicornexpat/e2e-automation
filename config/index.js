

var index = {
    debug: false,
    takeScreenShots:true,
    useSauceLabs: false,
    environments: require('./environments'),
    serverBlocks: require('./server-blocks'),
    sites: require('./sites'),
    specs: require('../specs/index'),
    defaultCapabilities: {
        browserName: 'firefox',
    },
    caps: require('./caps'),
    sauceLabs: require('./sauce-labs')
};

module.exports = index;
