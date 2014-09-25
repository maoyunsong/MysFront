var log = require('./utils/log');

log.info('test for log info');
log.error('test for log error');

var App = require('./app');

new App();