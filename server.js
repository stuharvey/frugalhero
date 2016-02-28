"use strict";
var log=require('debug-logger')('hacktheplanet');

var fs = require('fs');
var CAPITALONE_KEY = fs.readFileSync('server_keys/capitalone_key', 'utf8');

var tempControl = require('./control.js');

log.debug('capital one api key: ' + CAPITALONE_KEY);

var express = require('express');
var server = express();

server.use(express.static('public'));
var bodyParser = require('body-parser');
server.use(bodyParser.json());

var jsonfile = require('jsonfile');

server.get('/config/:uid', getConfig);
server.put('/config', storeConfig);


function getConfig(req, res) {
  var config = fs.readFileSync(req.params.uid+'.json', 'utf8');
  if (config === null) res.status(404).end();
  res.json(config);
}
function storeConfig(req, res) {
  try {
    log.trace('store body: ' + req.body);
    jsonfile.writeFileSync(req.body.uid+'.json', req.body);
  } catch (e) {
    log.error('store failed: ' + e);
    res.status(500).end();
  }
  res.status(200).end();
}

// Capital One Client
var c1UriBase = 'http://api.reimaginebanking.com';
//var c1UriHost = 'api.reimaginebanking.com';
var c1ApiKeyParam = '?key=' + CAPITALONE_KEY;

var req = require('sync-request');
function c1GetAllAccounts(){
  return JSON.parse(req('GET', c1UriBase + '/accounts' + c1ApiKeyParam).
      getBody());
}
function c1GetCustomersAccounts(customerId){
  return JSON.parse(req('GET', c1UriBase + '/customers/' + customerId +
      '/accounts' + c1ApiKeyParam).getBody());
}
function c1GetCustAccountIds(customerId){
  return c1GetCustomersAccounts(customerId).map(function(x){
    return x._id;
  });
}
function c1GetAccountPurchases(accountId){
  return JSON.parse(req('GET', c1UriBase + '/accounts/' + accountId +
    '/purchases' + c1ApiKeyParam).getBody());
}
function c1GetCustPurchases(customerId){
  var purchases = [];
  c1GetCustAccountIds(customerId).forEach(function(each){
    c1GetAccountPurchases(each).forEach(function(each){
      purchases.push(each);
    });
  });
  return purchases;
}

// //Habitica One Client
// var hUriBase = 'https://habitica.com/api/v2';
//
// var args = {
//     data: { x-api-user: "12b4ded4-e395-487c-af66-26344864be9b" , x-api-key: "bf00bb1a-1c1f-4751-932b-7b32bc2075dc" },
//     headers: { "Content-Type": "application/json" }
// };
//
// client.post(hUriBase + "/", args, function (data, response) {
//     // parsed response body as js object
//     console.log(data);
//     // raw response
//     console.log(response);
// });

var port = process.env.PORT || 3000;
var http = require('http');
http.createServer(server).listen(port);

if (process.env.RUN_WITH_NEST) {
  tempControl.start(function () {
    tempControl.setTemp(Math.random()*30 + 54);
  });
}

log.info("Listening on port: " + port);
