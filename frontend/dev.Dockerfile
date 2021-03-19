# Docker Image which is used as foundation to create
# a custom Docker Image with this Dockerfile
FROM node:14.5

# A directory within the virtualized Docker environment
# Becomes more relevant when using Docker Compose later
WORKDIR /app

# Copies package.json and package-lock.json to Docker environment
COPY package.json yarn.lock ./

# Installs all node packages
RUN yarn

# Copies everything over to Docker environment
COPY tsconfig.json /app/

# Uses port which is used by the actual application
EXPOSE 3000
VOLUME [ "/app/src", "/app/public", "/app/node_modules"]

# Finally runs the application
CMD [ "yarn", "start" ]