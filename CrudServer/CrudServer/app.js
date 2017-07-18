var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/diplom";
MongoClient.connect(url, function (err, db) {
    if (err) throw err;
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
    var a = [12341234, 123414];
    //insertgroup("Team D",a)
    //GetMessagesForChat(1, 111,222);
    //deleteUser();
    //updateUser();
    ForwardMessageTo("596df46209b96a2ddca1fef5" , "asaf");

    function getFirstUser() {
   
        db.collection("user").find({}).toArray(function (err, result) {
            if (err) throw err;
            var a = result;
            console.log(a);
            // console.log(result);
            db.close();
        });
    

    }
    function deleteUser() {

        var myquery = { name: 'Maxim Lapierre' };
        db.collection("player").deleteOne(myquery, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });

    }

    function updateUser() {
        var myquery = { name: "Pascal Dupuis" };
        var newvalues = { name: "Mickey Schwanz" };
        db.collection("player").updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 record updated");
            db.close();
        });
    }

    function insertUser(_username,_phonenumber) {
  
        var myobj = { username: _username, phonenumber: _phonenumber };
        db.collection("user").insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("1 record inserted");
            db.close();
        });
    

    }

    function insertmessage(_sender, _receiver, _type, _data) {
        var _timestamp = new Date().getTime();
        var myobj = { timestamp: _timestamp, Sender: _sender, Receiver: _receiver, Type: _type, Data: _data };
        db.collection("message").insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("1 record inserted");
            db.close();
        });
    }

    function insertgroup(_groupname, _members) {
        var myobj = { groupname: _groupname, members: _members };

        db.collection("chat_group").insertOne(myobj, function (err, res) {
            if (err) throw err;
            console.log("1 record inserted");
            db.close();
        });
    }

    function GetMessagesForChat(NrOfMessagesToLoad,_sender,_receiver) {
        db.collection("message").find({}).toArray(function (err, result) {
            if (err) throw err;
            for (var i = 0; i < result.length; i++) {
                if ((result[i].Sender == _sender && result[i].Receiver == _receiver) || (result[i].Sender == _receiver && result[i].Receiver == _sender)) {
                    console.log(result[i]);
                }
            }
            db.close();
        });
    }
    
    function ForwardMessageTo(MessageID, newReceiver) {
        db.collection("message").find({ "_id": MessageID}).toArray(function (err, result) {
            if (err) throw err;
            var a = result;
            console.log(a[0].Data);
            // console.log(result);
            db.close();
        });
    }

   
});