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

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', {title: 'Express'});
});

router.get('/getCode', function( req,   res ) {
  WorkerIdAndCode.findOne({workerId : {$exists : false }}, function(err, data) {
    if (err)
      return res.json({ success: false, error: err });
    return res.send(data);
  })
});

module.exports = router;