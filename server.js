var express = require('express');
var app = express();
var port = 8080;

app.get('/', function(req, res){


    res.json({

    }); 
});


app.listen(process.env.PORT || port, function(){
    console.log("App listening on port: " + port);
});