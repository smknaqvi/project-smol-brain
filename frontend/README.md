# YTParty Frontend

W.I.P.

## Deployment to Prod

1. Make sure your current working directory is in the `frontend/` folder

   `cd backend/`

1. Set the appropriate environment variables for prod in a file called `.env` (sample in .env.example)

   `cp .env.example .env`

1. Build the docker image locally

   `docker build -t ytparty-frontend .`

1. Run the docker container

   `docker run --env-file .env -p WHATEVER-PORT-YOU-WANT:3000 -d ytparty-frontend`
