var log=require('debug-logger')('hacktheplanet');

var fs = require('fs');
var path = require('path');
var passport = require('passport');
var NestStrategy = require('passport-nest').Strategy;
var session = require('express-session');
var EventSource = require('eventsource');
var openurl = require('openurl');
var CAPITALONE_KEY = fs.readFileSync('server_keys/capitalone_key', 'utf8');
log.debug('capital one api key: ' + CAPITALONE_KEY);

// Don't use this in production
// This secret is used to sign session ID cookies.
var SUPER_SECRET_KEY = 'keyboard-cat';

var passportOptions = {
  failureRedirect: '/auth/failure'
};

passport.use(new NestStrategy({
  clientID: process.env.NEST_ID,
  clientSecret: process.env.NEST_SECRET
}));

/**
 * No user data is available in the Nest OAuth
 * service, just return the empty user objects.
 */
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});


var express = require('express');
var server = express();

server.use(express.static('public'));
var bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: false}));
server.use(session({
  secret: SUPER_SECRET_KEY,
  resave: false,
  saveUninitialized: false
}));
server.use(passport.initialize());
server.use(passport.session());


var jsonfile = require('jsonfile');

server.get('/config/:uid', getConfig);
server.put('/config', storeConfig);

/**
 * Listen for calls and redirect the user to the Nest OAuth
 * URL with the correct parameters.
 */
server.get('/auth/nest', passport.authenticate('nest', passportOptions));


var tempControl = require('./control.js');
/**
 * Upon return from the Nest OAuth endpoint, grab the user's
 * accessToken and start streaming the events.
 */
server.get('/auth/nest/callback', passport.authenticate('nest',
  passportOptions),
  function(req, res) {
    var token = req.user.accessToken;

    if (token) {
      log.info('Success! Token acquired: ' + token);
      res.send('Success! You may now close this browser window.');
      tempControl.start(token);
    } else {
      log.error('An error occurred! No token acquired.');
      res.send('An error occurred. Please try again.');
    }
});

/**
 * When authentication fails, present the user with
 * an error requesting they try the request again.
 */
server.get('/auth/failure', function(req, res) {
  res.send('Authentication failed. Please try again.');
});


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
  openurl.open('http://localhost:' + port + '/auth/nest');
  log.info('Please click Accept in the browser window that just opened.');
}

log.info("Listening on port: " + port);
