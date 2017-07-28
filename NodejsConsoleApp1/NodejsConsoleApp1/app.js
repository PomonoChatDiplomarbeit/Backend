var express = require('express');
var app = express();
var port = 8080;
var server = require('http').createServer(app);
app.get('/', function (req, res, next) {
    res.sendFile(__dirname + '/HTMLPage1.html');
});
server.listen(port);
console.log("Server is up and running. Listening on port: " + port);