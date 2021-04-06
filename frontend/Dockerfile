FROM node:lts

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY src /app/src

COPY public /app/public

COPY tsconfig.json .env /app/

RUN npm run build

EXPOSE 3000

ENTRYPOINT ["npx", "serve", "-s", "--listen", "3000", "./build/"]
