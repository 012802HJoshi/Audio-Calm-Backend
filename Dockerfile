FROM node:20-alpine

WORKDIR ./

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 6969

CMD ["npm", "run" ,"start:prod"]