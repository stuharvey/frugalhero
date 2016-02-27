var jsonfile = require('jsonfile');
var bodyParser = require('body-parser');
var log=require('debug-logger')('hacktheplanet');
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

var Client = require('node-rest-client').Client;
var client = new Client();
// Capital One Client
var c1UriBase = 'http://api.reimaginebanking.com';
var c1ApiKeyParam = '?key=' + CAPITALONE_KEY;

function c1CustLastUpdate(customerId){
}
function c1GetCustAccountNumbers(customerId){
  var numbers = [];
  client.methods.c1GetCustAccounts({}, /*callback*/ function(data, resp) {
    data.forEach(function(c){ numbers.push(c._id); });
  });
}
client.registerMethod('c1GetCustAccounts', c1UriBase + '/customers/${id}/accounts' + c1ApiKeyParam, 'GET');
client.registerMethod('c1GetMerchant', c1UriBase + '/merchants/${id}' + c1ApiKeyParam, 'GET');
function c1GetCustPurchases(customerId){
  var accounts = c1GetCustAccountNumbers(customerId);
  }
client.registerMethod('c1GetAccountPurchases', c1UriBase + '/accounts/${id}' + c1ApiKeyParam, 'GET');


http.createServer(server).listen(port);

console.log("Listening on port: " + port);
