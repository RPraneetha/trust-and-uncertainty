const express = require('express');
const router = express.Router();
const winston = require( 'winston' );
require('winston-daily-rotate-file');

const transportInfo = new winston.transports.DailyRotateFile({
    filename: 'logfile-%DATE%.log',
    dirname: "../info/logs",
    datePattern: 'YYYY-MM-DD-HH',
    level:'info',
});

const transportError = new winston.transports.DailyRotateFile({
    filename: 'errorfile-%DATE%.log',
    dirname: "../error/logs",
    datePattern: 'YYYY-MM-DD-HH',
    level: 'error'
});

const logger = winston.createLogger({
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        transportInfo, transportError
    ],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple(),
    }));
}

logger.info('Log Server started');
logger.error('Log Server started');

router.post('/', function( req, res, next ) {
    logger.log( req.body.level.toLowerCase() || 'error',
        'Client: ' + req.body.message);
    return res.send( 'OK' );
});

module.exports = router;