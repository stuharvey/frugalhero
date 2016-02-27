var fs = require('fs');
var request = require('superagent');
var http = require('http');
var express = require('express');
var path = require('path');
var port = process.env.PORT || 3000;
var CAPITALONE_KEY = fs.readFileSync('server_keys/capitalone_key');
var server = express();

server.get('/', get);

server.use(express.static(path.join(__dirname, 'public')));

/**
 * Handle / gets
 * @param  {Object} req Get request
 * @param  {Object} res Response to send
 */
function get(req, res) {
  // request
  //   .get('http://api.reimaginebanking.com/atms?key=' + CAPITALONE_KEY)
  //   .end(function(err, c1Response) {
  //     // console.log(res.status);
  //     console.log(c1Response.body); // Write capital one's response to console
  //     res.end(JSON.stringify(c1Response.body));
  // });
  res.sendFile(__dirname + "/index.html");
}

server.get('/*' , function( req, res, next) {
    //This is the current file they have requested
    var file = req.params[0];
    if(file.indexOf("server") > -1) {
        res.end("404 you idiot");
    }
    else {
        fs.exists(__dirname + '/' + file, function(exists) {
            if (exists) {
                res.sendFile( __dirname + '/' + file );
            }
            else {
                //Send the requesting client the file.
                res.end("404 you idiot");
            }
        });
    }
});


http.createServer(server).listen(port);

console.log("Listening on port: " + port);
