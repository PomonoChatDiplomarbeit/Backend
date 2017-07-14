var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://127.0.0.1:27017/player";

MongoClient.connect(url, function (err, db) {
    if (err) throw err;
    db.collection("player").find({}).toArray(function (err, result) {
        if (err) throw err;
        var a = result;
        console.log(a[2]);
       // console.log(result);
        db.close();
    });
});
