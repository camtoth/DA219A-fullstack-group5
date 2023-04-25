const express = require('express')
const path = require('path');
require('dotenv').config()
const createDBConnection = require('./dbConnection')

const app = express() // Set up express
app.use(express.json())
app.use(express.static('frontend'));
app.use(express.urlencoded({ extended: false })) //when extended property is set to false, the URL-encoded data will instead be parsed with the query-string library.
app.use('', express.static(path.join(__dirname, '')));


const { getAllTables, addTable } = require('../backend/controller/tableController')
const { getAllOccupation } = require('../backend/controller/occupationController')
const { getAllMenuItems } = require('../backend/controller/menuController')

// Create DB connection
createDBConnection()


// mainpage backend team
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// Show all tables
app.get('/allTables', getAllTables); // sends the req and res aoutomatically

// Show all currently occupied tables
app.get('/currentTables', getAllOccupation); // sends the req and res aoutomatically

// Show all menu items
app.get('/Menu', getAllMenuItems); // sends the req and res aoutomatically

// Create a new table
app.post('/addTable', addTable);

// LISTENING ON PORT 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening port to ${port}...`));
