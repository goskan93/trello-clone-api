FROM node:16.15.0-alpine
WORKDIR /api
COPY dist .
COPY .env .
COPY package.json .
RUN yarn install --production
CMD [ "node" , "main.js" ]
EXPOSE 3004