FROM node:alpine

WORKDIR /usr/www/app/

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["npm", "start"]