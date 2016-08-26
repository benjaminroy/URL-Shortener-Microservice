var express = require('express');
var mongodb = require('mongodb');
var app = express();
var path = require("path");
var port = 8080;

//app.use(express.static(__dirname));
//
//app.get("/", function(req, res) {
//    res.sendFile(path.join(__dirname + '/index.html')); // Render HTML File
//});

var MongoClient = mongodb.MongoClient;
var url = process.env.MONGOLAB_URI || 'mongodb://test:test@ds017246.mlab.com:17246/freecodecampdb';

  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
    throw err;
  } 
  else{
    console.log('Connection established to', url);
    db.close();
  }
  
  app.listen(port, function() {
    console.log('Listening on port: ' + port);
  });
  
});
