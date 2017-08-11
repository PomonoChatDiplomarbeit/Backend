var express = require('express');  
var app = express();  
var port = 8080;
var server = require('http').createServer(app);  
var io = require('socket.io')(server);
var crypto = require('crypto');
var path = require('path');

//DATABASE
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://10.157.80.81:27017/diplom";
var ObjectId = require('mongodb').ObjectId; 

//Objects
var sockets = [];
var onlineUsers = [];

app.use(express.static(__dirname + '/bower_components'));  

app.get('/', function(req, res,next) {  
    res.sendFile('HTMLPage1.html', {root: '.'});
});

io.on('connection', function(socket) {  
    socket.emit('connected', { status: "online" });

    socket.on('connectWithGoogle', function (gid) {
        if(!getSocketIDfromGID(gid)) {
            sockets.push({ socketid: socket.id, googleid: gid });
            console.log("Socket with Google ID stored.");
            socket.emit('connectedWithGoogle');
        }
        
        else {
            console.log("No association with this Google ID found.");
            socket.emit('connectedWithGoogle');
        }
    });

    socket.on('login', function(givenUser) {
        onlineUsers.push({user: givenUser, socketid: socket.id});
        socket.emit('loginResponse', {status: "loggedIn", user: givenUser});
    });

    socket.on('pushMessage', function(message) {
        console.log(message);
        if(message != undefined) {
            console.log("Socket id: " + getSocketIDfromUsername(message.reciever) + " Message: " + message.data);
            socket.broadcast.to(getSocketIDfromUsername(message.reciever)).emit('messageResponse', { textToDisplay: message.data, status: "successful" });
            insertmessage(message.sender, message.reciever, "text", message.data);
        }

        else 
            io.to(getSocketIDfromUsername(message.sender)).emit('messageResponse', { textToDisplay: "Message has no content, try it again", status: "failed" });
    });  

    socket.on('disconnectUser', function(socket){
        removeSocket(socket);
        socket.emit('disconnected', { status: "offline" });
        console.log("User went offline. ");
    });



    //SOCKETIO FUNCTIONS FOR ROOMS

    socket.on('getAllRooms', function(username) {
        socket.emit('roomResponse', { room: getAllRooms(username) });
    });

    socket.on('createRoom', function(room) {
        var idgenerator = new IDGenerator();
        room.id = idgenerator.generate();
        insertRoom(room);
    });

    socket.on('pushMessageRoom', function(roomid, message) {
        var myRoom;
        if(message != undefined) {
            myRoom = getRoom(roomid);
            myRoom.forEach(function (user){
                socket.broadcast.to(getSocketIDfromUsername(user.username)).emit('messageResponse', { textToDisplay: message.data, status: "successful" });
            });
            
            insertmessage(getUserWithSocketID(socket.id), message.type, message.data);
        }

        else 
            io.to(socket.id).emit('messageResponse', { textToDisplay: "Message has no content, try it again", status: "failed" });
    });
});

(function() {
    function IDGenerator() {
        this.length = 8;
        this.timestamp = +new Date;
        
        var _getRandomInt = function( min, max ) {
        return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
        }
        
        this.generate = function() {
            var ts = this.timestamp.toString();
            var parts = ts.split( "" ).reverse();
            var id = "";
            
            for( var i = 0; i < this.length; ++i ) {
            var index = _getRandomInt( 0, parts.length - 1 );
            id += parts[index];	 
            }
            
            return id;
        }
    }
})();

// CUSTOM FUNCTIONS BEGINNING
function getSocketIDfromUsername(username) {
    var socketid;
    onlineUsers.forEach(function (element){
        if(element.user == username) {
            socketid = element.socketid;
        }
    });
    return socketid;
}

function getUserWithSocketID(socketid) {
    var username;
    onlineUsers.forEach(function (user) {
        if(user.socketid == socketid) {
            username = user.username;
            break;
        }
    }, this);
    return username;
}

function removeSocket(socket) {
    for(var i = 0; i < sockets.length; i++) {
        if(socket == sockets[i].socketid)
            array.splice(i, 1);
    }
}
function getSocketIDfromGID(gid) {
    var socketid;
    sockets.forEach(function (element) {
        if (element.googleid == gid) {
            socketid = element.socketid;
            return socketid;
        }
    });
    
    return false;
}
function userAlreadyExists(socketid) {
    users.forEach(function(key, value) {
        if(socketid == key)
            return true;
    });

    return false;
}

// CUSTOM FUNCTIONS END

// ALL DB METHODS BEGINNING
function insertUser(_username) {
        MongoClient.connect(url, function (err, db) {
            if (err) throw err;
            var myobj = { username: _username};
            db.collection("user").insertOne(myobj, function (err, res) {
                if (err) throw err;
                console.log("1 record inserted");
                
                db.close();
            });
        });
    

    
}

function insertMessage(_sender, _type, _data) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var _timestamp = new Date().getTime();
        var myobj = { sender: _sender, type: _type, data: _data, timestamp: _timestamp};
        db.collection("message").insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("1 record inserted");
            db.close();
        });
    });
}

function insertRoom(_room) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        db.collection("room").insertOne(room, function (err, res) {
            if (err) throw err;
            console.log("1 record inserted");
            db.close();
        });
    });
}
//+
//***********************delete***********************
function deleteRoom(_roomid) {
    var groupToDelete = ObjectId(_group_id);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        db.collection("chat_group").deleteOne({ _id: groupToDelete }, function (err, obj) {
            if (err) throw err;
            console.log("1 record deleted");
            db.close();
        });
    });
}
//+
function deleteMessage(_messageID) {
    var messageToDelete = ObjectId(_messageID);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection("message").deleteOne({ _id: messageToDelete }, function (err, obj) {
            if (err) throw err;
            console.log("1 record deleted");
            db.close();
        });
    });
}
//+
function deleteUser(_userid) {
    var userToDelete = ObjectId(_userid);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection("user").deleteOne({ _id: userToDelete }, function (err, obj) {
            if (err) throw err;
            console.log("1 record deleted");
            db.close();
        });
    });
}
//+
//***********************update***********************
function updateUser(_userId, _newValues) {
    var updatedUser = ObjectId(_userid);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection("user").updateOne({ _id: updatedUser }, _newValues, function (err, res) {
            if (err) throw err;
            console.log("1 record updated");
            db.close();
        });
    });
}
//+
function updateMessage(_messageID, _newMessageValues) {
    var updatedMessage = ObjectId(_messageID);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        db.collection("message").updateOne({ _id: updatedMessage }, _newMessageValuesd, function (err, res) {
            if (err) throw err;
            console.log("1 record updated");
            db.close();
        });
    });
}
//+
function updateRoom(_group_id, _newValues) {
    var updatedRoom = ObjectId(_group_id);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        db.collection("chat_group").updateOne({ _id: updatedRoom }, _newValues, function (err, res) {
            if (err) throw err;
            console.log("1 record updated");
            db.close();
        });
    });
}
//+
//***********************others***********************

function getMessagesForChat(_nrOfMessagesToLoad, _sender, _receiver) {
    var messageObject = [];
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var messageCount = 0;
        db.collection("message").find({}).toArray(function (err, result) {
            if (err) throw err;
            //console.log(result);
            result.forEach(function(element) {
                if (messageCount < _nrOfMessagesToLoad) {
                    if((element.Sender == _sender && element.Receiver == _receiver) || (element.Sender == _receiver && element.Receiver == _sender)) {
                        console.log(element);
                        messageObject.push(element);
                        messageCount++;
                    }
                }
            }, this);
            return messageObject;
        });
        db.close();
    });
    
}

function getAllRooms(_username) {
    var allRooms = [];
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection("room").find({}).toArray(function (err, result) {
            if (err) throw err;
            result.forEach(function(element) {
                element.users.forEach(function(user) {
                    if(user == _username)
                        allRooms.push(element);
                });
            }, this);
            return allRooms;
        });
        db.close();
    });
}

function getRoom(_roomid) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection("room").find({}).toArray(function (err, result) {
            if (err) throw err;
            result.forEach(function(element) {
                if(element.ID == _roomid)
                    return element;
            }, this);
        });
        db.close();
    });
}

function forwardMessageTo(_messageID, _newReceiver) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection("message").find({}).toArray(function (err, result) {
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                if (result[i]._id == MessageID) {
                    insertmessage(result[i].Sender, newReceiver, result[i].Type, result[i].Data);
                }
            }
            db.close();
        });
    });
}
//+
function SearchUser(searchString) {
    var a;
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection("user").find({ phonenumber: searchString }, function (err, result) {
            if (err) throw err;
            a = result;
            console.log(a + "    " + result.phonenumber);
            db.close();
        });

    });
    return a;
}

function checkUsers(_phonenumber) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var res;

        db.collection("user").find({}).toArray(function (err, result) {
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                if (result[i].phonenumber == _phonenumber) {
                    console.log(result[i].phonenumber + "  " + _phonenumber);
                    res = true;

                }
            }
            db.close();


            return res;
        });
    });
}
// END ALL DB METHODS

server.listen(port);  
console.log("Server is up and running. Listening on port: " + port);