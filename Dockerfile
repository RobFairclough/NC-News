FROM node:alpine

WORKDIR /usr/www/app/

COPY package*.json ./

RUN npm ci

COPY . .

CMD ["sh", "-c", "npm run migrate:latest && npm start"]