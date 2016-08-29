'use strict';

var express = require('express');
var mongodb = require('mongodb');
var validate = require('validate.js');
var app = express();
var path = require("path");
var port = process.env.PORT || 8080;
var MongoClient = mongodb.MongoClient;
var url = process.env.MONGOLAB_URI || 'mongodb://test:test@ds017246.mlab.com:17246/freecodecampdb';
var db_collection = "url_shortener";
var m_original_url= "";
var m_short_url = "";
var website_url = "https://urlshortener-microservice.herokuapp.com/";
var m_uniqueid;

function set_uniqueid(mycollection){
  mycollection.count({}, function(err, data){
    if(err) throw err;
    var index = (data + 1).toString();
    m_uniqueid = website_url + index;
  });
}

function isValideURL(str) {
  var test = validate({website: str}, {website: {url: true}});
  if(test === undefined){
    return true;
  }
  else{
    return false;    
  }
}

app.use(express.static(__dirname));

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname + '/index.html')); // Render HTML File
});

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
  var mycollection = db.collection(db_collection);

  // 1-- Get the new URL parameter -- :
  app.get('/new/*', function(req, res) {
    console.log('A new URL has been passed as a parameter.');
    m_original_url = req.params[0];
    if(!isValideURL(m_original_url)){
      res.send('Error 404: Please pass a valid URL (format: http://www.example.com)');
    }else{
      set_uniqueid(mycollection);

      mycollection.findOne({ "original_url": m_original_url}, function(err, unique_id) {
        if (err) throw err;
        if (!unique_id) {
          // Add the new URL and the corresponding shortened URL to the collection :
          console.log('The new URL is not in the database');
          m_short_url = m_uniqueid;
          mycollection.insert( { original_url: m_original_url, short_url: m_short_url } );
        } 
        else {
          // Get the existing shortened URL in the database :
          console.log('The new URL is already in the database');
          m_short_url = unique_id.short_url;
        }
      
        res.json({
          original_url: m_original_url,
          short_url: m_short_url
        }); 
      });
    }
  });
  
  
  
  // 2-- Visiting a shortened URL --> redirect to the original link --:
  app.get('/*', function(req, res){
    mycollection.findOne({ "short_url": website_url + req.params[0]}, function(err, unique_id) {
      if (err) throw err;
      if (unique_id) {
        console.log('A short URL has been passed as a parameter : ' + req.params[0]);
        console.log('Redirect to: ' + unique_id.original_url);
        res.redirect(unique_id.original_url);
      } 
      else {
        console.log('Nothing has been passed as a parameter');
        res.end();
      }
    });
  });
  
  app.listen(port, function() {
    console.log('App listening on port ' + port);
  });
});
