FROM node:18.14.2-alpine
WORKDIR /api
COPY dist .
COPY .env .
COPY .npmrc .
COPY yarn.lock .
COPY package.json .
RUN yarn install --production
CMD [ "node" , "main.js" ]
EXPOSE 3004