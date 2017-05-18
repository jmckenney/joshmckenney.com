// page load intro
var Vivus = require('../node_modules/vivus');
require('./global.scss');
require('./header.scss');
require('./footer.scss');

var logoElement = document.getElementById("svg-logo");

new Vivus('svg-logo', {duration: 200, animTimingFunction: Vivus.EASE}, setupNav);

function setupNav() {
    //svgs have sticky element handling in js:(
    logoElement.setAttribute("class", "svg-logo small");
    document.body.classList.add("loaded");
}