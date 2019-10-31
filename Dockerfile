FROM node:alpine

WORKDIR /usr/www/app/

COPY package*.json ./

RUN npm ci

COPY . .

# below command runs migrations, seeds and starts. For first run
# CMD ["sh", "-c", "npm run migrate:latest && npm run seed && npm start"]

# CMD ["sh", "-c", "npm run migrate:latest && npm start"]
# note, can get in with docker-compose run server sh
CMD ["npm", "start"]