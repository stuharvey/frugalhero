var Habitica = require('habitica');
var log = require('debug-logger')('hacktheplanet');

var habitica = module.exports = {};


habitica.init = function() {
  // Make sure we have habitica keys
  if (process.env.HABITICA_ID && process.env.HABITICA_TOKEN) {
    habitica.api = new Habitica({
      uuid: process.env.HABITICA_ID,
      token: process.env.HABITICA_TOKEN
    });
    log.debug('')
  }
  else
    log.error('You must have HABITICA_ID and HABITICA_TOKEN in your env');
};

/**
 * Add a task to your habitica account
 * @param {Object} task The task to add of the form
 */
habitica.addTasks = function(tasks, callback) {
  if (!habitica.api) {
    log.error('You tried to do a bad thing and you should feel bad');
    return;
  }

  function add(task, i) {
    habitica.api.task
      .post(task)
      .then(function(response) {
        log.debug('Task add response: ', response);
        i++;
        if (i < tasks.length) add(tasks[i], i);
      });
  }

  add(tasks[0], 0);
}
