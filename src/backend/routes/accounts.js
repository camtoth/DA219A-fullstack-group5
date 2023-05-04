const express = require('express');
const router = express.Router();
const { getAllAccounts, addAccount, updateAccount, deleteAccount, getAccount, getAccountByUsername } = require('../controller/accountController')


// Show all
router.get('/', getAllAccounts); // sends the req and res aoutomatically

// Get account by username
router.get('/:username', getAccountByUsername); // sends the req and res aoutomatically


// Create
router.post('/', addAccount);

// Update
router.put('/:id', updateAccount);

// Get
router.get('/:id', getAccount);

// Delete
router.delete('/:id', deleteAccount);

module.exports = router;