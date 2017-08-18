#!/bin/zsh
# Author: Artem Kalmykov

STACK_NAME="zz"
# Depending on your Docker settings
# ADVERTISE_ADDR=""
ADVERTISE_ADDR="--advertise-addr 192.168.99.100"
AWS_ACCESS_KEY_ID="accessKey1"
AWS_SECRET_ACCESS_KEY="verySecretKey1"
BASE_IMAGE_NAME="clear_image"
MODULE_IMAGE_NAME="kalmykov/zenko-mongo-module"
CLEAR_IMAGE_PATH=./clear_image

# check if Docker is running (lab computers)
RET="$(docker images)"
if echo "Cannot connect to the Docker daemon" | grep -q "$RET"; then
    exit 0
fi

# set debug
DEBUG=false
if [ "$1" == "-d" ]; then
    DEBUG=true
fi

# remove docker stack
docker stack rm $STACK_NAME
# leave from docker swarm mode
if $DEBUG; then
    docker swarm leave -f
else
    docker swarm leave -f > /dev/null 2>&1
fi

# BE CAREFULL, delete ALL images and containers
if [ "$1" == "--erase" ]; then
    DEBUG=true
    docker rm -f $(docker ps -a -q)
    docker rmi -f $(docker images -q)
    echo "ALL images and containers deleted"
fi

# check if base image exist
BASE_IMAGE_EXIST=$(docker images | grep -e $BASE_IMAGE_NAME | wc -l)
if [ $BASE_IMAGE_EXIST -eq 0 ]; then
    if $DEBUG; then
        docker build -t $BASE_IMAGE_NAME $CLEAR_IMAGE_PATH
    else
        docker build -t $BASE_IMAGE_NAME $CLEAR_IMAGE_PATH > /dev/null 2>&1
    fi
    echo "image created: $BASE_IMAGE_NAME"
else
    echo "image already exist: $BASE_IMAGE_NAME"
fi

# check if module image exist
MODULE_IMAGE_EXIST=$(docker images | grep -e $MODULE_IMAGE_NAME | wc -l)
if [ $MODULE_IMAGE_EXIST -gt 0 ]; then
    victim=$(docker images | grep -e $MODULE_IMAGE_NAME)
    arr=(`echo ${victim}`);
    if $DEBUG; then
        docker rmi -f ${arr[2]}
    else
        docker rmi -f ${arr[2]} > /dev/null 2>&1
    fi
    echo "image deleted: $MODULE_IMAGE_NAME"
else
    echo "image not exist: $MODULE_IMAGE_NAME"
fi

# create module layer based on Base image
# if $DEBUG; then
#     docker build -t $MODULE_IMAGE_NAME .
# else
#     docker build -t $MODULE_IMAGE_NAME . > /dev/null 2>&1
# fi
# push image to docker hub
# docker push $MODULE_IMAGE_NAME

# exporting credentials for S3
echo "export SCALITY_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID" > secrets.txt
echo "export SCALITY_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY" >> secrets.txt
# exporting credentials for local enviroment
export AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID
export AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY

# initializing swam mode
if $DEBUG; then
    docker swarm init $ADVERTISE_ADDR
else
    docker swarm init $ADVERTISE_ADDR > /dev/null 2>&1
fi

# linking labels
docker node update --label-add io.zenko.type=storage $(docker node ls -q)
# deploy the stack of services
docker stack deploy -c docker-stack.yml $STACK_NAME

# display running stack
docker service ls
echo "docker service ls"

# open Application
open -a Kitematic

# run tests
# ...
