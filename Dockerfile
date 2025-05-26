FROM ubuntu:20.04
ENV DEBIAN_FRONTEND=noninteractive
ENV LC_ALL=C.UTF-8
RUN apt-get update && apt-get install -y curl gnupg2 npm
RUN npm install -g n yarn ts-node
RUN n latest

COPY . /app
WORKDIR /app/
RUN yarn install
RUN npx next build
