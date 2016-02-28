var log=require('debug-logger')('hacktheplanet');

var fs = require('fs');
var CAPITALONE_KEY = fs.readFileSync('server_keys/capitalone_key', 'utf8');

var tempControl = require('./control.js');

log.debug('capital one api key: ' + CAPITALONE_KEY);

var express = require('express');
var server = express();

var Customer = require(__dirname + '/new_lib/customer.js');
var Account = require(__dirname + '/new_lib/account.js');
var Bills = require(__dirname + '/new_lib/bills.js');
var Purchase = require(__dirname + '/new_lib/purchase.js');

Customer.initWithKey(CAPITALONE_KEY);
Account.initWithKey(CAPITALONE_KEY);
Purchase.initWithKey(CAPITALONE_KEY);


server.use(express.static('public'));
var bodyParser = require('body-parser');
server.use(bodyParser.json());

var jsonfile = require('jsonfile');

// ----------- HABITICA STUFF ------------
server.get('/config/:uid', getConfig);
server.put('/config/', storeConfig);

server.get('/status', sendStatus);

function sendStatus(req, res) {
  res.json(user);
  res.end();
}

var habitica = require('./habitica.js');
habitica.init();

function getConfig(req, res) {
  var config = fs.readFileSync(req.params.uid+'.json', 'utf8');
  if (config === null) res.status(404).end();
  res.json(config);
}

function storeConfig(req, res) {
  try {
    log.trace('store body: ' + req.body);
    // jsonfile.writeFileSync(req.body.uid+'.json', req.body);
  } catch (e) {
    log.error('store failed: ' + e);
    res.status(500).end();
  }

  if(req.body.loaded === 'no') {
    log.debug("hi i'm in here");
    var cAccountID = req.body.cAccID;

    var toPost = [];
    var atm = req.body.ATMFees;
    log.debug(atm);

    if(atm.enabled) {
      user.goals.push('avoidfees');
      toPost.push({text: "ATM Fees", id: "atmFees", type: "habit",
      notes: "avoid ATM Fees"});
    }

    var EatAtHome = req.body.EatAtHome;

    if(EatAtHome.enabled) {
      user.goals.push('eatathome');
      toPost.push({text: "Eat out less", id: "eatAtHome", type: "habit",
      notes: "Spend less money by eating at home instead of going out"});
    }

    var bills = req.body.Bills;
    log.debug(bills);

    if(bills.enabled) {
      user.goals.push('paybillsontime');
      toPost.push({text: "Pay bills on time", id: "bills", type: "daily"});
    }


    var liquor = req.body.Liquor;

    if(liquor.enabled){
      user.goals.push('alcatgrocery');
      toPost.push({text: "Buy your alcohol at the grocery store", id: "liquor",
      type: "habit", notes: "Don't always go out to bars"});
    }

    var spendSave = req.body.SpendSave;

    if(spendSave.enabled) {
      user.goals.push('spendsave');
      toPost.push({text: "Save some percent of your money", type:"daily",
      "frequency": "weekly", id: "spendSave", notes: "Spend" + spendSave.rate +
      "% of your money"});
    }

    habitica.addTasks(toPost);
    getCurrentStatus();
  }
  res.status(200).send();
}

var user = {
  gotATMFee: false,
  ateOut: false,
  wentToBar: false,
  lateOnBill: false,
  belowQuota: false,
  quota: 1000,
  goals: [],
  purchases: [],
  balance: 0,
  id: '56c66be5a73e492741507384'
};

function getCurrentStatus() {
  log.info('Getting the current state');
  Account.getAllByCustomerId(user.id, function(accounts) {
    log.debug('Current balance: ' + user.balance);
    user.balance = 0;
    accounts.forEach(function (account) {
      user.balance += account.balance;
      var account_id = account._id;

      Purchase.getAll(account_id, function(purchases) {
        purchases.forEach(function(purchase) {
          if (contains(user.purchases, purchase)) return;
          if (contains(purchase.description, 'restaurant') &&
              contains(user.goals, 'eatathome')) {
            user.ateOut = true;
          }

          if (contains(purchase.description, 'atmfee') &&
              contains(user.goals, 'avoidfees')) {
            user.gotATMFee = true;
          }

          if (contains(purchase.description, 'bar') &&
              contains(user.goals, 'alcatgrocery')) {
            user.wentToBar = true;
          }

          if (contains(purchase.description, 'latebill') &&
              contains(user.goals, 'paybillsontime')) {
            user.lateOnBill = true;
          }
        });
        user.purchases = purchases;
      });
    });
    if (user.balance < user.quota) {
      log.info("You went below your quota... Sorry. It's going to get cold.");
      if (process.env.RUN_WITH_NEST)
        tempControl.setTemp(55);
      user.belowQuota = true;
    }
  });
}

function contains(s1, s2) {
  return s1.indexOf(s2) !== -1;
}

setInterval(getCurrentStatus, 30*1000*10);

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

function c1GetCustomerWithdrawals(customerId){
  var withdrawals = [];
  return JSON.parse(req('GET', c1UriBase + '/accounts/' + customerId +
        '/withdrawal' + c1ApiKeyParam).getBody());
}
function c1GetAtmWithdrawals(customerId){
  return c1GetCustomerWithdrawals(customerId).filter(function(x){
    x.description.includes('ATM');
  });
}

var port = process.env.PORT || 3000;
var http = require('http');
http.createServer(server).listen(port);

if (process.env.RUN_WITH_NEST) {
  tempControl.start(function () {
    tempControl.setTemp(75);
  });
}

log.info("Listening on port: " + port);
