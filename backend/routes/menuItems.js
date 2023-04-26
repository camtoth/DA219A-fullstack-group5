const express = require('express');
const router = express.Router();
const { getAllMenuItems }  = require('../controller/menuController')


// Show all menu items
router.get('/Menu', getAllMenuItems); // sends the req and res aoutomatically

module.exports = router;