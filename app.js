var express = require("express");
var app = express();
var port = 3000;
var mongoose = require("mongoose");


var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json({
    type: ['application/json', 'text/plain']
}))
var nameSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    dob: String,
    country: String,
});

var User = mongoose.model("User", nameSchema);

mongoose.Promise = global.Promise;mongoose.connect("mongodb://localhost:27017/");

// app.use("/", (req, res) => {
//     res.sendFile(__dirname + "/index.html");
// });

var getIP = require('ipware')().get_ip;
var geoCountryIp = require('geoip-country');

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

function parseIP(req) {
    return getIP(req).clientIp;
}


function getCountryFromIp(ip) {
    try {
        return geoCountryIp.lookup(ip).country;
    }
    catch (err) {
        return "India"
    }

}

app.post("/save", (req, res) => {
    console.log(req.body)
    var myData = new User(req.body);
    myData.save()
        .then(item => {
            res.send("item saved to database");
        })
        .catch(err => {
            res.status(400).send("unable to save to database");
        });
});

app.get("/list", (req, res) => {

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("admin");
        dbo.collection("users").find({}).toArray(function(err, result) {
            if (err) throw err;
            result = result.map( r => {
                return  {
                    firstName: r.firstName,
                    lastName: r.lastName,
                    email: r.email,
                    country: r.country,
                    dob: r.dob,
                }
            })
            res.status(200).send(result)

            db.close();
        });
    });
});

app.get("/getProfile", (req, res) => {

    var email = req.query.email
    console.log(email)
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("admin");
        var query = { email: email }

        dbo.collection("users").find(query).toArray(function(err, result) {
            if (err) throw err;
            console.log(result);
            result = result.map( r => {
                return  {
                    firstName: r.firstName,
                    lastName: r.lastName,
                    email: r.email,
                    country: r.country,
                    dob: r.dob,
                }
            })
            res.status(200).send(result)
            db.close();
        });
    });

});

app.listen(port, () => {
    console.log("Server listening on port " + port);
});
