FROM node:latest

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5000

RUN npm run build

RUN npm run docs

ENTRYPOINT ["node", "dist/app.js"]