import boto
from boto.s3.connection import S3Connection, OrdinaryCallingFormat
from boto.s3.key import Key

def main():
    connection = S3Connection(
        aws_access_key_id='accessKey1',
        aws_secret_access_key='verySecretKey1',
        is_secure=False,
        port=80,
        calling_format=OrdinaryCallingFormat(),
        host='192.168.99.100'
    )
    bucket_name = 'usersbucket'
    # try:
    #     print connection.create_bucket(bucket_name)
    # except:
    #     print bucket_name + ' already exist'

    buckets = connection.get_all_buckets()
    print buckets

    # k = Key(bucket_name)
    # print dir(k)
    # k.key = 'my_key'
    # print k.key
    # k.set_contents_from_string('this is my test of Zenko')

if __name__ == '__main__':
    main()
