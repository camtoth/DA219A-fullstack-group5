const express = require('express');
const router = express.Router();
const { getAllMenuItems, addMenuItem, updateMenuItem, deleteMenuItem }  = require('../controller/menuController')


// Show all menu items
router.get('/', getAllMenuItems); // sends the req and res aoutomatically

// Create
router.post('/', addMenuItem);

// Update
router.put('/:id', updateMenuItem);

// Delete
router.delete('/:id', deleteMenuItem);

module.exports = router;