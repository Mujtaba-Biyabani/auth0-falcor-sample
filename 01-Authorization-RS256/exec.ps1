docker build -t auth0-falcor-api-rs256 .
docker run --env-file .env -p 3010:3010 -p 3001:3001 -it auth0-falcor-api-rs256
