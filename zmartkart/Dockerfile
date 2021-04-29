# pull base image
FROM node:14.13.1-buster-slim as build
WORKDIR /opt/app
ENV NODE_ENV production


# install global packages
ENV NPM_CONFIG_PREFIX=/home/node/.npm-global
ENV PATH /home/node/.npm-global/bin:$PATH
RUN npm i --unsafe-perm -g npm@latest expo-cli@latest

# install dependencies first, in a different location for easier app bind mounting for local development
# due to default /opt permissions we have to create the dir with root and change perms
#USER node
COPY ./package.json ./package-lock.json ./
RUN npm install

COPY . .

RUN expo build:web

FROM nginx:stable-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /opt/app/web-build /usr/share/nginx/html
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]