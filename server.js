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

// ----------- HABITICA STUFF ------------
server.get('/config/:uid', getConfig);
server.put('/config/', storeConfig);



//Habitca One Client
var hUriBase = 'https://habitica.com/api/v2';
// var hApiKeyParam = '?key=' + CAPITALONE_KEY;

var args = {
  headers: { "x-api-user": "12b4ded4-e395-487c-af66-26344864be9b",
     "x-api-key": "bf00bb1a-1c1f-4751-932b-7b32bc2075dc",
     "Content-Type":"application/json" },
  data: {
  }
};

function getConfig(req, res) {
  var config = fs.readFileSync(req.params.uid+'.json', 'utf8');
  if (config === null) res.status(404).end();
  res.json(config);
}
function storeConfig(req, res) {
  try {
    log.trace('store body: ' + req.body);
    jsonfile.writeFileSync(req.body.uid+'.json', req.body);
    var body = req.body;
  } catch (e) {
    log.error('store failed: ' + e);
    res.status(500).end();
  }
  res.status(200).send();
  integrate(body);
}

function integrate(body){
  if(body.loaded === 'no'){
    var client = require('node-rest-client');
    log.debug("hi i'm in here")
    var apiuser = body.uid;
    var apikey = body.hApiKey;

    var cAccountID = body.cAccID;

    var toPost = [];
      //ATMFees
    var atm = body.ATMFees;
    log.debug(atm);
      // var atmJSON = JSON.parse(atm);

    if(atm.enabled === true){
      var text = ({text: "ATM Fees", id: "atmFees", type: "habit", notes:
        "avoid ATM Fees"});
      args.data= text;
      client.post(hUriBase + "/user/tasks/", args, function (data, response) {
        log.debug(data);
        log.debug("now printing response")
        log.debug(response.statusCode);

      });
    }

    var EatAtHome = body.EatAtHome;

    if(EatAtHome.enabled === true){
      text = ({text: "Eat out less", id: "eatAtHome", type: "habit", notes:
        "Spend less money by eating at home instead of going out"});


      args.data= text;
      client.post(hUriBase + "/user/tasks/", args, function (data, response) {
        log.debug(data);
        log.debug("now printing response")
        log.debug(response.statusCode);

      });
    }

    var bills = body.Bills;
    log.debug(bills);

    if(bills.enabled === false){
      text = ({text: "Pay bills on time", id: "bills", type: "daily"});

      args.data= text;
      client.post(hUriBase + "/user/tasks/", args, function (data, response) {
        log.debug(data);
        log.debug("now printing response")
        log.debug(response.statusCode);

      });
    }


    var liquor = body.Liquor;

    if(liquor.enabled === true){
      text = ({text: "Buy your alcohol at the grocery store", id: "liquor",
        type: "habit", notes: "Don't always go out to bars"});

      args.data= text;
      client.post(hUriBase + "/user/tasks/", args, function (data, response) {
        log.debug(data);
        log.debug("now printing response")
        log.debug(response.statusCode);

      });
    }


      // var spendSave = body.spendSave;
      //
      // if(spendSave.enabled == true){
      //
      //   var rate = spendSave.rate;
      //
      //   toPost.push({text: "Buy your alcohol at the grocery store",
      //   type: "daily",  "frequency": "weekly", id: "spendSave",
      //   notes: "Spend" + rate + "% of your money"});
      // }

      // log.debug(" outhere");
      // log.debug(bills.enabled);
      // for (var i = 0; i < toPost.length; i++) {
      //   log.debug("here");
      //   var args = {
      //     headers: {"x-api-user": "12b4ded4-e395-487c-af66-26344864be9b",
      //     "x-api-key": "bf00bb1a-1c1f-4751-932b-7b32bc2075dc",
      //     "Content-Type":"application/json"},
      //     data: toPost[i]
      //   };
      //   client.post(hUriBase + "/user/tasks/", args, function (data,
      //   response) {
      //     log.debug(data);
      //     log.debug("now printing response")
      //     log.debug(response.statusCode);
      //
      //   });
      // }

  }
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
//     data: { x-api-user: "12b4ded4-e395-487c-af66-26344864be9b" ,
//     x-api-key: "bf00bb1a-1c1f-4751-932b-7b32bc2075dc" },
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
