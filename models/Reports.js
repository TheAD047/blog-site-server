const mongoose = require('mongoose')

const schemaDef = {
    blogID: {
        type: String,
        require: true
    },
    reportDescription: {
        type: String,
        require: true
    },
    reportedBy: {
        type: String,
        required: true
    }
}

const mongooseSchemaReport = new mongoose.Schema(schemaDef);

module.exports = mongoose.model("Report", mongooseSchemaReport);