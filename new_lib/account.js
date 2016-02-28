var config = require(__dirname + '/capital_one.js');
var request = config.request;

var Account = (function() {
  function Account() {}

  Account.initWithKey = function(apiKey, callback) {
    config.setApiKey(apiKey);
    return this;
  };

  Account.urlWithEntity = function(callback) {
    return config.baseUrl+'/accounts';
  };

  Account.urlWithCustomerEntity = function() {
    return config.baseUrl+'/customers';
  };

  Account.apiKey = function() {
    return '?key=' + config.apiKey;
  };

  /**
    # @Method: getAllAccounts
    # @Brief: Each index in the array is the JSON object of an individual customer.
    # @Returns an array of JSON objects getting all the customers.
  **/
  Account.getAllAccounts = function(callback) {
      request.get(this.urlWithEntity()+this.apiKey())
      .end(function(err, res) {
        if (err) {
          console.log(err.message);
          return;
        }
        callback(JSON.parse(res.text));
      });
  };

  /**
    # @Method: getAllByType
    # @Brief: Gets all accounts of a given type.
    # @Parameters: type
    # @Note: Accepts a string of the account type. 3 possbilities: Credit Card, Savings, Checking.
    # @Returns an array of JSON objects with the accounts.
  **/
  Account.getAllByType = function(type, callback) {
      request
        .get(this.urlWithEntity()+'?type='+type+this.apiKey())
        .end(function(err, res) {
          if (err) {
            console.log(err.message);
            return;
          }
          callback(JSON.parse(res.text));
        });
  };

  /**
    # @Method: getAccountById
    # @Brief: Returns the account specified by its account ID.
    # @Parameters: AccountId
    # @Note: Accepts a string of the account ID.
    # @Returns a JSON object with the account info.
  **/
  Account.getAccountById = function(id, callback) {
    request.get(this.urlWithEntity()+'/'+id+this.apiKey())
      .end(function(err, res) {
        if (err) {
          console.log(err.message);
          return;
        }
        callback(JSON.parse(res.text));
      });
  };

  /**
    # @Method: getAllByCustomerId
    # @Parameters: CustomerId
    # @Note: Accepts a string of the customer ID
    # @Returns all accounts associated with a given customer ID as an array of JSON objects.
  **/
  Account.getAllByCustomerId = function(customerId, callback) {
      request
        .get(this.urlWithCustomerEntity()+'/'+customerId+'/accounts' +
            this.apiKey())
        .end(function(err, res) {
          if (err) {
            console.log(err.message);
            return;
          }
          callback(JSON.parse(res.text));
        });
  };

  /**
    # @Method: updateAccount
    # @Brief: Updates an account's nickname.
    # @Parameters: AccountID, Accountobject
    # @Returns the http response code.
  **/
  Account.updateAccount = function(accountId, account, callback) {
    request
      .put(this.urlWithEntity()+ '/' + accountId + this.apiKey())
      .set({'Content-Type': 'application/json'})
      .send(account)
      .end(function(err, res) {
        if (err) {
          console.log(err.message);
          return;
        }
        callback(res);
      });
  };

  /**
    # @Method: createAccount
    # @Brief: Creates a new account
    # @Parameters: CustomerID, accountobject
    # @Returns the http response code.
  **/
  Account.createAccount = function(custID, account, callback) {
    request
      .post(this.urlWithCustomerEntity()+'/'+custID+'/accounts'+this.apiKey())
      .set({'Content-Type': 'application/json'})
      .send(account)
      .end(function(err, res) {
        if (err) {
          console.log(err.message);
          return;
        }
        callback(res);
      });
  };

  /**
    # @Method: deleteAccount
    # @Brief: delete a given account by accountId.
    # @Parameters: AccountId.
    # @Returns the http response code.
  **/
  Account.deleteAccount = function(accountId, callback) {
    request
      .del(this.urlWithEntity() + '/' + accountId + this.apiKey())
      .async(false)
      .end(function(err, res) {
        if (err) {
          console.log(err.message);
          return;
        }
        callback(res);
      });
  }
  return Account;
})();

module.exports = Account;
