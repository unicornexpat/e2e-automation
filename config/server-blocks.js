var sites = require("./sites");

var serverBlocks = {};

serverBlocks.A = {
    name: 'A',
    type: 1,
    sites: [
        sites.lookFantastic,
        sites.hqHair,
        sites.beautyExpert,
        sites.mio,
        sites.mious
    ]
};

serverBlocks.B = {
    name: 'B',
    type: 2,
    sites:[
        sites.iwoot,
        sites.proBikeKit,
        sites.elizabethArden,
        sites.massFi,
        sites.myGeekBox
    ]
};

serverBlock.C = {
    name: 'C',
    type: 3,
    sites: [
        sites.coggles,
        sites.myBag,
        sites.allSole,
        sites.exanteDiet,
        sites.myVitamins
    ]
}

serverBlocks.D = {
    name: 'D',
    type: 4,
    sites: [
        sites.myProtein,
        sites.powerMan
    ]
};

serverBlocks.E = {
    name: 'E',
    type: 5,
    sites: [
        sites.theHut,
        sites.zavvi
    ]
};

serverBlocks.N = {
    name: 'N',
    type: 6,
    sites: [
        sites.nintendo
    ]
}

serverBlocks.R = {
    name: 'R',
    type: 7,
    sites: [
        sites.nectar
    ]
}


module.exports = serverBlocks;