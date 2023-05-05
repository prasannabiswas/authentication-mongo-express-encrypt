require("dotenv").config();
const m = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
// const encrypt = require("mongoose-encryption");

const userSchema = new m.Schema({
    username: {
        type: String,
        required: true
    }
    // password: {
    //     type: String,
    //     required: true
    // }
});

// Encryption process
// userSchema.plugin(encrypt, {
//     secret: process.env.SECRET, 
//     encryptedFields: ['password']
// });

// Passport process setup
userSchema.plugin(passportLocalMongoose);

module.exports = m.model("User",userSchema);