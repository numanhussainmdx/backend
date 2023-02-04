
var express = require("express");

const propertiesReader = require("properties-reader");
var path = require("path");

const cors = require("cors");

const pp = path.resolve(__dirname, "config/db.properties");

const properties = propertiesReader(pp);
const prefix = properties.get("db.prefix");
const name = properties.get("db.name");
const username = properties.get("db.user");
const pass = properties.get("db.pwd");
const url = properties.get("db.url");
const param = properties.get("params");
const uri = prefix + username + ":" + pass + url + param;

const { MongoClient, ServerApiVersion, ObjectID, ObjectId } = require("mongodb");
const client = new MongoClient(uri, { serverApi: ServerApiVersion.v1 });
let db = client.db(name);

let app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
    res.send("Welcome to RestAPI <br> /api/&lt;collection name&gt;/&lt;specific id&gt;")
});

app.get("/api/:collection?/:id?", async function (req, res) {
    const { collection, id } = req.params;

    if (!collection & !id) res.send('Incomplete.! Which API you are calling? Hint: orders, lessons, users');
    else if (!id) {

        coll = db.collection(collection);

        const coll_obj = await coll.find({}).toArray(); //ObjectID
        res.send(coll_obj);

    }
    else {
        
        const ObjectId = require('mongodb').ObjectId;
        const mongodb_id = new ObjectId(id);

        coll = db.collection(collection);

        const coll_obj = await coll.find({_id:mongodb_id}).toArray(); 

        res.send(coll_obj);
    }

});

let nextId=1;

app.post("/api/:collection?", async function(req, res){
    
    const ObjectId = require('mongodb').ObjectId;
    const coll_obj = {
        _id: new ObjectId(),
        ...req.body,
        id:nextId
    };

    const { collection } = req.params;

    let coll = db.collection(collection);
    
    await coll.insertOne(coll_obj);

    res.send(coll_obj);

});

const port = process.env.PORT || 3000;

app.listen(port, function () {
    console.log("App is running");
});
