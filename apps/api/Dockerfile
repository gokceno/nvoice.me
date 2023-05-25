 # Specify a base image
FROM node:18 AS build 

# Change working directory
WORKDIR /usr/app

# Copy in the app and weights
COPY ./ /usr/app

RUN yarn install

EXPOSE 4000

CMD ["npm", "run", "start"]