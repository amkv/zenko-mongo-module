FROM node:6-slim
MAINTAINER Vianney Rancurel <vr@scality.com>

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN apt-get update \
    && apt-get install -y jq python git build-essential --no-install-recommends \
    && npm install --production \
    && apt-get autoremove --purge -y python git build-essential \
    && rm -rf /var/lib/apt/lists/* \
    && npm cache clear \
    && rm -rf ~/.node-gyp \
    && rm -rf /tmp/npm-*

VOLUME ["/usr/src/app/localData","/usr/src/app/localMetadata"]
