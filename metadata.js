const arsenal = require('arsenal');
const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

function startMetaDataServer(logger, logOptions, url)
{
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
            this.addRequestInfoConsumer((dbService, reqParams) => {
                    const env = {};
                    env.subLevel = reqParams.subLevel;
                return env;
            });
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
                if (key === 'users..bucket')
                    key = 'users.bucket'
                // if (key === "")
                //     key = "notempty"

                MongoClient.connect(url, function(err, db) {
                    console.log("We are connected to MongoDB");
                    db.collection(key, function(err, res) {
                        console.log('collection created:', key);
                        db.collection(key).insertOne(JSON.parse(value), function(err, result) {
                            // console.log(result);
                            if (!err) console.log('value stored in the Mongo');
                            cb(result);
                            db.close();
                        });
                    });
                });

                // MongoClient.connect(url, function(err, db) {
                //     insertDocuments(db, value, cb);
                // });

                // MongoClient.connect(url, function(err, db) {
                //   if(!err) {
                //     console.log("We are connected to MongoDB");
                //     // console.log(db);
                //     db.collection("users.bucket", function(err, res) {
                //       if (err){
                //         throw err;
                //     } else {
                //         console.log('collection created');
                //         console.log(res);
                //       }
                //       console.log(res);
                //       db.collection.insert(value, function(err, res){
                //           if (err){
                //             throw err;
                //         } else {
                //               console.log("Collection created!");
                //           }
                //       });
                //     });
                //     db.close();
                //   }
                //   else {
                //       console.log("Bad connection to MongoDB");
                //   }
                //   cl();
                // });


                // if (key === "users..bucket")
                //     key = "users.bucket"

                console.log('-------------------------put-------------------------');
                // console.log('env == \n', env);
                // console.log('key == \n', key);
                // console.log('value == \n', value);
                // console.log('options == \n', options);
                // console.log('callback == \n', cb);

                // cb(null, {"sf": 123});
            },
            del: (env, key, options, cb) => {
                console.log('-------------------------del-------------------------');
            },
            get: (env, key, options, cb) => {
                console.log('-------------------------put-------------------------');
                // console.log('env == \n', env);
                // console.log('key == \n', key);
                // console.log('options == \n', options);
                // console.log('callback == \n', cb);
                // cb(null, {'something':'nothing'});
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

    // var insertDocuments = function(db, data, callback) {
    // 	// Get the documents collection
    // 	var collection = db.collection('documents');
    // 	// Insert some documents
    // 	// collection.insertMany([{a : 1}, {a : 2}, {a : 3}], function(err, result) {
    // 	collection.insertOne(data, function(err, result) {
    // 		assert.equal(err, null);
    // 		console.log("Inserted 1 documents into the document collection");
    // 		callback(result);
    // 	});
    // }

    // var findDocuments = function(db, callback) {
    // 	// Get the documents collection
    // 	var collection = db.collection('documents');
    // 	// Find some documents
    // 	collection.find({}).toArray(function(err, docs) {
    // 		assert.equal(err, null);
    // 		console.log("Found the following records");
    // 		console.log(docs)
    // 		callback(docs);
    // 	});
    // }

    mdServer.startServer();
};

module.exports = startMetaDataServer;
