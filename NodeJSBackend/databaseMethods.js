var MongoClient = require('mongodb').MongoClient;
var mongoUri = "mongodb://localhost:27017/DA";
var ObjectId = require('mongodb').ObjectId; 

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