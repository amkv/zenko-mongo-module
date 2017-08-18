'use strict'; // eslint-disable-line strict

const arsenal = require('arsenal');
const werelogs = require('werelogs');
const MongoClient = require('mongodb').MongoClient;
// const assert = require('assert');
const startMetaDataServer = require('./metadata')
const startDataServer = require('./data')

const SUBLEVEL_SEP = '::';
// var url = process.env.MONGO_LOCATION;

const logOptions = {
	"logLevel": "debug",
	"dumpLevel": "error"
};
const logger = new werelogs.Logger('Zenko-Mongo');

// create connection to database **********************************************
var url = 'mongodb://192.168.99.100:27017/mydb';
// var DBconnect = MongoClient.connect(url, function(err, db) {
//   if(!err) {
//     console.log("We are connected to MongoDB");
//     // console.log(db);
//     db.collection("users.bucket", function(err, res) {
//       if (err) throw err;
//       console.log("Collection created!");
//     });
//     db.close();
//   }
//   else {
//       console.log("Bad connection to MongoDB");
//   }
// });
// ****************************************************************************

// console.log('----------------------------------------\n', DBconnect, '----------------------------------------\n');

startDataServer(logger, logOptions, url);
startMetaDataServer(logger, logOptions, url);
console.log('TEST Zenko Mongo Plugin Initialized');
