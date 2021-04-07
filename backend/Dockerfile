FROM node:lts-alpine

WORKDIR /app

COPY package.json package-lock.json /app/

RUN npm install

COPY src /app/src

COPY tsconfig.json apidoc.json /app/

RUN npm run build

EXPOSE 5000

ENTRYPOINT ["node", "dist/app.js"]