'use strict';

var template = require('./template.html');
var Ractive = require('ractive');

/**
 * @constructor
 * @param {Element} container, HTML DOM element into which to render
 */
var AboutPanel = function (container) {
	this.initUi(container);
}


AboutPanel.prototype.initUi = function (container) {
	this.ractive = new Ractive({
	  el: container,
	  template: template,
	  data: { name: 'about !!!' }
	});
}

// expose for use in index.js
module.exports = AboutPanel;