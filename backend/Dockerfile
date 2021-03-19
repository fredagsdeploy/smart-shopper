FROM node:14

WORKDIR /app

COPY package.json yarn.lock /app/

RUN yarn --pure-lockfile

COPY tsconfig.json tslint.json jest.config.js /app/

COPY ./src /app/

RUN yarn tsc

EXPOSE 8080

ENTRYPOINT ["node", "build/index.js"]

