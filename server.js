
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

server.get('/config/:uid', getConfig);
server.put('/config/:uid', storeConfig);

function getConfig(req, res) {
}
function storeConfig(req, res) {
}

http.createServer(server).listen(port);
app.use(express.static('public'));

console.log("Listening on port: " + port);
