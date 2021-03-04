FROM node:latest

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5000

RUN npm run build

ENTRYPOINT ["npx", "serve", "--listen", "3000", "./build/"]