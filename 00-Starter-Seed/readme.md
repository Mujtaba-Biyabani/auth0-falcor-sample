# Auth0 + Falcor API Seed

This seed project demonstrates how to set up Auth0 with a Falcor API. If you want to create a regular NodeJS web app, please check [this other seed project](https://github.com/auth0/node-auth0/tree/master/examples/nodejs-regular-webapp)

# Running the Example

Run `npm install` to ensure local dependencies are available.

Rename the `.env.example` file to `.env` and set the **client ID** and **client secret** for your Auth0 app.

```bash
# .env file
AUTH0_CLIENT_SECRET=YOUR_CLIENT_SECRET
AUTH0_CLIENT_ID=YOUR_CLIENT_ID
```

Once you've set the two environment variables, run `node server.js`. The application will be served at `localhost:3001`.