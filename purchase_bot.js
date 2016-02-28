var fs = require('fs');

var Purchase = require(__dirname + '/new_lib/purchase.js');
Purchase.initWithKey(fs.readFileSync('server_keys/capitalone_key', 'utf8'));

var user_id = '56c66be5a73e492741507384';
var accountIDs = ['56c66be6a73e492741507dbb', '56c66be6a73e492741507dbc',
  '56c66be6a73e492741507dbd', '56c66be6a73e492741507dbe'];

var merchants = ['56c66be6a73e492741507631', '56c66be6a73e492741507633',
  '56c66be6a73e49274150763e', '56c66be6a73e492741507644',
  '56c66be6a73e492741507648', '56c66be6a73e49274150764a'];

var descriptions = ['restaurant', 'atmfee', 'latebill', 'bar', 'candy',
  'groceires', 'unsavory items', 'medium sized goldfish', 'new house',
  'crazy vacation', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'ab', 'cd', 'ef',
  'gh', 'ac', 'bd', 'eg', 'fh', 'x', 'y', 'z', 'r', 'msad'];


setInterval(makePurchase, 20*1000);

function makePurchase() {
  var acctID = accountIDs[Math.floor(Math.random()*accountIDs.length)];
  var merchantID = merchants[Math.floor(Math.random()*merchants.length)];
  var desc = descriptions[Math.floor(Math.random()*descriptions.length)];
  var purchase =  {
    "merchant_id": merchantID,
    "amount": Math.random()*150,
    "status": "completed",
    "medium": "balance",
    "description": desc
  }
  console.log("Making a purchase:");
  console.log(purchase);
  Purchase.createPurchase(acctID, purchase, function(res) {

    console.log("Made a purchase: status code ["+res+"]");
  });
}
