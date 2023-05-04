const express = require('express');
const router = express.Router();
const path = require('path');


router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/admin/index.html'));
});

router.get('/placeOrder', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/admin/placeOrder.html'));
});


module.exports = router;  