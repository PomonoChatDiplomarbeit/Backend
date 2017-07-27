var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/diplom";
var ObjectId = require('mongodb').ObjectId; 

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
//updateUser();                                           --  var a = ObjectId(group_id)
//ForwardMessageTo("596df46209b96a2ddca1fef4", "444");    -- db.collection("chat_group").findOne({ _id: a }, function (err, result) { 

//deleteUser("596defef2b532b3420d2239d");

//insertUser("Dragan", 32432431);
//insertmessage(222, 111, "Text", "Dere");
//insertgroup("Bangers", a);
//var b = GetMessagesForChat(2, 111, 222);
//console.log(b);
//ForwardMessageTo("596df46209b96a2ddca1feee", 333);

//addUserToGroup("1", "596df2abb8ed8037a8c1452c");

//removeUserFromGroup("1", "596df2abb8ed8037a8c1452c");


//deleteGroup("596df11b98e81937809f94e0");

//deleteGroup("596f0a83e1fa953584c28a23");
//deleteMessage("596e01b6a0a1c90fc81368f8");
//deleteUser("596dea31b3f702dc102ce116");
//updateUser("596e04090c91a32d2c1b2465");
//updateMessage("596e051e5ac75f303854b7d1", { Sender: "Bitchga", Receiver: "Canyon 123" });

console.log(SearchUser("32432431"));
//console.log(checkUsers(1112));
//console.log(b);


//***********************insert***********************
function insertUser(_username, _phonenumber) {

    var check ;
    check  = checkUsers(_phonenumber);
    console.log(check);
    if (check == false) {
        console.log("User is already inserted")

    } else if (check == true) {

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

    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
 
        var j = 0;
        db.collection("message").find({}).toArray(function (err, result) {
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                if (j < NrOfMessagesToLoad) {
                    if ((result[i].Sender == _sender && result[i].Receiver == _receiver) || (result[i].Sender == _receiver && result[i].Receiver == _sender)) {
                        
                        j++;
                    }
                }

            }
            res = result;
            return res;
            db.close();
        });

        
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

