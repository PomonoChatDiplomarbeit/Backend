var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/diplom";
//MongoClient.connect(url, function (err, db) {
//  if (err) throw err;
//getFirstUser();
// insertUser("Sandro", 069917194186);
/*
insertmessage(111, 222, "Text", "hallo");
insertmessage(222, 111, "Text", "hallo,wie gehts");
insertmessage(111, 222, "Text", "gut dir?");
insertmessage(222, 111, "Text", "mir gehts auch gut");
insertmessage(111, 222, "Text", "cool");
insertmessage(222, 111, "Text", "heit a bierle?");
insertmessage(111, 222, "Text", "1?");
insertmessage(222, 111, "Text", "ok 12 :)");
*/
//insertmessage(4444, 55555, "Text", "bitte");
var a = [12341234, 123414];
//insertgroup("Team D",a)
// var b = GetMessagesForChat(100, 111, 222);
//console.log("********");
 //console.log(b);
//deleteUser();
//updateUser();
//ForwardMessageTo("596df46209b96a2ddca1fef4", "444");

//deleteUser("596defef2b532b3420d2239d");

//insertUser("Dragan", 32432431);
//insertmessage(222, 111, "Text", "Dere");
//insertgroup("Bangers", a);
//var b = GetMessagesForChat(2, 111, 222);
//console.log(b);
ForwardMessageTo("596df46209b96a2ddca1feee", 333);
function deleteUser(_uid) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var myquery = { "_id": _uid };
        db.collection("user").deleteOne(myquery, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });
    });
}

function updateUser() {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var myquery = { name: "Pascal Dupuis" };
        var newvalues = { name: "Mickey Schwanz" };
        db.collection("player").updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 record updated");
            db.close();
        });
    });
}

function insertUser(_username, _phonenumber) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var myobj = { username: _username, phonenumber: _phonenumber };
        db.collection("user").insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("1 record inserted");
            db.close();
        });
    });

}

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

function GetMessagesForChat(NrOfMessagesToLoad, _sender, _receiver) {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var res;
        var j = 0;
        db.collection("message").find({}).toArray(function (err, result) {
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                if (j < NrOfMessagesToLoad) {
                    if ((result[i].Sender == _sender && result[i].Receiver == _receiver) || (result[i].Sender == _receiver && result[i].Receiver == _sender)) {
                        console.log(result[i]);
                        j++;
                    }
                }
                
            }
            res = result;
            db.close();
        });

        return res;
    });
}

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

