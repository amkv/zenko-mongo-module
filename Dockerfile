FROM clear_image
MAINTAINER Artem Kalmykov <kalmykov.artem@gmail.com>

WORKDIR /usr/src/app

COPY . /usr/src/app

CMD [ "npm", "start" ]

EXPOSE 8000
