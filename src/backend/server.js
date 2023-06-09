const express = require('express')
const path = require('path');
require('dotenv').config()
const createDBConnection = require('./dbConnection')
const cors = require('cors')

const app = express() // Set up express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static('../frontend', {
  setHeaders: (res, path) => {
    if (path.endsWith('.css')) {
      res.setHeader('Content-Type', 'text/css');
    }
  }
}));

app.use('', express.static(path.join(__dirname, '../frontend')));

//const login = require('./routes/login')
const home = require('./routes/home')
const tables = require('./routes/tables');
const occupations = require('./routes/occupations');
const menuItems = require('./routes/menuItems');
const accounts = require('./routes/accounts');
const swaggerUi = require('swagger-ui-express'),
  swaggerDocument = require('../../swagger-output.json');



// Create DB connection
createDBConnection()

app.use(cors({
  origin: "*",
}))

// Main Routes
app.use('/', home);
//app.use('/login', login);
app.use('/api/tables', tables);
app.use('/api/occupations', occupations);
app.use('/api/menuItems', menuItems);
app.use('/api/accounts', accounts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


// LISTENING ON PORT 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on port ${port}...`));
