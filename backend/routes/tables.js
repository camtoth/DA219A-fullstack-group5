const express = require('express');
const router = express.Router();
const { getAllTables, addTable, updateTable, deleteTable } = require('../controller/tableController')


// Show all
router.get('/', getAllTables); // sends the req and res aoutomatically

// Create
router.post('/', addTable);

// Update
router.put('/:id', updateTable);

// Delete
router.delete('/:id', deleteTable);

module.exports = router;
