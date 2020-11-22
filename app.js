//jshint esversion:6
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const bcrypt = require("bcrypt"); 
const saltRounds = 10;

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/secretsApp", {useNewUrlParser: true ,useUnifiedTopology: true });

const userSchema = new mongoose.Schema ({
    email: String,
    password: String,
});

const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", async (req,res) => {
    bcrypt.hash(req.body.password, saltRounds, (hash) => {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save( err => {
            if (err){
                console.log(err);
            }
            else {
                res.render("secrets");
            }
        });
    });
});

app.post("/login", (req, res) => {
    User.findOne({email: req.body.username}, (err, user) => {
        if (err) {
            console.log(err);
        }
        else if (user){
            bcrypt.compare(req.body.password, user.password, (result) => {
                if (result)
                    res.render("secrets");
                else
                    console.log("Invalid password");
            });
        }
        else {
            console.log("Invalid UserName");
        }
    })
});

app.listen(3000, () => {
    console.log("Running on port 3000....");
})