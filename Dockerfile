FROM clear_image
MAINTAINER Artem Kalmykov <kalmykov.artem@gmail.com>

WORKDIR /usr/src/app

COPY . /usr/src/app

VOLUME ["/usr/src/app/localData","/usr/src/app/localMetadata"]

CMD [ "npm", "start" ]

EXPOSE 8000
