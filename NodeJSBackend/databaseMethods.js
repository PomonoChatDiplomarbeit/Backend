var MongoClient = require('mongodb').MongoClient;
var mongoUri = "mongodb://localhost:27017/DA";
var ObjectID = require('mongodb').ObjectId; 

exports.checkCredentials = function (user, callback) {
    try {
        MongoClient.connect(mongoUri, function (err, db) {
            if (err) throw err;
            db.collection("users").count({ username: user.username, pwd: user.pwd }, function (err, count) {
                if (err) throw err;
                if (count > 0) {
                    callback(true);
                } else {
                    callback(false);
                }
                db.close();
            });
        });
    } catch (error) {
        callback(false);
    }
}
exports.getRoomsForUser = function (username, callback) {
    try {
        MongoClient.connect(mongoUri, function (err, db) {
            if (err) throw err;
            db.collection("rooms").find({}).toArray(function (err, result) {
                if (err) throw err;
                
                var filtered = result.filter(e=>{
                    return e.members.some(f=>{
                        return f == username;
                    });
                });
                console.log(filtered);
                callback(filtered);
            });
        });
    } catch (error) {
        callback([]);
    }
}
exports.addMessageToRoom = function (message,roomID, callback) {
    try {
        MongoClient.connect(mongoUri, function (err, db) {
            if (err) throw err;
            myquery = { _id: ObjectID(roomID) };
            newvalues = {
                $push: {
                    messages: {
                        sender: message.sender,
                        type: message.type,
                        data: message.data
                    }
                }
            };

            db.collection("rooms").updateOne(myquery, newvalues, function (err, result) {
                if (err) throw err;
                callback();
            });
        });
    } catch (error) {
        callback('ERROR');
    }
}
exports.createRoom = function (roomName,users, callback) {
    try {
        MongoClient.connect(mongoUri, function (err, db) {
            if (err) throw err;
            var myobj = {
                name: roomName,
                members: users
            };
            db.collection("rooms").insertOne(myobj, function (err, insertresult) {
                if (err) throw err;
                callback();
            });
        });
    } catch (error) {
        callback('ERROR');
    }
}