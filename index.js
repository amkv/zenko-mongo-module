'use strict'; // eslint-disable-line strict

const arsenal = require('arsenal');
const werelogs = require('werelogs');
const Memcached = require('memcached');


// var MongoClient = require("mongodb").MongoClient;
// var streamToMongoDB = require("stream-to-mongo-db").streamToMongoDB;
// // where the data will come from
// var inputDBConfig  = { dbURL : "mongodb://localhost:27017/yourInputDBHere", collection : "yourCollectionHere"  };
// // where the data will end up
// var outputDBConfig = { dbURL : "mongodb://localhost:27017/streamToMongoDB", collection : "devTestOutput" };




const logOptions = {
	"logLevel": "debug",
	"dumpLevel": "error"
};

const logger = new werelogs.Logger('Zenko-Memcached');

const MetadataFileServer = require('arsenal').storage.metadata.MetadataFileServer;

const mdServer = new MetadataFileServer({
	bindAddress: '0.0.0.0',
	port: 9990,
	path: '/tmp',
	restEnabled: false,
	restPort: 9999,
	recordLog: { enabled: false, recordLogName: 's3-recordlog' },
	versioning: { replicationGroupId: 'RG001' },
	log: logOptions
});

var memcached = new Memcached('localhost:11211', {
	retries:10,
	retry:10000,
	remove:true,
	failOverServers:['192.168.0.103:11211']
});

class MemcachedService extends arsenal.network.rpc.BaseService {
	constructor(params) {
		super(params);
	}
}

mdServer.initMetadataService = function() {
	const dbService = new MemcachedService({
		namespace: '/MDFile/metadata',
		logger: logger
	});

	this.services.push(dbService);

	dbService.registerAsyncAPI({
		put: (env, key, value, options, cb) => {
			cb(null);

			// const dbName = env.subLevel.join(SUBLEVEL_SEP);
			// memcached.get(dbName, (err, data) => {
			// if (err) {
			//  console.log(err);
			//  let db = {};
			//  db[key] = value;
			//  memcached.add(dbName, JSON.stringify(db), MEMCACHED_LIFETIME,
			//      (err) => {
			//        if (err) {
			//        console.log(err);
			//        cb(err);
			//        } else {
			//        cb(null);
			//        }
			//      });
			// } else {
			//  console.log(data);
			//  let db = JSON.parse(data);
			//  db[key] = value;
			//  memcached.replace(dbName, JSON.stringify(db), MEMCACHED_LIFETIME,
			//        (err) => {
			//        if (err) {
			//          console.log(err);
			//          cb(err);
			//        } else {
			//          cb(null);
			//        }
			//        });
			// }
			// });


			// MongoClient.connect(inputDBConfig.dbURL, function(error, db) {
			//  if(error) { throw error; }

			//  // create the writable stream
			//  var writableStream = streamToMongoDB(outputDBConfig);

			//  // create readable stream and consume it
			//  var stream = db.collection(inputDBConfig.collection).find().stream();

			//  stream.pipe(writableStream);

			//  stream.on("end", () => {
			//    console.log("done!");
			//    db.close();
			//  });
			// });
			console.log('put ---- ');
			// console.log('put:', ' env = ', env, ' key = ', key, ' val = ', value, ' options = ', options);
		},
		del: (env, key, options, cb) => {
			console.log('del');
		},
		get: (env, key, options, cb) => {
			console.log('get');
		},
		getDiskUsage: (env, cb) => {
			console.log('getDiskUsage');
		},
	});

	// dbService.registerSyncAPI({
	// 	createReadStream: (env, options) => env.subDb.createReadStream(options),
	// 	getUUID: () => this.readUUID(),
	// });
	dbService.registerSyncAPI({
		createReadStream: (env, options) => {
			console.log('createReadStream', ' env = ', env, ' options = ', options);
		},
		getUUID: () => this.readUUID(),
	});

	console.log('Hooks installed');
}

mdServer.startServer();

class MemcachedFileStore extends arsenal.storage.data.file.DataFileStore {
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
    }

    stat(key, log, callback) {
	console.log('data stat');
    }

    get(key, byteRange, log, callback) {
	console.log('data get');
    }

    delete(key, log, callback) {
	console.log('data delete');
    }

    getDiskUsage(callback) {
	console.log('data getDiskUsage');
    }
}


const dataServer = new arsenal.network.rest.RESTServer({
	bindAddress: '0.0.0.0',
	port: 9991,
	dataStore: new arsenal.storage.data.file.DataFileStore({
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
		console.log("!!!!!!rest server!!!!!!!!!");
	}
	dataServer.start();
});

console.log('TEST Zenko Memcached Plugin Initialized TEST');
