const express = require('express');
const router = express.Router();
const { getAllAccounts, addAccount, updateAccount, deleteAccount }  = require('../controller/accountController')


// Show all
router.get('/', getAllAccounts); // sends the req and res aoutomatically

// Create
router.post('/', addAccount);

// Update
router.put('/:id', updateAccount);

// Delete
router.delete('/:id', deleteAccount);

module.exports = router;