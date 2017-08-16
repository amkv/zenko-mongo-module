docker stack rm zz
docker swarm leave -f

# delete all images and containers
# docker rm -f $(docker ps -a -q)
# docker rmi -f $(docker images -q)

clear_image="clear_image"
testing_image="mongo_connector"
CLEARIMAGE=./clear_image

clear_images_exist=$(docker images | grep -e $clear_image | wc -l)
if [ $clear_images_exist -eq 0 ]; then
    docker build -t $clear_image $CLEARIMAGE
    echo "image created: $clear_image"
else
    echo "image exist: $clear_image"
fi

is_running=$(docker images | grep -e $testing_image | wc -l)
if [ $is_running -gt 0 ]; then
    victim=$(docker images | grep -e $testing_image)
    arr=(`echo ${victim}`);
    docker rmi -f ${arr[2]}
    echo "image deleted: $testing_image"
else
    echo "image not runned: $testing_image"
fi

docker build -t $testing_image .
# docker push kalmykov/zenko-mongo-module

echo "export SCALITY_ACCESS_KEY_ID=accessKey1
export SCALITY_SECRET_ACCESS_KEY=verySecretKey1" > secrets.txt


docker swarm init --advertise-addr 192.168.99.100
DOCKERID="$(docker node ls -q)"
docker node update --label-add io.zenko.type=storage $DOCKERID
export AWS_SECRET_ACCESS_KEY=verySecretKey1
export AWS_ACCESS_KEY_ID=accessKey1
# export ENDPOINT=127.0.0.1
docker stack deploy -c docker-stack.yml zz
docker service ls

echo "docker service ls"
