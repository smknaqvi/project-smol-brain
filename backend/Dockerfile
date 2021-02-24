FROM ubuntu:20.04

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash

RUN source ~/.bashrc

RUN nvm install 14.16.0

RUN nvm use 14.16.0

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 5000

RUN npm run build

ENTRYPOINT ["node", "dist/app.js"]