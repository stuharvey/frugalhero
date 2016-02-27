
var fs = require('fs');
var request = require('superagent');

var CAPITALONE_KEY = fs.readFileSync('server_keys/capitalone_key');

request
  .get('http://api.reimaginebanking.com/atms?key=' + CAPITALONE_KEY)
  .end(function(err, res) {
    // console.log(res.status);
    console.log(err);
    console.log(res.body); //do something
});
