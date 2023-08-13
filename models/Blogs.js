const mongoose = require('mongoose');

const schemaDef = {
    heading: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now()
    }
}

const mongooseSchemaBlog = new mongoose.Schema(schemaDef);

module.exports = mongoose.model("Blog", mongooseSchemaBlog);