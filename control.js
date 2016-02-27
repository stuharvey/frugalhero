var TempControl = module.exports = {};

var EventSource = require('eventsource');
// This API will emit events from this URL.
var NEST_API_URL = 'https://developer-api.nest.com';

TempControl.start = function(token) {
  var source = new EventSource(NEST_API_URL + '?auth=' + token);

  source.addEventListener('put', function(e) {
    console.log('\n' + e.data);
  });

  source.addEventListener('open', function(e) {
    console.log('Connection opened!');
  });

  source.addEventListener('auth_revoked', function(e) {
    console.log('Authentication token was revoked.');
    // Re-authenticate your user here.
  });

  source.addEventListener('error', function(e) {
    if (e.readyState == EventSource.CLOSED) {
      console.error('Connection was closed! ', e);
    } else {
      console.error('An unknown error occurred: ', e);
    }
  }, false);
};
