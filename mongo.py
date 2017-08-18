from pymongo import MongoClient
import pprint

client = MongoClient('192.168.99.100', 27017)
db = 'zenko'
bucket = 'usersbucket'

data = client[db][bucket].find()
for document in data:
    print(document)

# databases = client.database_names()
# for dbs in databases:
#     print ("db: ") + str(dbs)
#     collections = client[dbs].collection_names()
#     for collection in collections:
#         print "collection: " + str(collection)
#         data = client[dbs][collection].find()
#         for document in data:
#             print(document)
#         #     # pass
