
var setter = function(config){
    this.config = config;
};

setter.prototype = {
    setEnv: function(env) {
        this.config.env = env;
        return this;
    },

    useSauceLabs: function(){
        this.config.sauceLabs = true;
        return this;
    },

    removeSpec: function(specName){
        delete this.config.specs[specName];
        return this;
    },

    removeSite: function(siteName){
        delete this.config.sites[siteName];
        return this;
    },

    setTarget: function(target){
        this.config.desired = target;
        this.config.serverConfig = require('./appium-servers').sauce.server1;
        return this;
    },

    runOnlySpec: function(specName){
        var that = this;
;       Object.keys(this.config.specs).forEach(function(key) {
            if (key != specName) {
               delete that.config.specs[key];
            }
        });
        return this
    },

    runOnlySite: function(siteName){
        var that = this;
        Object.keys(this.config.sites).forEach(function(key) {
            if (key != siteName) {
                delete that.config.sites[key];
            }
        });
        return this
    }
};


module.exports = setter;