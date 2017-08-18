'use strict'; // eslint-disable-line strict

const arsenal = require('arsenal');
const werelogs = require('werelogs');
const startMetaDataServer = require('./metadata')
const startDataServer = require('./data')

const logOptions = {
	"logLevel": "debug",
	"dumpLevel": "error"
};
const logger = new werelogs.Logger('Zenko-Mongo');

var url = 'mongodb://192.168.99.100:27017/zenko';

startDataServer(logger, logOptions, url);
startMetaDataServer(logger, logOptions, url);

console.log('TEST Zenko Mongo Plugin Initialized');
