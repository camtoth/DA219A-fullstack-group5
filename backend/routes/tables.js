const express = require('express');
const router = express.Router();
const { getAllTables, addTable }  = require('../controller/tableController')


// Show all tables
router.get('/allTables', getAllTables); // sends the req and res aoutomatically

// Create a new table
router.post('/addTable', addTable);

module.exports = router;
