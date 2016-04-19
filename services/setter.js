const servers = require('../config/appium-servers');
const caps = require('../config/caps');

var setter = function(config) {
  this.config = config;
};

setter.prototype = {
  setHost: function (host) {
    this.config.serverConfig = host;
    return this;
  },

  setEnv: function (env) {
    this.config.env = env;
    return this;
  },

  setOs: function (os) {
    this.config.os = os;
    this.config.desired = caps.device.nexus5;
    this.config.serverConfig = servers.local.host2;
    return this;
  },

  useSauceLabs: function () {
    this.config.sauceLabs = true;
    this.config.serverConfig = servers.sauce.server1;
    return this;
  },

  sauceConnect: function (boolean) {
    this.config.sauceConnect = boolean;
    return this;
  },

  removeSpec: function (specName) {
    delete this.config.specs[specName];
    return this;
  },

  removeSite: function (siteName) {
    delete this.config.sites[siteName];
    return this;
  },

  setTarget: function (target) {
    this.config.desired = target;
    return this;
  },

  runOnlySpec: function (specName) {
    var that = this;
    for (var key in this.config.specs) {
      if (key != specName) {
        delete that.config.specs[key];
      }
    }
    return this
  },

  runOnlySite: function (siteName) {
    var that = this;
    for (var key in this.config.sites) {
      if (key != siteName) {
        delete that.config.sites[key];
      }
    }
    return this
  },

  runSites: function (sites) {
    var that = this;
    for (var key in this.config.sites) {
      if (sites.indexOf(key) == -1) {
        delete that.config.sites[key];
      }
    }
    return this
  },

  excludeSites: function (sites) {
    var that = this;
    for (var key in this.config.sites) {
      if (sites.indexOf(key) != -1) {
        delete that.config.sites[key];
      }
    }
    return this
  }
};


module.exports = setter;