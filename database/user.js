require("dotenv").config();
const m = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
// const encrypt = require("mongoose-encryption");
const findOrCreate = require("mongoose-findorcreate");

const userSchema = new m.Schema({
    username: String,
    password:  String,
    googleId: String,
    secret: String
});

// Encryption process
// userSchema.plugin(encrypt, {
//     secret: process.env.SECRET, 
//     encryptedFields: ['password']
// });

// Passport process setup
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

module.exports = m.model("User",userSchema);