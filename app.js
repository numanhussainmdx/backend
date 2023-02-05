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




const error = path.join(__dirname, 'errorlogs');
const accessLog = fs.createWriteStream(path.join(error, 'access.log'), { flags: 'a' });
app.use(morgan('combined', { stream: accessLogStream }));



app.get("/", function (req, res) {
    res.send("Welcome to RestAPI <br> /api/&lt;collection name&gt;/&lt;specific id&gt;")
});


app.get("/api/:collection?/:id?", async function (req, res) {
    const { collection, id } = req.params;

    if (!collection & !id) res.send('Incomplete.! Which API you are calling? Hint: orders, lessons, users');
    else if (!id) {

        coll = db.collection(collection);

        const coll_obj = await coll.find({}).toArray();
        res.send(coll_obj);

    } else {
        const ObjectId = require('mongodb').ObjectId;

        try {
            const mongodb_id = new ObjectId(id);  
            coll = db.collection(collection);

            const coll_obj = await coll.find({ _id: mongodb_id }).toArray();

            res.send(coll_obj);
        } catch (error) {
            res.send("Invalid Request string");
        }
    }
});



app.put("/api/:collection?/:id?", async function (req, res) {

    const { collection, id } = req.params;

    const ObjectId = require('mongodb').ObjectId;
    const mongodb_id = new ObjectId(id);


    let coll = db.collection(collection);
    const coll_obj = req.body;

    await coll.updateOne({ _id: mongodb_id }, { $set: coll_obj });
    res.send(coll_obj);

});


app.get("/api/find/:collection?/:key?", async function (req, res) {
    const { collection, key } = req.params;

    if (!collection) res.send("Filter Keys not defined");
    else if (collection & !key) { 
        res.send("Filter Keys not defined"); 
    }
    else {
        coll = db.collection(collection);

        const coll_obj = await coll.find({}).toArray();
        const filtered_coll_obj = coll_obj.filter(doc => doc.name.toLowerCase().includes(key.toLowerCase()));

        res.send(filtered_coll_obj);
    }
});


app.get("/api/sort/:collection?/:key?/:order?", async function (req, res) {

    const { collection, key, order } = req.params;
    coll = db.collection(collection);


    if (!collection && !key) res.send("Sorting not prpper");
    else if (!key) res.send("Filter Keys not defined");
    else if (!order) {
        const coll_obj = await coll.find({}).sort({ [key]: 1 }).toArray();
        res.send(coll_obj);
    }
    else if (order === "1") {
        const coll_obj = await coll.find({}).sort({ [key]: 1 }).toArray();
        res.send(coll_obj);
    }
    else if (order === "-1") {
        const coll_obj = await coll.find({}).sort({ [key]: -1 }).toArray();
        res.send(coll_obj);
    }

});


let nextId = 1;

app.post("/api/:collection?", async function (req, res) {

    const ObjectId = require('mongodb').ObjectId;
    const coll_obj = {
        _id: new ObjectId(),
        ...req.body,
        id: nextId
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