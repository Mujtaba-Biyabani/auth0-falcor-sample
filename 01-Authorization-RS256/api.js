const express = require('express');
const app = express();
const jwt = require('express-jwt');
const jwtAuthz = require('express-jwt-authz');
const jwksRsa = require('jwks-rsa');
const cors = require('cors');
const falcor = require('falcor');
const HttpDataSource = require('falcor-http-datasource');

require('dotenv').config();

const serverURL = 'http://localhost:3000';

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
  throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file'
}

app.use(cors());

const checkJwt = jwt({
  // Dynamically provide a signing key based on the kid in the header and the singing keys provided by the JWKS endpoint.
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),

  // Validate the audience and the issuer.
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

app.get('/api/public', async function(req, res) {
  const model = new falcor.Model(
    {
      source: new HttpDataSource(serverURL + '/api/public/model.json')
    });

  const message = await model.getValue(['public', 'message']);

  res.json({ message: message });
});

app.get('/api/private', checkJwt, async function(req, res) {
  const token = req.headers.authorization.split(" ")[1];
  const model = new falcor.Model(
    {
      source: new HttpDataSource(
        serverURL + '/api/private/model.json',
        {
          headers: { 'Authorization': 'Bearer ' + token }
        })
    });

  const message = await model.getValue(['private', 'message']);

  res.json({ message: message });
});

app.get('/api/private-scoped', checkJwt, async function(req, res) {
  const token = req.headers.authorization.split(' ')[1];
  const model = new falcor.Model(
    {
      source: new HttpDataSource(
        serverURL + '/api/private-scoped/model.json',
        {
          headers: { 'Authorization': 'Bearer ' + token }
        })
    });
  
  try {
    const message = await model.getValue(['private_scoped', 'message']);

    res.json({ message: message });
  } catch(err) {
    res.status(403).json(err[0].value);
  } 
});

app.listen(3010);
console.log("Listening on http://localhost:3010");
