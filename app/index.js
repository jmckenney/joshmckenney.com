var Vivus = require('../node_modules/vivus');
require('./header.scss');

console.log('starting');
new Vivus('svg-logo', {duration: 200, animTimingFunction: Vivus.EASE}, setupNav);

function setupNav() {
    console.log('moving logo to menu');
}