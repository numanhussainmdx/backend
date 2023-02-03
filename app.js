var express = require("express");

let app = express();

app.get("/",function(req,res){
    res.send("response coming from / root")
});

const port = process.env.PORT || 3000;

app.listen(port,function(){
    console.log("App is running");
});