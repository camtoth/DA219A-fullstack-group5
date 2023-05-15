const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger-output.json'
const endpointsFiles = ['./src/backend/server.js']

const doc = {
  info: {
    title: 'Dining Dashboard API',
    description: 'https://github.com/camtoth/DA219A-fullstack-group5',
  },
  host: 'localhost:3000',
  schemes: ['http'],
}

const options = {
  openapi: '3.0.3'
}

swaggerAutogen(outputFile, endpointsFiles, doc, options)

/* NOTE: if you use the express Router, you must pass in the 
   'endpointsFiles' only the root file where the route starts,
   such as index.js, app.js, routes.js, ... */
