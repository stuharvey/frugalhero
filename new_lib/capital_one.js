var request = require('superagent');

var Config = (function() {
  function Config() { }
  Config.baseUrl = "http://api.reimaginebanking.com:80";

  Config.getApiKey = function() {
    return this.apiKey;
  };

  Config.setApiKey = function(key) {
    this.apiKey = key;
  };

  Config.request = request;

  return Config;
})();

module.exports = Config;
