FROM node:14.5 as build
WORKDIR /usr/src/app
ENV PATH /usr/src/app/node_modules/.bin:$PATH
COPY package.json yarn.lock ./
RUN  yarn --silent
COPY . .
RUN yarn build

####################

FROM nginx:1.19.1-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
