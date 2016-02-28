var Config = require(__dirname + '/capital_one.js');
var request = Config.request;

var Bills = (function() {
  function Bills() {}

	Bills.initWithKey = function(apiKey) {
		console.log(apiKey);
		Config.setApiKey(apiKey);
		return this;
	}

	Bills.urlWithEntity = function() {
		return Config.baseUrl+'/bills/';
	}

	Bills.urlWithAccountEntity = function() {
		return Config.baseUrl+'/accounts/';
	}

	Bills.urlWithCustomerEntity = function() {
		return Config.baseUrl+'/customers/';
	}

	Bills.apiKey = function() {
		return '?key=' + Config.apiKey;
	}

	/**
	  # @Method: getAllByAccountId
	  # @Brief: Get all bills for a specific account
	  # @Parameters: accountId
	  # @Returns an array of objects containing the bills.
	**/
	Bills.getAllByAccountId = function(accID, callback) {
    request.get(this.urlWithAccountEntity()+accID+'/bills'+this.apiKey())
      .end(function(err, res) {
        if (err) {
          console.log(err.message);
          return;
        }
        callback(JSON.parse(res.text));
      });
  }

	/**
	  # @Method: getAllByCustomerId
	  # @Brief: Get all bills for a specific customer
	  # @Parameters: customerId
	  # @Returns the customer as a object array.
	**/
	Bills.getAllByCustomerId = function(custID, callback) {
    request.get(this.urlWithCustomerEntity()+custID+'/bills' + this.apiKey())
      .end(function(err, res) {
        if (err) {
          console.log(err.message);
          return;
        }
        callback(JSON.parse(res.text));
      });
  }

	/**
	  # @Method: getBill
	  # @Brief: Gets a bill for a specific bill ID
	  # @Parameters: bill ID
	  # @Returns a object with the bill data
	**/
	Bills.getBill = function(id, callback) {
    request.get(this.urlWithEntity()+id+this.apiKey())
      .end(function(err, res) {
        if (err) {
          console.log(err.message);
          return;
        }
        callback(JSON.parse(res.text));
      });
	}

	/**
	  	# @Method: updateBill
	  	# @Brief: Updates an account's information by id with given json data.
	  	# @Parameters: BillId, BillJson
	  	# Json format is as follows:
		# 	{
		#   "status": "",
		#   "payee": "",
		#   "nickname": "",
		#   "payment_date": "",
		#   "recurring_date": 0,
		#   "payment_amount": 0
		# }
		# @Returns http response code.
	**/
	Bills.updateBill = function(id, json, callback) {
    request.put(this.urlWithEntity()+id+this.apiKey())
      .set({'Content-Type': 'application/json'})
      .send(json)
      .end(function(err, res) {
        if (err) {
          console.log(err.message);
          return;
        }
        callback(res.statusCode);
      });
	}

	/**
	  # @Method: createBill
	  # @Brief: create a new bill on an associated account ID
	  # @Parameters: AccountId, Bill JSON
	  # Json is as follows:
	  # 	{
	  #   "status": "",
	  #   "payee": "",
	  #   "nickname": "",
	  #   "payment_date": "",
	  #   "recurring_date": 0,
	  #   "payment_amount": 0
	  # }
	  # @Returns http response code.
	**/
	Bills.createBill = function(accID, json, callback) {
    request.post(this.urlWithAccountEntity()+accID+'/bills'+this.apiKey())
      .set({'Content-Type': 'application/json'})
      .send(json)
      .end(function(err, res) {
        if (err) {
          console.log(err.message);
          return;
        }
        callback(res.statusCode);
      });
	}

	/**
	  # @Method: deleteBill
	  # @Brief: delete a bill by its id
	  # @Parameters: Bill ID
	  # @Returns http response code
	**/
	Bills.deleteBill = function(id, callback) {
    request.del(this.urlWithEntity()+id+this.apiKey())
      .end(function(err, res) {
        if (err) {
          console.log(err.message);
          return;
        }
        callback(res.statusCode);
      });
  };
  return Bills;

})();

module.exports = Bills;
