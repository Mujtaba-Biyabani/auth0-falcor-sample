const express       = require('express');
const falcorExpress = require('falcor-express');
const Router        = require('falcor-router');
const jwt           = require('express-jwt');
const dotenv        = require('dotenv');
const bodyParser    = require('body-parser');
const jwtAuthz      = require('express-jwt-authz');
const jwksRsa       = require('jwks-rsa');
const cors          = require('cors');
require('dotenv').config();

const app = express();

app.use(express.static('.'));

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

const checkScopes = jwtAuthz([ 'read:messages' ]);

var data = [
  {
    "name": "AngularJS",
    "language": "JavaScript"
  },
  {
    "name": "NodeJS",
    "language": "JavaScript"
  },
  {
    "name": "Laravel",
    "language": "PHP"
  }
];

app.use('/api/model.json', checkJwt, checkScopes, falcorExpress.dataSourceRoute(function(req, res) {
  return new Router([
    {
      route: "frameworks[{integers:frameworkIds}]['name', 'language']",
      get: function(pathSet) {
        var results = [];

        pathSet.frameworkIds.forEach(function(frameworkId) {

          // An array of key names that map is held at pathSet[2]
          pathSet[2].map(function(key) {

            // Find the framework that corresponds to the current frameworkId
            var frameworkRecord = data[frameworkId];

            // Finally we push a path/value object onto
            // the results array
            results.push({
              path: ['frameworks', frameworkId, key], 
              value: frameworkRecord[key]
            });
          });          
        });

        return results;
      }
    }
  ]);
}));

app.listen(3010);
console.log("Listening on http://localhost:3010");
