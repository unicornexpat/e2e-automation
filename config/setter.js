
var setter = function(config){
    this.config = config;
};

setter.prototype = {
    setEnvironment: function(env) {
        this.config.environement = env;
        return this;
    },

    useSauceLabs: function(){
        this.config.useSauceLabs = true;
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
        return this;
    }
};


module.exports = setter;