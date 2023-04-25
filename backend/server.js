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

// Create DB connection
createDBConnection()


// mainpage
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

// Show all albums
app.get('/allTables', getAllTables); // sends the req and res aoutomatically

app.get('/currentTables', getAllOccupation); // sends the req and res aoutomatically

// Create a new album
app.post('/addTable', addTable);

// LISTENING ON PORT 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening port to ${port}...`));
