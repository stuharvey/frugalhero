
var fs = require('fs');
var request = require('superagent');
var http = require('http');
var express = require('express');

var port = process.env.PORT || 3000;
var CAPITALONE_KEY = fs.readFileSync('server_keys/capitalone_key');
var server = express();

server.get('/', get);

/**
 * Handle / gets
 * @param  {Object} req Get request
 * @param  {Object} res Response to send
 */
function get(req, res) {
  request
    .get('http://api.reimaginebanking.com/atms?key=' + CAPITALONE_KEY)
    .end(function(err, c1Response) {
      // console.log(res.status);
      console.log(c1Response.body); // Write capital one's response to console
      res.end(JSON.stringify(c1Response.body));
  });
}

http.createServer(server).listen(port);

console.log("Listening on port: " + port);
