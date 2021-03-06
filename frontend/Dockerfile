FROM node:latest

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 3000

RUN npm run build

ENTRYPOINT ["npx", "serve", "-s", "--listen", "3000", "./build/"]
