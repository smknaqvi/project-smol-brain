# YTParty Frontend

W.I.P.

## Deployment

1. Make sure your current working directory is in the `frontend/` folder

   `cd frontend/`

1. Set the appropriate environment variables for prod in `.env`

1. Build the docker image locally

   `docker build -t ytparty-frontend .`

1. Run the docker container

   `docker run -p WHATEVER-PORT-YOU-WANT:3000 -d ytparty-frontend`
