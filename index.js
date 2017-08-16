'use strict'; // eslint-disable-line strict

const arsenal = require('arsenal');
const werelogs = require('werelogs');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const SUBLEVEL_SEP = '::';

var url = 'mongodb://192.168.99.100:27017/test';
// var url = process.env.MONGO_LOCATION;


const logOptions = {
	"logLevel": "debug",
	"dumpLevel": "error"
};

const logger = new werelogs.Logger('Zenko-Mongo');

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

class MongoService extends arsenal.network.rpc.BaseService {
	constructor(params) {
		super(params);
	}
}

mdServer.initMetadataService = function() {
	const dbService = new MongoService({
		namespace: '/MDFile/metadata',
		logger: logger
	});

	this.services.push(dbService);

	dbService.registerAsyncAPI({
		put: (env, key, value, options, cb) => {
			// const collName = env.subLevel.join(SUBLEVEL_SEP);
			console.log('--put--');
			console.log('key == ', key);
			console.log('val == ', value);
			cb(null, {'something':'nothing'});

			// if (key === 'users..bucket') {
			// 	key = 'usersbucket';
			// }


			// MongoClient.connect(url, function(err, db) {
			// 	assert.equal(null, err);
			// 	console.log("Connected correctly to server");

			// 	db.listCollections({name: key}).next(function(err, collinfo) {
			// 		if (collinfo) {
			// 			// The collection exists

			// 			console.log("collinfo = ", collinfo);
			// 			// let data = JSON.parse(collinfo);
			// 			// [key] = value;
			// 			// memcached.replace(dbName, JSON.stringify(db), MEMCACHED_LIFETIME, (err) => {
			// 			// 	if (err) {
			// 			// 		console.log(err);
			// 			// 		cb(err);
			// 			// 	} else {
			// 			// 		cb(null);
			// 			// 	}
			// 			// });


			// 		} else {

			// 			console.log(err);
			// 			let data = {};
			// 			data[key] = value;
			// 			console.log(data);

			// 			MongoClient.connect(url, function(err, db) {
			// 				assert.equal(null, err);
			// 				console.log("Connected correctly to server");

			// 				insertDocuments(db, data, function() {
			// 					findDocuments(db, function() {
			// 						db.close();
			// 					});
			// 				});
			// 			});
			// 	// 		memcached.add(dbName, JSON.stringify(db), MEMCACHED_LIFETIME, (err) => {
			// 	// 			if (err) {
			// 	// 				console.log(err);
			// 	// 				cb(err);
			// 	// 			} else {
			// 	// 				cb(null);
			// 	// 			}
			// 	// 		});

			// 		}

			// 	});

				// db.close();
			// });

			// memcached.get(dbName, (err, data) => {
			// 	if (err) {
			// 		console.log(err);
			// 		let db = {};
			// 		db[key] = value;
			// 		memcached.add(dbName, JSON.stringify(db), MEMCACHED_LIFETIME, (err) => {
			// 			if (err) {
			// 				console.log(err);
			// 				cb(err);
			// 			} else {
			// 				cb(null);
			// 			}
			// 		});
			// 	} else {
			// 		console.log(data);
			// 		let db = JSON.parse(data);
			// 		db[key] = value;
			// 		memcached.replace(dbName, JSON.stringify(db), MEMCACHED_LIFETIME, (err) => {
			// 			if (err) {
			// 				console.log(err);
			// 				cb(err);
			// 			} else {
			// 				cb(null);
			// 			}
			// 		});
			// 	}
			// });
			// console.log('put:', ' env = ', env, ' key = ', key, ' val = ', value, ' options = ', options);
		},
		del: (env, key, options, cb) => {
			console.log('del');
		},
		get: (env, key, options, cb) => {
			console.log('get == get');
			console.log('key == ', key);
			cb(null, {'something':'nothing'});

			// if (key === 'users..bucket') {
			// 	key = 'usersbucket';
			// }

			// MongoClient.connect(url, function(err, db) {
			// 	assert.equal(null, err);
			// 	console.log("Connected correctly to server");

			// 	db.listCollections({name: key}).next(function(err, collinfo) {
			// 		if (collinfo) {
			// 			// The collection exists

			// 			console.log("collinfo = ", collinfo);
			// 			// cb(null, db[key])
			// 			// let data = JSON.parse(collinfo);
			// 			// [key] = value;
			// 			// memcached.replace(dbName, JSON.stringify(db), MEMCACHED_LIFETIME, (err) => {
			// 			// 	if (err) {
			// 			// 		console.log(err);
			// 			// 		cb(err);
			// 			// 	} else {
			// 			// 		cb(null);
			// 			// 	}
			// 			// });


			// 		} else {

			// 			console.log(err);
			// 			db.createCollection(key, function(err, collection){
			// 				if (err) {
			// 					console.log(err);
			// 				} else {
			// 					console.log("Created ", key, " collection");
		 // 						console.log(collection);
			// 				}


		 // 					// cb(null, collection);
			// 			});

			// 			// let data = {};
			// 			// data[key] = value;
			// 			// console.log(data);

			// 			// MongoClient.connect(url, function(err, db) {
			// 			// 	assert.equal(null, err);
			// 			// 	console.log("Connected correctly to server");

			// 			// 	insertDocuments(db, data, function() {
			// 			// 		findDocuments(db, function() {
			// 			// 			db.close();
			// 			// 		});
			// 			// 	});
			// 			// });
			// 	// 		memcached.add(dbName, JSON.stringify(db), MEMCACHED_LIFETIME, (err) => {
			// 	// 			if (err) {
			// 	// 				console.log(err);
			// 	// 				cb(err);
			// 	// 			} else {
			// 	// 				cb(null);
			// 	// 			}
			// 	// 		});

			// 		}

			// });

			// db.close();
		// });


	 //    memcached.get(dbName, (err, data) => {
		// if (err) {
		//     console.log(err);
		// } else {
		//     console.log(data);
		//     let db = JSON.parse(data);
		//     cb(null, db[key])
		// }
	 //    });



			// MongoClient.connect(url, function(err, db) {
			// 	assert.equal(null, err);
			// 	console.log("Connected correctly to server");

			// 	insertDocuments(db,  function() {
			// 		findDocuments(db, function() {
			// 			db.close();
			// 		});
			// 	});
			// });
		},
		getDiskUsage: (env, cb) => {
			console.log('getDiskUsage');
		},
	});

	dbService.registerSyncAPI({
		createReadStream: (env, options) => {
			// env.subDb.createReadStream(options);
			console.log('createReadStream', ' env = ', env, ' options = ', options);
		},
		getUUID: () => this.readUUID(),
	});

	console.log('Hooks installed');
}

var insertDocuments = function(db, data, callback) {
	// Get the documents collection
	var collection = db.collection('documents');
	// Insert some documents
	// collection.insertMany([{a : 1}, {a : 2}, {a : 3}], function(err, result) {
	collection.insertOne(data, function(err, result) {
		assert.equal(err, null);
		console.log("Inserted 1 documents into the document collection");
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


console.log('TEST Zenko Mongo Plugin Initialized');

// initMetadataService() {
//     // all metadata operations executed by leveldb go through the
//     // /metadata namespace
//     const namespace = `${constants.metadataFileNamespace}/metadata`;
//     this.logger.info(`creating metadata service at ${namespace}`);
//     this.rootDb = sublevel(level(`${this.path}/${ROOT_DB}`));
//     const dbService = new levelNet.LevelDbService({
//         rootDb: this.rootDb,
//         namespace,
//         logger: this.logger,
//     });
//     this.services.push(dbService);



//     /* provide an API compatible with MetaData API */
//     const metadataAPI = {
//         get: (request, logger, callback) => {
//             const dbPath = request.db.split(SUBLEVEL_SEP);
//             const subDb = dbService.lookupSubLevel(dbPath);
//             subDb.get(request.key, (err, data) => {
//                 if (err && err.notFound) {
//                     return callback(errors.ObjNotFound);
//                 }
//                 return callback(err, data);
//             });
//         },
//         list: (request, logger, callback) => {
//             const dbPath = request.db.split(SUBLEVEL_SEP);
//             const subDb = dbService.lookupSubLevel(dbPath);
//             const stream = subDb.createReadStream(request.params);
//             const res = [];
//             let done = false;
//             stream.on('data', data => res.push(data));
//             stream.on('error', err => {
//                 if (done === false) {
//                     done = true;
//                     callback(err);
//                 }
//             });
//             stream.on('end', () => {
//                 if (done === false) {
//                     done = true;
//                     callback(null, res);
//                 }
//             });
//         },
//         batch: (request, logger, callback) => {
//             const dbPath = request.db.split(SUBLEVEL_SEP);
//             const ops = request.array.map(
//                 op => Object.assign({}, op, { prefix: dbPath }));
//             if (this.recordLog.enabled) {
//                 this.recordLogService
//                     .withRequestParams(
//                         { logName: this.recordLog.recordLogName })
//                     .createLogRecordOps(
//                         ops, (err, logEntries) => {
//                             debug('ops to batch:', ops);
//                             debug('log entries:', logEntries);
//                             return this.rootDb.batch(
//                                 ops.concat(logEntries), SYNC_OPTIONS,
//                                 err => callback(err));
//                         });
//             } else {
//                 this.rootDb.batch(ops, SYNC_OPTIONS,
//                                   err => callback(err));
//             }
//         },
//     };

//     Object.keys(metadataAPI).forEach(k => {
//         metadataAPI[k] = metadataAPI[k].bind(dbService);
//     });

//     const wgm = new WGM(metadataAPI);
//     const writeCache = new WriteCache(wgm);
//     const vrp = new VRP(writeCache, wgm, this.versioning);

//     dbService.registerAsyncAPI({
//         put: (env, key, value, options, cb) => {
//             const dbName = env.subLevel.join(SUBLEVEL_SEP);
//             vrp.put({ db: dbName, key, value, options },
//                     env.requestLogger, cb);
//         },
//         del: (env, key, options, cb) => {
//             const dbName = env.subLevel.join(SUBLEVEL_SEP);
//             vrp.del({ db: dbName, key, options },
//                     env.requestLogger, cb);
//         },
//         get: (env, key, options, cb) => {
//             const dbName = env.subLevel.join(SUBLEVEL_SEP);
//             vrp.get({ db: dbName, key, options },
//                     env.requestLogger, cb);
//         },
//         getDiskUsage: (env, cb) => diskusage.check(this.path, cb),
//     });
//     dbService.registerSyncAPI({
//         createReadStream:
//         (env, options) => env.subDb.createReadStream(options),
//         getUUID: () => this.readUUID(),
//     });
// }
