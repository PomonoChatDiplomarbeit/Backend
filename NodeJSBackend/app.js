var express = require('express');  
var app = express();  
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var HashMap = require('hashmap');
var moment = require('moment');
var shortid = require('shortid');

var users = new HashMap();
var messages = [];

app.use(express.static(__dirname + '/bower_components'));  

app.get('/', function(req, res,next) {  
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {  
    console.log(socket.id)
    socket.on('newuser', function() {
        if(!UserAlreadyExists(socket.id)) {
            users.set(shortid.generate(), socket.id)
            console.log(users.key
        }
    });

    socket.on('message', function () { });
    socket.on('disconnect', function () { 

    });

    socket.on('privateChatMessage', function(message, toId, msgtype) {
        console.log("got message: " + message)
        messages.push({
            mguid: shortid.generate(),
            sender: socket.id,
            reciever: toId,
            time: moment().hour + ":" + moment().minute,
            type: msgtype,
            data: message
        })
        console.log("Content in msg array: " + messages);
        allSockets[toId-1].emit('newPrivateMessage_response', {data: message});
    });
});

function UserAlreadyExists(socketid) {
    users.forEach(function(key, value) {
        if(socketid == key)
            return true;
    });

    return false;
}
//getallmessages user/telnr alle kontakte mit denen er geschrieben hat
//getmessagesforchat nutzer/otheruser all messages from those two partners
//saving incoming "JSON" objects in a array for now
server.listen(4200);  