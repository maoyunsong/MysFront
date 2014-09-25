var log = require('./utils/log');

log.info('test for log info');
log.error('test for log error');

var App = require('./app');

new App();

//test Ractive
var Ractive = require('ractive');

var ractive = new Ractive({
  el: document.getElementById('results'),
  template: "{{greeting}} {{name}}",
  data: { greeting: 'Hello', name: 'world !!!' }
});


