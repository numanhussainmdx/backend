var express = require("express");

let app = express();

app.get("/",function(req,res){
    res.send("response coming from / root")
});

app.listen(3000,function(){
    console.log("App is running");
});