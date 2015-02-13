'use strict';

var Controller = require('./controller');

/**
 * Main application, entry point of the app
 * @param {Object} config json object from /config.json
 * @constructor
 */
var App = function () {
    /**
     * @type {Controller}
     */
    this.controller = new Controller();

};

// expose for use in index.js
module.exports = App;