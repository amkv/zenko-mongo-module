const arsenal = require('arsenal');
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

function startDataServer(logger, logOptions, url)
{
    class MongoFileStore extends arsenal.storage.data.file.DataFileStore {
    	constructor(dataConfig, logApi) {
    		super(dataConfig, logApi);
    		console.log('filestore constructor');
    	}

    	setup(callback) {
    		console.log('data setup');
    		callback(null);
    	}

    	put(dataStream, size, log, callback) {
    		console.log('data put');
    		callback(null);
    	}

    	stat(key, log, callback) {
    		console.log('data stat');
    	}

    	get(key, byteRange, log, callback) {
    		console.log('data get');
    		callback(null, {'something':'nothing'});
    	}

    	delete(key, log, callback) {
    		console.log('data delete');
    	}

    	getDiskUsage(callback) {
    		console.log('data getDiskUsage');
    	}
    }

    class MongoRESTServer extends arsenal.network.rest.RESTServer {
    	constructor(params) {
    		super(params);
    	}
    	_onGet(req, res, log) {
    		console.log('data server get');
    		return undefined;
    	}
    	_onPut(req, res, log) {
    		console.log('data server put');
    		return undefined;
    	}
    }

    const dataServer = new MongoRESTServer({
    	bindAddress: '0.0.0.0',
    	port: 9991,
    	dataStore: new MongoFileStore({
    		dataPath: '/tmp',
    		log: logOptions
    	}),
    	log: logOptions
    });

    dataServer.setup(err => {
    	if (err) {
    		logger.error('Error initializing REST data server', { error: err });
    		return;
    	} else {
    		console.log('data server start');
    	}
    	dataServer.start();
    });
};

module.exports = startDataServer;
