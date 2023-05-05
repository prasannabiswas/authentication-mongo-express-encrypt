const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const ejs = require("ejs");
require("dotenv").config();
// const md5 = require("md5");
// const bcrypt = require("bcrypt");
// const saltRounds = 10;
const session = require("express-session");
const passport = require("passport");

const User = require("./database/user");

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
app.set('view engine','ejs');

// Cookies setup for express-session 
app.use(session({
    secret: "ourlittlesecret.",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

/////////MONGODB CONNECTION SETUP/////////////
mongoose.connect(process.env.LOCALDB_URI, { 
    useNewUrlParser: true
})
.then(()=>console.log(`Connected to userDB`))
.catch((err)=>console.log(err));

// mongoose.set("useCreateIndex", true);

// Cookies setup for express-session 
passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
 
//////////HOME ROUTE///////////
app.route("/")
    .get((req,res)=> {
        res.render("home");
    });

//////////LOGIN ROUTE///////////
// app.route("/login")
//     .get((req,res)=>{
//         res.render("login");        
//     })
//     .post((req,res)=>{
//         User.findOne({username: req.body.username})
//         .then((foundUser)=>{
//             if(foundUser){
//                 // if(foundUser.password === md5(req.body.password)){
//                 //     res.render("secrets");
//                 // }
//                 bcrypt.compare(req.body.password,foundUser.password,(err,result)=>{
//                     if(result === true){
//                         res.render("secrets");
//                     }
//                 });
//             }
//             else{
//                 res.redirect("/register");
//                 // res.render(`User is not registered yet.`);
//                 // setTimeout(()=>{
//                 //     res.redirect("/register");
//                 // },1000);
//             }
//         })
//         .catch((err)=>console.log(err));
//     });

// //////////REGISTER ROUTE///////////
// app.route("/register")
//     .get((req,res)=>{
//         res.render("register");
//     })
//     .post((req,res)=>{   
//         // bcrypt and salting method
//         bcrypt.hash(req.body.password, saltRounds, (err,hash)=>{
//             const newUser = new User({
//                 username: req.body.username,
//                 password: hash
//             });
//             newUser.save()
//             .then(()=>console.log(`${req.body.username} added successfully to userDB.`))
//             .catch((err)=>console.log(err));
//             res.render("secrets");
//         });    
//         User.findOne({username: req.body.username})
//         .then((foundUser)=>{
//             if(foundUser){
//                 res.redirect("/login");
//                 // res.send(`User already exist.`);                
//                 // const loginTimeoutRedirect = setTimeout(()=>{
//                 //     res.redirect("/login");
//                 // },1000);
//                 // loginTimeoutRedirect();
//             }
//             // else{
//             //     const newUser = new User({
//             //         username: req.body.username,
//             //         password: md5(req.body.password)
//             //     });
//             //     newUser.save()
//             //     .then(()=>console.log(`${req.body.username} added successfully to userDB.`))
//             //     .catch((err)=>console.log(err));
//             //     res.render("secrets");
//             // }
//         })
//         .catch((err)=>console.log(err));
        
//     });



////////////COOKIES REGISTER SETUP CODE////////
app.route("/login")
    .get((req,res)=>{
        res.render("login");
    })
    .post((req,res)=>{
        const user = new User ({
            username: req.body.username,
            password: req.body.password 
        }) 
        req.login(user, (err)=>{
            if(err) {
                console.log(err);
                res.redirect("/login");
            }
            else{
                passport.authenticate("local")(req,res, ()=>{
                    res.redirect("/secrets");
                });
            }
        })       
    });

app.route("/secrets")
    .get((req,res)=>{
        if(req.isAuthenticated()){
            res.render("secrets");
        }
        else{
            res.redirect("/login");
        }    
    });

app.route("/register")
    .get((req,res)=>{
       res.render("register"); 
    })
    .post((req,res)=>{
        User.register({username: req.body.username},req.body.password,(err,user)=>{
            if(err){
                console.log(err);
                res.redirect("/register");
            }
            else{
                passport.authenticate("local")(req,res, ()=>{
                    console.log("authenticate successful");
                    res.redirect("/secrets");
                });
            }
        });
    });

app.route("/logout")
    .get((req,res)=>{
        req.logout((err)=>{
            if(err) console.log(err);
            else res.redirect("/");
        });        
    });

app.listen(3000,()=>{
    console.log(`Server running on PORT:3000`);
});