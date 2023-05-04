const express = require('express');
const router = express.Router();
const path = require('path');


// mainpage backend team
router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/about/about.html' ));
});

router.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/login/login.html' ));
});

router.get('/admin', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/admin/index.html'));
});

router.get('/admin/placeOrder', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/admin/placeOrder.html'));
});




module.exports = router;  