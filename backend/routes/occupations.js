const express = require('express');
const router = express.Router();
const { getAllOccupation }  = require('../controller/occupationController')


// Show all currently occupied tables
router.get('/currentTables', getAllOccupation); // sends the req and res aoutomatically

module.exports = router;