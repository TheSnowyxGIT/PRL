FROM node:18-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV MONGO_URL=mongodb://root:12341234@localhost:27017

CMD ["npm", "start"]
