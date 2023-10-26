var express = require("express");
var app = express();

let data=[];

const fs = require("fs");
const serverSideStorage = "../data/db.json";

fs.readFile(serverSideStorage, function(err, buf) {
    if (err) {
        console.log("error: ", err);
    } else {
        data = JSON.parse(buf.toString());
        if (data.length != 0) {
            counter = data[data.length - 1];
        }
    }
    console.log("Data read from file.");
});

function saveToServer() {
    fs.writeFile(serverSideStorage, JSON.stringify(data), function(err, buf) {
        if (err) {
            console.log("error ", err);
        } else {
            console.log("Data saved successfully");
        }
    })
}

var counter = 0;

app.use("/static", express.static("public"));

// query params
app.get("/hello", function(req, res) {
    let name = req.query.name;
    let age = req.query.age;
    res.send("<h1>Hello " + name + "!</h1>" + "You are " + age + " years old!");
})

app.get("/goodbye", function(req, res) {
    res.send("<h1>Goodbye Express</h1>");
})

// route params
app.get("/users/:username", function(req, res) {
    let username = req.params.username;
    res.send("<h1>Profile for " + username + "</h1>");
})

app.set("views", "./views");
app.set("view engine", "pug");

app.get("/pug/", function (req, res) {
    let array=[
        {name: "Jason"},
        {name: "Eliza"},
        {name: "Dave"}
    ]
    res.render("index", {title: "Hey", message: "Hello there!", arr: array});
})

app.get("/pug/hello", function (req, res) {
    res.render("hello", {title: "Hello button!", count: counter});
});

var bodyParser = require("body-parser");
app.use("/pug/hello", bodyParser.urlencoded({extended: false}));


app.post("/pug/hello", function (req, res) {
    console.log(req.body);
    counter = req.body.count || counter;
    data.push(counter);
    saveToServer(data);

    res.render("hello", {title: "Hello button!", count: counter});
});

app.get("/pug/history", function (req, res) {
    res.render("history", {title: "Count Hisotry", data: data});
});

app.listen(3000);