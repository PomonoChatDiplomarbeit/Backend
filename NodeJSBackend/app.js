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

    socket.on('test', function() {
        console.log("Im in");
        console.log(GetMessagesForChat(2, 111, 222));
        socket.emit('connected');
    });
    socket.on('connect', function () {
        console.log(socket.id);
        socket.emit('connected');
    });

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

    socket.on('login', function(username) {
        if(getSocketIDfromUsername(username))
            onlineUsers.push('loginResponse', {user: username, socketid: getSocketIDfromUsername(username)});

        else
            onlineUsers.push({user: username, socketid: socket.id});

        socket.emit('loginResponse', {status: "loggedIn", user: username});
    });

    socket.on('getAllChatPartners', function(sender, reciever) {
        socket.emit('messageResponse', { data: GetMessagesForChat(50, sender, reciever) });
    });

    socket.on('storeNewUser', function(data){
        var generatedSessionID = generateSessionID();
        insertUser(data.username, data.telNR);
        console.log("Recieved nr and session id: " + data.telNR + " " + generatedSessionID + " " + data.username);
        socket.emit('userNowRegistered', generatedSessionID);
    });

    socket.on('sendNewMessage', function(to, message) {
        console.log("Recieved: " + message);
        console.log("Emitting to: " + getSocketIDfromGID(to));
        io.to(getSocketIDfromGID(to)).emit('thread', message);
    });

    socket.on('disconnectUser', function(socket){
        removeSocket(socket);
        console.log("User went offline. ");
    });
});

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

function generateSessionID() {
    var sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    return sha.digest('hex');
};

// ALL DB METHODS
function insertUser(_username, _phonenumber) {

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var myobj = { username: _username, phonenumber: _phonenumber };
        db.collection("user").insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("1 record inserted with values(" + _username + " " + _phonenumber + " inserted)");
            db.close();
        });
    });
}
//+
function insertmessage(_sender, _receiver, _type, _data) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var _timestamp = new Date().getTime();
        var myobj = { timestamp: _timestamp, Sender: _sender, Receiver: _receiver, Type: _type, Data: _data };
        db.collection("message").insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("1 record inserted");
            db.close();
        });
    });
}
//+
function insertgroup(_groupname, _members) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var myobj = { groupname: _groupname, members: _members };

        db.collection("chat_group").insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("1 record inserted");
            db.close();
        });
    });
}
//+
//***********************delete***********************
function deleteGroup(group_id) {
    var a = ObjectId(group_id);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        db.collection("chat_group").deleteOne({ _id: a }, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });
    });
}
//+
function deleteMessage(MesssageID) {
    var a = ObjectId(MesssageID);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection("message").deleteOne({ _id: a }, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });
    });
}
//+
function deleteUser(user_id) {
    var a = ObjectId(user_id);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection("user").deleteOne({ _id: a }, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });
    });
}
//+
//***********************update***********************
function updateUser(userId, newValues) {
    var a = ObjectId(userId);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        db.collection("user").updateOne({ _id: a }, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 record updated");
            db.close();
        });
    });
}
//+
function updateMessage(messageID, b) {
    var a = ObjectId(messageID);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        db.collection("message").updateOne({ _id: a }, b, function (err, res) {
            if (err) throw err;
            console.log("1 record updated");
            db.close();
        });
    });
}
//+
function updateGroup(groupID, newValues) {
    var a = ObjectId(groupID);
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        db.collection("chat_group").updateOne({ _id: a }, newValues, function (err, res) {
            if (err) throw err;
            console.log("1 record updated");
            db.close();
        });
    });
}
//+
//***********************others***********************

function GetMessagesForChat(NrOfMessagesToLoad, _sender, _receiver) {
    var messageObject = [];
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;

        var messageCount = 0;
        db.collection("message").find({}).toArray(function (err, result) {
            if (err) throw err;
            //console.log(result);
            result.forEach(function(element) {
                if (messageCount < NrOfMessagesToLoad) {
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
//-
function ForwardMessageTo(MessageID, newReceiver) {
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

