var fs = require('fs');
var request = require('superagent');
var http = require('http');
var express = require('express');
var path = require('path');
var port = process.env.PORT || 3000;
var CAPITALONE_KEY = fs.readFileSync('server_keys/capitalone_key');
var server = express();

server.use(express.static('public'));

server.get('/config/:uid', getConfig);
server.put('/config/:uid', storeConfig);

function getConfig(req, res) {
}
function storeConfig(req, res) {
}

http.createServer(server).listen(port);

console.log("Listening on port: " + port);
