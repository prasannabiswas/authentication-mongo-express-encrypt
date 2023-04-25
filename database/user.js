require("dotenv").config();
const m = require("mongoose");
const encrypt = require("mongoose-encryption");

const userSchema = new m.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Encryption process
userSchema.plugin(encrypt, {
    secret: process.env.SECRET, 
    encryptedFields: ['password']
});

module.exports = m.model("User",userSchema);