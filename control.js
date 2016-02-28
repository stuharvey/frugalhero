var nest = require('unofficial-nest-api');
var log = require('debug-logger')('hacktheplanet');

var control = module.exports = {};

control.start = function(done) {
  var username = process.env.NEST_USERNAME;
  var password = process.env.NEST_PASSWORD;
  control.thermostat = {};

  nest.login(username, password, function(err, data) {
    if (err) {
      log.error(err.message);
      return;
    }

    log.info('Logged in to nest');

    nest.fetchStatus(function(data) {
      control.thermostat.id = nest.getDeviceIds()[0];
      log.info('Thermostat id: ' + control.thermostat.id);
      done();
    });
  });
}

control.setTemp = function(newTemp, done) {
  if (control.thermostat.id) {
    nest.setTemperature(control.thermostat.id, newTemp);
  }
  else if (done){
    done({message: 'Thermostat doesnt have an id yet'});
  }
}
