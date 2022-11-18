FROM node:16-alpine

WORKDIR /server
COPY package.json /app
RUN npm install

COPY . /app

CMD ["npm", "start"]