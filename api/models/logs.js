const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LogsSchema = new Schema(
    {
        timestamp: String,
        level: String,
        workerId: String,
        message: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('logs', LogsSchema );