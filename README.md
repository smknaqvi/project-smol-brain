# YTParty

Watch youtube in sync with your friends!

Visit our website at [https://ytparty.ml](https://ytparty.ml) to see this project in action.

Watch our demo at https://www.youtube.com/watch?v=Y8Tq7FqnPMc

## Development

1. Copy the contents from `.env.development.example` to .env for both the `frontend/` and `backend/` folders

   `cp ./frontend/.env.development.example ./frontend/.env && cp ./backend/.env.development.example ./backend/.env`

1. Run docker-compose for the docker-compose.dev.yml file

   `docker-compose -f docker-compose.dev.yml up -d`

1. Start up your apps as you normally do by running `npm run start` in both the `frontend/` and `backend/` folders

## Deploying

Note: this can be used for development as well if you skip the steps labelled (Prod)

1. Copy the contents from `.env.development.example` to .env for both the `frontend/` and `backend/` folders

   `cp ./frontend/.env.docker.example ./frontend/.env && cp ./backend/.env.docker.example ./backend/.env`

1. (Prod) Change the password for mongo in both `docker-compose.yml` as well as `./backend/.env`

1. (Prod) Change the `SESSION_SECRET` in `./backend/.env` to something random and complex

1. (Prod) Change the `FRONTEND_ORIGIN` and `ROOT_DOMAIN` to match your domain that your frontend is hosted on in `./backend/.env`.

   > Ex: an app hosted at https://ytparty.ml would have `FRONTEND_ORIGIN=https://ytparty.ml` and `ROOT_DOMAIN=ytparty.ml`

1. (Prod) Change `NODE_ENV` to `production` in `./backend/.env`.

1. (Prod) Change `REACT_APP_BACKEND_URI` to point to your backend api

   > Ex: an api you want hosted at https://api.ytparty.ml would have `REACT_APP_BACKEND_URI=https://api.ytparty.ml`

1. Run docker-compose

   `docker-compose build && docker-compose up -d`

The frontend should be listening on port 3000 and the backend on 5000. Just stick your favourite reverse proxy in front of it!

> Note: the docker containers binds to 127.0.0.1:PORT:PORT which means that it only binds to docker's network interface. If you aren't using a reverse proxy and want to expose this to the public, you'll need to modify the docker-compose file to bind directly to PORT:PORT instead

## API Documentation

Please see `DOCS.md`

## Credits

You can visit https://ytparty.ml/credits to view all the code snippets, tutorials, and documentation we referenced.
