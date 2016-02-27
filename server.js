var jsonfile = require('jsonfile');
var bodyParser = require('body-parser');
var fs = require('fs');
var http = require('http');
var express = require('express');
var port = process.env.PORT || 3000;
var CAPITALONE_KEY = fs.readFileSync('server_keys/capitalone_key', 'utf8');
console.log(CAPITALONE_KEY);
var server = express();

server.use(express.static('public'));
server.use(bodyParser.json());

server.get('/config/:uid', getConfig);
server.put('/config', storeConfig);

function getConfig(req, res) {
  var config = fs.readFileSync(req.params.uid+'.json', 'utf8');
  if (config === null) res.status(404).end();
  res.json(config);
}
function storeConfig(req, res) {
  try {
    console.log(req.body);
    jsonfile.writeFileSync(req.body.uid+'.json', req.body);
  } catch (e) {
    console.log(e);
    res.status(500).end();
  }
  res.status(200).end();
}

http.createServer(server).listen(port);

console.log("Listening on port: " + port);
