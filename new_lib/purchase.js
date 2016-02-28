var Config = require(__dirname + '/capital_one.js');
var request = Config.request;

var Purchase = (function() {
  function Purchase() {}

	Purchase.initWithKey = function(apiKey) {
		Config.setApiKey(apiKey);
		return this;
	}

	Purchase.urlWithEntity = function() {
		return Config.baseUrl+'/purchases/';
	}

	Purchase.urlWithAccountEntity = function() {
		return Config.baseUrl+'/accounts/';
	}

	Purchase.apiKey = function() {
		return '?key=' + Config.apiKey;
	}

	/**
	  # @Method: getAll
	  # @Parameters: Account Id
	  # @Returns all Purchases as an array of JSON Objects
	**/
	Purchase.getAll = function(id, callback) {
		request.get(this.urlWithAccountEntity()+id+'/purchases' + this.apiKey())
      .end(function(err, res) {
        if (err) {
          console.log(err.message);
          return;
        }
        callback(JSON.parse(res.text));
      });
	}

	/**
	  # @Method: getPurchase
	  # @Brief: Returns a purchase for a given ID
	  # @Parameters: PurchaseId
	  # @Returns a JSON Object
	**/
	Purchase.getPurchase = function(id, callback) {
		request.get(this.urlWithEntity()+id + this.apiKey())
      .end(function(err, res) {
        if (err) {
          console.log(err.message);
          return;
        }
        callback(JSON.parse(res.text));
      });
	}

	/**
	  # @Method: createPurchase
	  # @Brief: Creates a new purchase for a given account
	  # @Parameters: AccountId, Purchaseobject
	  # @Note: Purchaseobject is formatted as follows:
	  # {
	  # 	"merchant_id": "string",
	  # 	"medium": "balance",
	  # 	"purchase_date": "string",
	  # 	"amount": 0,
	  # 	"status": "pending",
	  # 	"description": "string"
	  # }
	  # @Returns http response code
	**/
	Purchase.createPurchase = function(accID, json, callback) {
    request.post(this.urlWithAccountEntity()+accID+'/purchases'+this.apiKey())
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
	  # @Method: updatePurchase
	  # @Brief: Updates an existing purchase
	  # @Parameters: PurchaseId, Purchaseobject
	  # @Note: Purchaseobject is formatted as follows:
	  # {
	  # 	"merchant_id": "string",
	  # 	"medium": "balance",
	  # 	"purchase_date": "string",
	  # 	"amount": 0,
	  # 	"status": "pending",
	  # 	"description": "string"
	  # }
	  # @Returns http response code
	**/
	Purchase.updatePurchase = function(id, json, callback) {
    request.put(this.urlWithEntity()+id+'?key='+this.apiKey())
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
	  # @Method: deletePurchase
	  # @Brief: Deletes a purchase for a given ID
	  # @Parameters: PurchaseId
	  # @Returns http response code
	**/
	Purchase.deletePurchase = function(id, callback) {
    request.del(this.urlWithEntity()+id+this.apiKey())
      .end(function(err, res) {
        if (err) {
          console.log(err.message);
          return;
        }
        callback(res.statusCode);
      });
  }

  return Purchase;
})();

module.exports = Purchase;
