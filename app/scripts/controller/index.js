'use strict';

var log = require('../utils/log');
var page = require('page');

var HomePanel = require('../home');
var AboutPanel = require('../about');
var ContactPanel = require('../contact');

var Controller = function () {
	// start the app
    this.startApp();
}

Controller.prototype.startApp = function () {
	log.info('app is stating');
	page('/', this.index);
    page('/about', this.about);
    page('/contact', this.contact);
    page();
};

Controller.prototype.index = function(ctx) {
	log.info(ctx);
	this.homePanel = new HomePanel(document.querySelector('.home-panel-container'));
}

Controller.prototype.about = function(ctx) {
	log.info(ctx);
	this.aboutPanel = new AboutPanel(document.querySelector('.about-panel-container'));
}

Controller.prototype.contact = function(ctx) {
	log.info(ctx);
	this.contactPanel = new ContactPanel(document.querySelector('.contact-panel-container'));
}

// expose for use in index.js
module.exports = Controller;
