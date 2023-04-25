const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
require("dotenv").config();

const User = require("./database/user");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

/////////MONGODB CONNECTION SETUP/////////////
mongoose.connect(process.env.LOCALDB_URI, {
    useNewUrlParser: true
})
.then(()=>console.log(`Connected to userDB`))
.catch((err)=>console.log(err));
 
//////////HOME ROUTE///////////
app.route("/")
    .get((req,res)=> {
        res.render("home");
    });

//////////LOGIN ROUTE///////////
app.route("/login")
    .get((req,res)=>{
        res.render("login");        
    })
    .post((req,res)=>{
        User.findOne({email: req.body.username})
        .then((foundUser)=>{
            if(foundUser){
                if(foundUser.password === req.body.password){
                    res.render("secrets");
                }
            }
            else{
                res.redirect("/register");
                // res.render(`User is not registered yet.`);
                // setTimeout(()=>{
                //     res.redirect("/register");
                // },1000);
            }
        })
        .catch((err)=>console.log(err));
    });

//////////REGISTER ROUTE///////////
app.route("/register")
    .get((req,res)=>{
        res.render("register");
    })
    .post((req,res)=>{       
        User.findOne({email: req.body.username})
        .then((foundUser)=>{
            if(foundUser){
                res.redirect("/login");
                // res.send(`User already exist.`);                
                // const loginTimeoutRedirect = setTimeout(()=>{
                //     res.redirect("/login");
                // },1000);
                // loginTimeoutRedirect();
            }
            else{
                const newUser = new User({
                    email: req.body.username,
                    password: req.body.password
                });
                newUser.save()
                .then(()=>console.log(`${req.body.username} added successfully to userDB.`))
                .catch((err)=>console.log(err));
                res.render("secrets");
            }
        })
        .catch((err)=>console.log(err));
        
    });

app.listen(3000,()=>{
    console.log(`Server running on PORT:3000`);
});