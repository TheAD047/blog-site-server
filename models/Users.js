const mongoose = require('mongoose')
const plm = require('passport-local-mongoose')

const schemaDef = {
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
}

const mongooseSchemaUser = new mongoose.Schema(schemaDef);

mongooseSchemaUser.plugin(plm);

module.exports = mongoose.model("User", mongooseSchemaUser);