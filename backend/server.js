const express = require('express')
const path = require('path');
require('dotenv').config()
const createDBConnection = require('./dbConnection')

const app = express() // Set up express
app.use(express.json())
app.use(express.static('frontend'));
app.use(express.urlencoded({ extended: false })) //when extended property is set to false, the URL-encoded data will instead be parsed with the query-string library.
app.use('', express.static(path.join(__dirname, '')));


const home = require('./routes/home')
const tables = require('./routes/tables');
const occupations = require('./routes/occupations');
const menuItems = require('./routes/menuItems');
const accounts = require('./routes/accounts');


// Create DB connection
createDBConnection()

// Main Routes
app.use('/', home);
app.use('/api/tables', tables);
app.use('/api/occupations', occupations);
app.use('/api/menuItems', menuItems);
app.use('/api/accounts', accounts);


// LISTENING ON PORT 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening port to ${port}...`));
