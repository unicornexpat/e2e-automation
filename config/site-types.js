const sites = require('./sites');

var siteTypes = {};

siteTypes.main = ['myProtein', 'lookFantastic', 'theHut', 'zavi'];

siteTypes.unknown = {
  name: 'unknown',
  type: 0,
  sites: []
};

siteTypes.beauty = {
  name: 'beauty',
  type: 1,
  sites: [
    sites.beautyExpert,
    sites.hqHair,
    sites.lookFantastic,
    sites.manKind,
    sites.mio,
    sites.mious,
  ]
};

siteTypes.brand = {
  name: 'brand',
  type: 2,
  sites: [
    sites.allSole,
    sites.coggles,
    sites.theHut,
    sites.iwoot,
    sites.myBag,
    sites.myGeekBox
  ]
};

siteTypes.cycling = {
  name: 'cycling',
  type: 3,
  sites: [
    sites.proBikeKit
  ]
};

siteTypes.diet = {
  name: 'diet',
  type: 4,
  sites: [
    sites.exanteDiet,
  ]
};

siteTypes.healthWellBeing = {
  name: 'healthWellBeing',
  type: 5,
  sites: [
    sites.massFi,
    sites.myProtein,
    sites.myVitamins,
    sites.powerMan
  ]
};

siteTypes.thirdParty = {
  name: 'thirdParty',
  type: 6,
  sites: [
    sites.zavvi,
    sites.nintendo
  ]
};

module.exports = siteTypes;