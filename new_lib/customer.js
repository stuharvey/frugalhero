var config = require(__dirname + '/capital_one.js');
var request = config.request;

var Customer = (function() {
  function Customer() {}

  Customer.urlWithEntity = function() {
    return config.baseUrl+"/customers";
  };

  Customer.urlWithAcctEntity = function() {
    return config.baseUrl+"/accounts";
  };

  Customer.apiKey = function() {
    return '?key=' + config.apiKey;
  };

  Customer.initWithKey = function(key) {
    config.setApiKey(key);
    return this;
  };

  /**
    # @Method: getCustomers
    # @Brief: Gets all customers the API key has acccess to.
    # @Returns an array of JSON Objects.
  **/
  Customer.getCustomers = function(callback) {
    request.get(this.urlWithEntity() + this.apiKey()).end((function(err, res) {
      if (err) {
        console.log(err.message);
        return;
      }
      callback(JSON.parse(res.text));
    }));
  };

  /**
    # @Method: getCustomerById
    # @Brief: Gets the specified customer's information.
    # @Parameters: CustomerId
    # @Returns a object with the customer data
  **/
  Customer.getCustomerById = function(custId, callback) {
    request.get(this.urlWithEntity() + '/' + custId + this.apiKey())
      .end(function(err, res) {
        if (err) {
          console.log(err.message);
          return;
        }
        callback(JSON.parse(res.text));
      });
  };

  /**
    # @Method: Get the customer for the given account.
    # @Parameters: AccountId
    # @Returns a object with the specified customer data.
  **/
  Customer.getCustomerByAcountId = function(accId, callback) {
    request
      .get(config.baseUrl + '/accounts/' + accId + '/customer' + this.apiKey())
      .end(function(err, res) {
        if (err) {
          console.log(err.message);
          return;
        }
        callback(res.text);
      });
  };

  /**
    # @Method: updateCustomer
    # @Brief: Updates a customer by id with given JSON data.
    # @Parameters: CustomerId, Customerobject.
    # @Note: Json is as follows:
    #  {
    #   "address": {
    #     "street_number": "",
    #     "street_name": "",
    #     "city": "",
    #     "state": "",
    #     "zip": ""
    #   }
    # }
    # @Returns http response code.
  **/
  Customer.updateCustomer = function(custId, updateInfo, callback) {
    request
      .put(this.urlWithEntity() + '/' + custId + this.apiKey())
      .set('Content-Type', 'application/json')
      .send(updateInfo)
      .end(function(err, res) {
        if (err || !res.ok) {
          console.log("Uh oh got an error in updateCustomer");
        }
        else {
          callback(res);
        }
      });
  };
  Customer.isBullshit = true;

  return Customer;
})();

module.exports = Customer;
