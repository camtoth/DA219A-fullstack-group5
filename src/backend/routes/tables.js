const express = require('express');
const router = express.Router();
const { getAllTables, addTable, updateTable, deleteTable, getTable } = require('../controller/tableController')


// Show all
router.get('/', getAllTables); // sends the req and res aoutomatically

// Create
router.post('/', addTable);

// Update
router.put('/:id', updateTable);

// Get
router.get('/:id', getTable);

// Delete
router.delete('/:id', deleteTable);

module.exports = router;
