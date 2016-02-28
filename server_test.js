var fs = require('fs');
var CAPITALONE_KEY = fs.readFileSync('server_keys/capitalone_key', 'utf8');

var request = require('superagent');

var Config = {
  baseUrl: 'http://api.reimaginebanking.com:80',
  apiKey: CAPITALONE_KEY
};

var Customer = require(__dirname + '/new_lib/customer.js');
var Account = require(__dirname + '/new_lib/account.js');

customerDemo(CAPITALONE_KEY, Customer);
accountDemo(CAPITALONE_KEY, Account);


// requirejs(['account', 'atm', 'branch', 'customer', 'deposit', 'withdrawal',
//   'bills', 'merchant', 'purchase'], function (account, atm, branch, customer,
//   deposit, withdrawal, bills, merchant, purchase) {
//     var apikey = CAPITALONE_KEY;
//     accountDemo(apikey, account); // !!! Verified !!!
// 		atmDemo(apikey, atm); // !!! Verified !!!
// 		branchDemo(apikey, branch); // !!! Verified !!!
// 		customerDemo(apikey, customer); // !!! Verified !!!
// 		depositDemo(apikey, deposit); // !!! Verified - One 404 Error !!!
// 		withdrawalDemo(apikey, withdrawal); // !!! Verified !!!
// 		billsDemo(apikey, bills); // !!! Verified !!!
// 		merchantDemo(apikey, merchant); // !!! Verified !!!
// 		purchaseDemo(apikey, purchase); // No Purchases for existing accounts
//
// });

function purchaseDemo (apikey, purchase) {
  console.log('purchase Demo');
  var purchaseAccount = purchase.initWithKey(apikey);
  var accID = '55e94a6cf8d8770528e6196d';

  var samplePurchase = '{ "merchant_id": "55e94a6cf8d8770528e6196d", "medium": "balance", "purchase_date": "string", "amount": 0, "status": "pending", "description": "string" }';
  var samplePUrchaseUpdate = '{ "payer_id": "string", "medium": "balance", "amount": 0, "description": "string" }';
  console.log("[purchase - get all purchases] Response: " + purchaseAccount.getAll(accID));
  // var purchaseID = purchaseAccount.getAll(accID)[0]._id;
  // console.log("[purchase - get purchase] Response: " + purchaseAccount.getPurchase(purchaseID));
  console.log("[purchase - create purchase] Response: " + purchaseAccount.createPurchase(accID, samplePurchase));
  //var lastPurchase = purchaseAccount.getAll(accID).pop();
  //console.log("[purchase - update purchase] Response: " + purchaseAccount.updatePurchase(lastPurchase._id, samplePUrchaseUpdate));
  // console.log("[purchase - delete purchase] Response: " + purchaseAccount.deletePurchase(purchaseID));
}

function merchantDemo (apikey, merchant) {
  console.log('merchant Demo');
  var merchantAccount = merchant.initWithKey(apikey);
  var sampleMerchant = '{ "name": "MVP LLC", "address": { "street_number": "12095", "street_name": "Oakload Park Ave.", "city": "Arlington", "state": "VA", "zip": "22192" }, "geocode": { "lat": 21, "lng": -10 } }';
  var sampleMerchantUpdate = '{ "name": "MVP Inc.", "address": { "street_number": "12095", "street_name": "Oakload Park Ave.", "city": "Arlington", "state": "VA", "zip": "22192" }, "geocode": { "lat": 21, "lng": -10 } }';
  console.log("[merchant - get all merchants] Response: " + merchantAccount.getAll());
  var merchantID = merchantAccount.getAll()[0]._id;
  console.log("[merchant - get merchant by ID] Response: " + merchantAccount.getMerchant(merchantID));
  console.log("[merchant - create merchant] Response: " + merchantAccount.createMerchant(merchantID, sampleMerchant));
  merchantID =  merchantAccount.getAll().pop()._id;
  console.log("[merchant - update merchant] Response: " + merchantAccount.updateMerchant(merchantID, sampleMerchantUpdate));
}

function billsDemo (apikey, bills) {
  console.log('bills Demo');
  var billAccount = bills.initWithKey(apikey);
  var accID = '55e94a6cf8d8770528e6196d';
  var custID = '55e94a6af8d8770528e60e64';
  var sampleBill = "{\"status\": \"pending\",\"payee\": \"Verizon\",\"nickname\": \"Cable/Internet\",\"payment_date\": \"2015-09-18\", \"recurring_date\": 1, \"payment_amount\": 50 }";
  var sampleBillUpdate = "{\"status\": \"cancelled\",\"payee\": \"Verizon\",\"nickname\": \"Cable/Internet\",\"payment_date\": \"2015-09-18\", \"recurring_date\": 1, \"payment_amount\": 30 }";

  console.log('[bills - get an account\'s bills] Response: ' + billAccount.getAllByAccountId(accID));
  console.log('[bills - get a customer\'s bills] Response: ' + billAccount.getAllByCustomerId(custID));
  var billID = billAccount.getAllByCustomerId(custID)[0]._id;
  console.log('[bills - get a specific bill] Response: ' + billAccount.getBill(billID));
  console.log('[bills - create a bill] Response: ' + billAccount.createBill(accID, sampleBill));

  var lastBill = billAccount.getAllByAccountId(accID).pop();
  console.log('[bills - update a bill] Response: ' + billAccount.updateBill(lastBill._id, sampleBill));
  console.log('[bills - delete bill] Response: ' + billAccount.deleteBill(billID));
}

function withdrawalDemo (apikey, withdrawal) {
  console.log('withdrawal Demo');
  var withdrawalAccount = withdrawal.initWithKey(apikey);
  var accID = '560072e0ce1cef140015e483';
  var withdrawalID = '5601901fce1cef140015e4a3';
  var sampleWithdrawal = "{\"medium\": \"balance\",\"amount\": 1000,\"description\": \"test\"}";
  var sampleWithdrawUpdate = '{ "medium": "balance", "amount": 52000, "description": "update" }';

  console.log("[withdrawal - withdraw an account] Response: "+ withdrawalAccount.createWithdrawal(accID, sampleWithdrawal));
  console.log("[withdrawal - get withdrawals by account] Response: "+ withdrawalAccount.getAllByAccountId(accID));
  console.log("[withdrawal - get withdrawals by id] Response: " + withdrawalAccount.getWithdrawalById(withdrawalID));
  console.log("[withdrawal - create withdrawal] Response: " + withdrawalAccount.createWithdrawal(accID, sampleWithdrawal));

  var lastAcct = withdrawalAccount.getAllByAccountId(accID).pop();
  console.log("[withdrawal - update withdrawal] Response: " + withdrawalAccount.updateWithdrawalById(lastAcct._id, sampleWithdrawUpdate));
  //console.log("[withdrawal - delete withdrawal] Response: " + withdrawalAccount.deleteWithdrawals('56019011ce1cef140015e4a1'));
}

function depositDemo (apikey, deposit) {
  console.log('Deposit Demo');
  var depositAccount = deposit.initWithKey(apikey);
  var accID = '560072e0ce1cef140015e483';
  var depID = '56007773ce1cef140015e487';
  var sampleDeposit = "{\"medium\": \"balance\",\"amount\": 100000,\"description\": \"test\"}";
  var sampleDepositUpdate = "{\"medium\": \"balance\",\"amount\": 205000,\"description\": \"test\"}";

  console.log("[Deposit - Get All By AccountId]: " + depositAccount.getAllByAccountId(accID));
  console.log("[Deposit - Deposit by DepositID]: " + depositAccount.getDepositById(depID));
  console.log("[Deposit - New deposit]: " + depositAccount.createDeposit(accID, sampleDeposit));
  var lastDesposit = depositAccount.getAllByAccountId(accID).pop();
  // console.log("[Deposit - Update Deposit]: " + depositAccount.updateDeposit(lastDesposit._id, sampleDepositUpdate)); //API failed - "NetworkError: 404 Not Found
  // console.log("[Deposit - Delete Deposit]: " + depositAccount.deleteDeposit('56007939ce1cef140015e48a'));
}

function accountDemo (apikey, account) {
  var custAccount = account.initWithKey(apikey);
  var custID = '56c66be5a73e492741507383';
  var accID = '56c66be6a73e492741507db7';
  var newAccount = "{\"nickname\":\"Mr. Stanislaus's Account\"}";
  var sampleAccount = "{\"balance\":50,\"nickname\":\"Lola Account\",\"" +
    "rewards\":2,\"type\":\"Checking\"}";

  custAccount.getAllAccounts(function(accounts) {
    console.log("[Account - Get All Accounts] : ");
    console.log(accounts);
  });

  custAccount.getAllByType('Checking', function(accounts) {
    console.log("[Account - Get All By Type] : ");
    console.log(accounts);
  });
  custAccount.getAllByCustomerId(custID, function(accounts) {
    console.log("[Account - Get Customer (Prior Update)] : ");
    console.log(accounts);
  });
  custAccount.updateAccount(accID, newAccount, function(res) {
    console.log("[Account - Updating Stanislaus's Account] - response code:");
    console.log("\t" + res.statusCode);
  });
  custAccount.getAllByCustomerId(custID, function(accounts) {
    console.log("[Account - Get Customer (Post Update)] : ");
    console.log(accounts);
  });
  custAccount.createAccount(custID, sampleAccount, function(res) {
    console.log("[Account - Create Sample for Miss. Stanislaus's Account] - " +
      "response code:");
    console.log('\t' + res.statusCode);
  });
}

function atmDemo (apikey, atm) {
  console.log('ATM Demo');
  var id = '55e94a6af8d8770528e60a8f';
  var atmAccount = atm.initWithKey(apikey);
  console.log("[ATM - Get All] : Sample Location: " + atmAccount.getAll());
  console.log("[ATM - Get One] : Location Hour: " + atmAccount.getATM(id).hours[0]);
  console.log("[ATM - Get By Location] : " + atmAccount.getAtmByLocation(38.9283, -77.1753, 5));
}

function branchDemo (apikey, branch) {
  console.log('Branch Demo');
  var branchAccount = branch.initWithKey(apikey);
  console.log("[Branch - Get All Branches] : Sample Branch: " + branchAccount.getAll()[0].address.zip);
  console.log("[Branch - Get a Branch] : Branch Hour: " + branchAccount.getBranch('55e94a6af8d8770528e60b53').hours[1]);
}

function customerDemo (apikey, Customer) {
  var customerAccount = Customer.initWithKey(apikey);
  var custID = '56c66be5a73e492741507383';
  var accID = '56c66be6a73e492741507db7';
  Customer.getCustomers(function(customers) {
    console.log("[Customer - Get All Customers] : Sample Customer: ");
    var cust = customers[0];
    console.log("[" + cust._id + "] " + cust.last_name + ", " +
      cust.first_name);
  });
  Customer.getCustomerById(custID, function(customer) {
    console.log("[Customer - Get Customer By Customer ID] : Sample Customer:");
    console.log(customer);
  });

  Customer.getCustomerByAcountId(accID, function(customer) {
    console.log("[Customer - Get Customer By Account ID] : Sample Customer: " +
      customer.toString());
  });

  var customerUpdateInfo = JSON.stringify({ address: {
    street_number: "8020", street_name: "Greenroad Dr", city: "McLean",
    state: "VA", zip: "22102" }
  });
  Customer.updateCustomer(custID, customerUpdateInfo, function(res) {
    console.log("updateCustomer passed with code " + res.statusCode);
    Customer.getCustomerById(custID, function(customer) {
      console.log("[Customer] Post update: ");
      console.log(customer);
    });
  });
}
