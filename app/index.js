// page load intro
var Vivus = require('../node_modules/vivus');
require('./header.scss');

var logoElement = document.getElementById("svg-logo");

new Vivus('svg-logo', {duration: 200, animTimingFunction: Vivus.EASE}, setupNav);

function setupNav() {
    logoElement.setAttribute("class", "svg-logo small");
}