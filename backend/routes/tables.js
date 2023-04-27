const express = require('express');
const router = express.Router();
const { getAllTables, addTable, updateTable, deleteTable }  = require('../controller/tableController')


// Show all tables
router.get('/', getAllTables); // sends the req and res aoutomatically

// Create a new table
router.post('/', addTable);

// Update an album
router.put('/:id', updateTable);

// Delete an album
router.delete('/:id', deleteTable);

module.exports = router;
