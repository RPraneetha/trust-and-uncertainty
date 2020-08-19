const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const WorkerIdAndCode = require('../models/workerIdAndCode')

const mongoDBUriDev = "mongodb://127.0.0.1:27017/local";
const mongoDBUri = process.env.MONGODB_URI || mongoDBUriDev;
mongoose.connect(mongoDBUri, { useNewUrlParser: true });

const db = mongoose.connection;
db.once('open', () => console.log('connected to the database'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

router.post('/', function( req, res ) {
    let workerIdAndCode = new WorkerIdAndCode();

    const { workerId, code } = req.body;

    workerIdAndCode.workerId = workerId;
    workerIdAndCode.code = code;

    workerIdAndCode.save((err) => {
        if (err)
            return res.json({ success: false, error: err });
        return res.sendStatus(200);
    });
});

module.exports = router;