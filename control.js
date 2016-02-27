var TempControl = module.exports = {};

var EventSource = require('eventsource');
var log = require('debug-logger')('hacktheplanet');

// This API will emit events from this URL.
var NEST_API_URL = 'https://developer-api.nest.com';

var thermostat = {},
    structure = {};

TempControl.start = function(token) {
  var source = new EventSource(NEST_API_URL + '?auth=' + token);

  source.addEventListener('put', onDataFromNest);

  source.addEventListener('open', function(e) {
    log.info('Connection opened!');
  });

  source.addEventListener('auth_revoked', function(e) {
    log.info('Authentication token was revoked.');
    // Re-authenticate your user here.
  });

  source.addEventListener('error', function(e) {
    if (e.readyState == EventSource.CLOSED) {
      log.error('Connection was closed! ', e);
    } else {
      log.error('An unknown error occurred: ', e);
    }
  }, false);
};

function onDataFromNest(snapshot) {
  var data = JSON.parse(snapshot.data).data;
  structure  = firstChild(data.structures);
  thermostat = data.devices.thermostats[structure.thermostats[0]];
  log.info('Got an update from the thermometer, new target temperature is ',
    thermostat.target_temperature_f);
}

/**
  Utility method to return the first child
  value of the passed in object.

  @method
  @param object
  @returns object
*/
function firstChild(object) {
  for(var key in object) {
    return object[key];
  }
}
