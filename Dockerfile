FROM node:alpine

WORKDIR /app

EXPOSE 5010

COPY package*.json ./

RUN npm install

COPY . .

CMD ["npm", "start"]
