const express = require('express');
const router = express.Router();
const { getAllOccupations, addOccupation, updateOccupation, deleteOccupation, getCurrentOccupations, getOccupation, getOccupationOrder } = require('../controller/occupationController')


// Show all
router.get('/', getAllOccupations); // sends the req and res aoutomatically
router.get('/current', getCurrentOccupations); // Return array of all occuptions at the current date and time.
router.get('/orders/:id', getOccupationOrder)
router.get('/:id', getOccupation); // Return occuptions by ID


// Create new occupation
router.post('/', addOccupation);

// Occupation order
// router.post('/order/', addOccupationOrder);

// Update
router.put('/:id', updateOccupation);

// Delete
router.delete('/:id', deleteOccupation);

module.exports = router;