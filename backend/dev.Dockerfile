FROM node:14

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn --pure-lockfile

COPY tsconfig.json tslint.json jest.config.js /app/

EXPOSE 8080
VOLUME /app/src

ENTRYPOINT ["yarn", "dev"]

