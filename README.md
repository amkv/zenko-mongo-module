# zenko-mongo-module
Zenko Mongo Module

#Overrides Dmd/Data and Dmd/Metadata

To generate the docker image do:

```
$ docker build -t kalmykov/zenko-mongo-module .
$ docker push kalmykov/zenko-mongo-module
```

To run the mongo-module, do:

```
$ docker stack rm zenko-prod
$ docker stack deploy -c docker-stack.yml zenko-prod
```

# zenko-mongo-module
