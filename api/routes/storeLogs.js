const express = require('express');
const router = express.Router();
const winston = require('winston');
const mongoose = require('mongoose');
const Logs = require('../models/logs');
require('winston-daily-rotate-file');
require('winston-mongodb');

const mongoDBUriDev = "mongodb://127.0.0.1:27017/local";
const mongoDBUri = process.env.MONGODB_URI || mongoDBUriDev;
mongoose.connect(mongoDBUri, { useNewUrlParser: true });

const db = mongoose.connection;
db.once('open', () => console.log('connected to the database'));
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const logger = winston.createLogger({
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.MongoDB({
                db: mongoDBUri,
                collection: "logs",
                name: "logs",
                level: "info"
            })
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

logger.info('Log Server started');

router.post('/', function( req, res ) {
    let logs = new Logs();

    const { level, workerId, message } = req.body;

    logs.level = level;
    logs.workerId = workerId;
    logs.message = message;

    logger.info( req.body.level.toLowerCase() || 'error',
        'Client: ' + req.body.message);

    logs.save((err) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    });
});

module.exports = router;