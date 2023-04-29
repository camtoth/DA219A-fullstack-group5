const express = require('express');
const router = express.Router();
const { getAllMenuItems, addMenuItem, updateMenuItem, deleteMenuItem, getMenuItem } = require('../controller/menuController')


// Show all
router.get('/', getAllMenuItems); // sends the req and res aoutomatically

// Create
router.post('/', addMenuItem);

// Update
router.put('/:id', updateMenuItem);

// Get
router.get('/:id', getMenuItem);

// Delete
router.delete('/:id', deleteMenuItem);

module.exports = router;