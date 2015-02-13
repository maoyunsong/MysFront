'use strict';

var template = require('./template.html');
var Ractive = require('ractive');


/**
 * @constructor
 * @param {Element} container, HTML DOM element into which to render
 */
var HomePanel = function (container) {
	this.initUi(container);
}


HomePanel.prototype.initUi = function (container) {
	this.ractive = new Ractive({
	  el: container,
	  template: template,
	  data: { name: 'home !!!' }
	});
}

// expose for use in index.js
module.exports = HomePanel;