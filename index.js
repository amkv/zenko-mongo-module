'use strict'; // eslint-disable-line strict

const arsenal = require('arsenal');
const werelogs = require('werelogs');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

var url = 'mongodb://192.168.99.100:27017/test';


// MongoClient.connect(url, function(err, db) {
// 	if (err) {
// 		console.log("err mongo connection");
// 	} else {
// 		console.log("db connected");
// 	}


  // Create a collection we want to drop later
  // var col = db.collection('listCollectionsExample1');
  // Insert a bunch of documents
  // col.insert([{a:1, b:1}, {a:2, b:2}, {a:3, b:3}, {a:4, b:4}], {w:1}, function(err, result) {
		// test.equal(null, err);
	// List the database collections available
		// db.listCollections().toArray(function(err, items) {
		// test.equal(null, err);
		// console.log("db = ", db);


// 	db.close();
// });


// var streamToMongoDB = require("stream-to-mongo-db").streamToMongoDB;
// // where the data will come from
// var inputDBConfig  = { dbURL : "mongodb://localhost:27017/yourInputDBHere", collection : "yourCollectionHere"  };
// // where the data will end up
// var outputDBConfig = { dbURL : "mongodb://localhost:27017/streamToMongoDB", collection : "devTestOutput" };


// // Connect using MongoClient
// MongoClient.connect(url, function(err, db) {
//   // Create a collection we want to drop later
//   var col = db.collection('listCollectionsExample1');
//   // Insert a bunch of documents
//   col.insert([{a:1, b:1}
//     , {a:2, b:2}, {a:3, b:3}
//     , {a:4, b:4}], {w:1}, function(err, result) {
//     test.equal(null, err);
// // List the database collections available
// db.listCollections().toArray(function(err, items) {
//   test.equal(null, err);
//   db.close();
// });
//   });
// });



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

// var memcached = new Memcached('localhost:11211', {
// 	retries:10,
// 	retry:10000,
// 	remove:true,
// 	failOverServers:['192.168.0.103:11211']
// });

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
			// console.log("env.sub = ", env.subLevel);
			// cb(null);
			// MongoClient.connect(url, function(err, db) {
			// 	if (err) {
			// 		console.log("err");
			// 	} else {
			// 		console.log("put db = ", db);
			// 	}
			  // Create a collection we want to drop later
			  // var col = db.collection('listCollectionsExample1');
			  // Insert a bunch of documents
			  // col.insert([{a:1, b:1}, {a:2, b:2}, {a:3, b:3}, {a:4, b:4}], {w:1}, function(err, result) {
					// test.equal(null, err);
				// List the database collections available
					// db.listCollections().toArray(function(err, items) {
					// test.equal(null, err);
					// console.log("db = ", db);
			// 	db.close();
			// });
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
			console.log('put ---- put ');
			// console.log('put:', ' env = ', env, ' key = ', key, ' val = ', value, ' options = ', options);
		},
		del: (env, key, options, cb) => {
			console.log('del');
		},
		get: (env, key, options, cb) => {
			console.log('get == ');

			// Connect using MongoClient

			// MongoClient.connect(url, function(err, db) {
			// 	assert.equal(null, err);
			// 	console.log("Connected correctly to server");

			// 	insertDocuments(db, function() {
			// 		db.close();
			// 	});
			// });

			MongoClient.connect(url, function(err, db) {
				assert.equal(null, err);
				console.log("Connected correctly to server");

				insertDocuments(db, function() {
					findDocuments(db, function() {
						db.close();
					});
				});
			});
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

var insertDocuments = function(db, callback) {
	// Get the documents collection
	var collection = db.collection('documents');
	// Insert some documents
	collection.insertMany([{a : 1}, {a : 2}, {a : 3}], function(err, result) {
		assert.equal(err, null);
		assert.equal(3, result.result.n);
		assert.equal(3, result.ops.length);
		console.log("Inserted 3 documents into the document collection");
		callback(result);
	});
}

var findDocuments = function(db, callback) {
	// Get the documents collection
	var collection = db.collection('documents');
	// Find some documents
	collection.find({}).toArray(function(err, docs) {
		assert.equal(err, null);
		console.log("Found the following records");
		console.log(docs)
		callback(docs);
	});
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

const dataServer = new arsenal.network.rest.RESTServer(
	{ bindAddress: '0.0.0.0',
	  port: 9991,
	  dataStore: new MemcachedFileStore(
		  { dataPath: '/tmp',
			log: logOptions }),
	  log: logOptions });

dataServer.setup(err => {
	if (err) {
		logger.error('Error initializing REST data server',
					 { error: err });
		return;
	}

	dataServer.start();
});

// class MemcachedFileStore extends arsenal.storage.data.file.DataFileStore {

//     constructor(dataConfig, logApi) {
// 	super(dataConfig, logApi);
// 	console.log('filestore constructor');
//     }

//     setup(callback) {
// 	console.log('data setup');
// 	callback(null);
//     }

//     put(dataStream, size, log, callback) {
// 	console.log('data put');
//     }

//     stat(key, log, callback) {
// 	console.log('data stat');
//     }

//     get(key, byteRange, log, callback) {
// 	console.log('data get');
//     }

//     delete(key, log, callback) {
// 	console.log('data delete');
//     }

//     getDiskUsage(callback) {
// 	console.log('data getDiskUsage');
//     }
// }


// const dataServer = new MemcachedFileStore({
// 	bindAddress: '0.0.0.0',
// 	port: 9991,
// 	dataStore: new arsenal.storage.data.file.DataFileStore({
// 		dataPath: '/tmp',
// 		log: logOptions
// 	}),
// 	log: logOptions
// });



// dataServer.setup(err => {
// 	if (err) {
// 		logger.error('Error initializing REST data server', { error: err });
// 		return;
// 	} else {
// 		console.log("!!!!!!rest server!!!!!!!!!");
// 	}
// 	dataServer.start();
// });

console.log('TEST Zenko Memcached Plugin Initialized TEST');
