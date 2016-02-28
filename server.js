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
server.put('/config/', storeConfig);



//Habitca One Client
var hUriBase = 'https://habitica.com/api/v2';
// var hApiKeyParam = '?key=' + CAPITALONE_KEY;

// var args = {
//     headers: { "x-api-user": "12b4ded4-e395-487c-af66-26344864be9b", "x-api-key": "bf00bb1a-1c1f-4751-932b-7b32bc2075dc",
//     "Content-Type":"application/json" },
//     data: {
//     }
// };


function getConfig(req, res) {
  var config = fs.readFileSync(req.params.uid+'.json', 'utf8');
  if (config === null) res.status(404).end();
  res.json(config);
}
function storeConfig(req, res) {

  try {
    log.trace('store body: ' + req.body);
    jsonfile.writeFileSync(req.body.uid+'.json', req.body);

    if(req.body.loaded == 'no'){
      var apiuser = req.body.uid;
      var apikey = req.body.hApiKey;

      var cAccountID = req.body.cAccID;

      var toPost = [];
      //ATMFees
      var atm = req.body.ATMFees;
      var atmJSON = JSON.parse(atm);

      if(atmJSON.enabled == true){
        toPost.push({text: "ATM Fees", id: "atmFees", type: "habit", notes: "avoid ATM Fees"});
      }

      // var EatAtHome = req.body.EatAtHome;
      // var eatJSON = JSON.parse(EatAtHome);
      //
      // if(eatJSON.enabled == true){
      //   toPost.push({text: "Eat out less", id: "eatAtHome", type: "habit", notes: "Spend less money by eating at home instead of going out"});
      // }
      //
      // var bills = req.body.Bills;
      // var billJSON = JSON.parse(bills);
      //
      // if(billJSON.enabled == true){
      //   toPost.push({text: "Pay bills on time", id: "bills", type: "daily",  "frequency": "monthly", notes: "Pay your bills on your time"});
      // }
      //
      // var liquor = req.body.Liquor;
      // var liquorJSON = JSON.parse(liquor);
      //
      // if(liquorJSON.enabled == true){
      //   toPost.push({text: "Buy your alcohol at the grocery store", id: "liquor", type: "habit", notes: "Don't always go out to bars"});
      // }
      //
      // var spendSave = req.body.spendSave;
      // var spendSaveJSON = JSON.parse(spendSave);
      //
      // if(spendSaveJSON.enabled == true){
      //
      //   var rate = spendSave.rate;
      //
      //   toPost.push({text: "Buy your alcohol at the grocery store", type: "daily",  "frequency": "weekly", id: "spendSave", notes: "Spend" + rate + "% of your money"});
      // }

      for (var i = 0; i < toPost.length; i++) {
        var args = {
          headers: {"x-api-key": "12b4ded4-e395-487c-af66-26344864be9b", "x-api-key": "bf00bb1a-1c1f-4751-932b-7b32bc2075dc", "Content-Type":"application/json"},
          data: toPost[i]
        };
        client.post(hUriBase + "/user/tasks/", args, function (data, response) {
          log.debug(data);
          log.debug("now printing response")
          log.debug(response);

        });
      }

    }

  } catch (e) {
    log.error('store failed: ' + e);
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



var port = process.env.PORT || 3000;
var http = require('http');
http.createServer(server).listen(port);

if (process.env.RUN_WITH_NEST) {
  tempControl.start(function () {
    tempControl.setTemp(Math.random()*30 + 54);
  });
}

log.info("Listening on port: " + port);
