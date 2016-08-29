// https://mlab.com/databases/freecodecampdb#collections
'use strict';

var express = require('express');
var mongodb = require('mongodb');
var app = express();
var path = require("path");
var port = process.env.PORT || 8080;

var MongoClient = mongodb.MongoClient;
var url = process.env.MONGOLAB_URI || 'mongodb://test:test@ds017246.mlab.com:17246/freecodecampdb';
var db_collection = "url_shortener";
var m_original_url = "test_1";
var m_short_url = "test_2";


function createShortURL(){
  var new_url = Math.floor((Math.random() * 10000) + 1);
  return "https://tobenamed.herokuapp.com/" + new_url;
}

//app.use(express.static(__dirname));

//app.get("/", function(req, res) {
//    res.sendFile(path.join(__dirname + '/index.html')); // Render HTML File
//});

  MongoClient.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
    throw err;
  } 
  else{
    console.log('Connection established to', url);
  }
  
  // Create a collection in the database: 
  db.createCollection(db_collection, {
      max: 5000,
      size: 5242880,
  });
  
  // -- Get the new URL parameter -- :
  
  app.get('/new/*', function(req, res) {
    console.log('A new URL has been passed as a parameter.');
    m_original_url = req.params[0];
    m_short_url = createShortURL();
    
    // -- Add the new original URL and shortened URL to the collection --: 
    //var url_shortener = db.collection('url_shortener');
    //url_shortener.insert( { original_url: m_original_url, short_url: m_short_url } );
  
    res.json({
        original_url: m_original_url,
        short_url: m_short_url
    }); 
  });
  
  
  // -- Visiting a shortened URL --> redirect to the original link --:
  app.get('/*', function(req, res){
    console.log('A short URL has been passed as a parameter.');
    res.end();
  });

  
  db.close();
  
  
  app.listen(port, function() {
    console.log('App listening on port ' + port);
  });
});
