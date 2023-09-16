 # Specify a base image
FROM node:18 AS build 

LABEL org.opencontainers.image.source = "https://github.com/gokceno/nvoice.me"

# Change working directory
WORKDIR /usr/app

# Copy in the app and weights
COPY ./ /usr/app

RUN npm install

EXPOSE 4000

CMD ["npm", "run", "start"]
