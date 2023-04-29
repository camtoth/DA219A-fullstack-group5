const express = require('express');
const router = express.Router();
const { getAllOccupations, addOccupation, updateOccupation, deleteOccupation  }  = require('../controller/occupationController')


// Show all
router.get('/', getAllOccupations); // sends the req and res aoutomatically

// Create new occupation
router.post('/', addOccupation);

// Occupation order
// router.post('/order/', addOccupationOrder);

// Update
router.put('/:id', updateOccupation);

// Delete
router.delete('/:id', deleteOccupation);

module.exports = router;