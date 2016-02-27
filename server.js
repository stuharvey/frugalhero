
var fs = require('fs')
var request = require('superagent');

request.get('http://api.reimaginebanking.com/atms?key=your_key').end(function(res){
    foo(res.status);
    bar(res.body); //do something
});
