const express = require('express');
const router = express.Router();
const { getAllOccupations, addOccupation, updateOccupation, deleteOccupation, getCurrentOccupions, getOccupionByID  }  = require('../controller/occupationController')


// Show all
router.get('/', getAllOccupations); // sends the req and res aoutomatically

// TO DO
router.get('/currentTables/:id', getOccupionByID); // Return occuptions by ID
router.get('/currentTables', getCurrentOccupions); // Return array of all occuptions at the current date and time.

// Create new occupation
router.post('/', addOccupation);

// Occupation order
// router.post('/order/', addOccupationOrder);

// Update
router.put('/:id', updateOccupation);

// Delete
router.delete('/:id', deleteOccupation);

module.exports = router;