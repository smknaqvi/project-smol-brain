# YTParty Backend

W.I.P.

## Deployment to Prod

1. Make sure your current working directory is in the `backend/` folder

   `cd backend/`

1. Set the appropriate environment variables for prod in a file called `.env` (sample in .env.example)

   `cp .env.example .env`

1. Build the docker image locally

   `docker build -t ytparty-backend .`

1. Run the docker container

   `docker run --env-file .env -p WHATEVER-PORT-YOU-WANT:5000 -d ytparty-backend`
