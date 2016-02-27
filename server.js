
var fs = require('fs');
var request = require('superagent');
var http = require('http');

var CAPITALONE_KEY = fs.readFileSync('server_keys/capitalone_key');

request
  .get('http://api.reimaginebanking.com/atms?key=' + CAPITALONE_KEY)
  .end(function(err, res) {
    // console.log(res.status);
    console.log(err);
    console.log(res.body); //do something
});

var port = process.env.PORT || 1337;
http.createServer(function(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World\n');
}).listen(port);
