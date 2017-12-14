var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var DB = require('./databaseMethods');

io.on('connection', function (socket) {
    socket.on('login', function (user) {
        console.log('login called');
        DB.checkCredentials(user, result => {
            if (result)
                socket.emit('login-response', 'OK');
            else
                socket.emit('login-response', 'ERROR');
        });
    });
    
    socket.on('load rooms for user', function (username) {
       DB.getRoomsForUser(username, result => {
            socket.emit('room-response', result);
       });
    });

    socket.on('add message to room', function (roomId,message) {
        DB.addMessageToRoom(message, roomId, e => {
            socket.broadcast.emit('reloadRooms', {});
        });
     });
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});