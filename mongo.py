from pymongo import MongoClient
import pprint

client = MongoClient('192.168.99.100', 27017)
db = 'zenko'
bucket = 'userbucket'

databases = client.database_names()
for db in databases:
    print ("db: ") + str(db)
    collections = client[db].collection_names()
    for collection in collections:
        print "collection: " + str(collection)
        data = client[db][collection].find()
        for document in data:
            print(document)
            # pass

# data = client[db][bucet].find()
# print data
# for document in data:
#     print(document)
