const express = require('express')
require('dotenv').config()
const createDBConnection = require('./dbConnection')

const app = express() // Set up express
app.use(express.json())
app.use(express.static('frontend'));
app.use(express.urlencoded({ extended: false })) //when extended property is set to false, the URL-encoded data will instead be parsed with the query-string library.

const { getAll, add }  = require('../backend/controller/tableController')

// Create DB connection
createDBConnection()

// Show all albums
app.get('/', getAll); // sends the req and res aoutomatically

// Create a new album
app.post('/', add);

// LISTENING ON PORT 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening port to ${port}...`));
