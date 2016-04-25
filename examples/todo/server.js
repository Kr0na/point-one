//require('babel/register')
//require('./src/server/Application')
var express = require('express');
var app = express();
app
    .use(express.static(__dirname + "/public"));
app.listen(4005)
