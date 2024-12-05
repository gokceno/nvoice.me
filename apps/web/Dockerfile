# Specify a base image
FROM node:18 AS builder

LABEL org.opencontainers.image.source = "https://github.com/gokceno/nvoice.me"

# Change working directory
WORKDIR /usr/app

# Copy in the app and weights
COPY ./ /usr/app

# Set build arguments
ARG REACT_APP_API_BASEURL

# ENV REACT_APP_API_BASEURL=${REACT_APP_API_BASEURL}

# Install NPM dependencies
ENV NODE_OPTIONS=--openssl-legacy-provider
RUN npm install

# Build app
RUN npm run build

FROM nginx AS runner

COPY --from=builder /usr/app/.nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=builder /usr/app/build /usr/share/nginx/html
