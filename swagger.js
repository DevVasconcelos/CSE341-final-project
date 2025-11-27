const swaggerAutogen = require("swagger-autogen")();

// Determine host and scheme based on environment
const isProduction = process.env.NODE_ENV === 'production';
const host = isProduction ? 'cse341-final-project-e1gc.onrender.com' : 'localhost:3000';
const schemes = isProduction ? ['https'] : ['http'];
const authUrl = isProduction 
  ? 'https://cse341-final-project-e1gc.onrender.com/auth/google' 
  : 'http://localhost:3000/auth/google';

const doc = {
  info: {
    version: "1.0.0",
    title: "Popcorn API",
    description: "Popcorn API provides a simple and organized backend to store movies, users, genres, and reviews. Fully documented and built with Node.js, Express, and MongoDB.",
  },
  host: host,
  schemes: schemes,
  securityDefinitions: {
    oAuth2: {
      type: "oauth2",
      flow: "implicit",
      authorizationUrl: authUrl,
      scopes: {
        profile: "Access to user profile",
        email: "Access to user email"
      }
    },
    apiKeyAuth: {
      type: "apiKey",
      in: "header", // can be 'header', 'query' or 'cookie'
      name: "X-API-KEY", // name of the header, query parameter or cookie
      description: "Some description...",
    },
  },
};

// Output file
const outputFile = "./swagger-output.json";

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the
root file where the route starts, such as index.js, app.js, routes.js, etc ... */
const routes = ["./routes/index.js"];

// generate swagger.json
swaggerAutogen(outputFile, routes, doc);