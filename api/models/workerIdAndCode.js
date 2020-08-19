const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkerIdAndCode = new Schema(
    {
        workerId: String,
        code: String
    }
);

module.exports = mongoose.model('workerIdAndCode', WorkerIdAndCode, 'workerIdAndCode' );