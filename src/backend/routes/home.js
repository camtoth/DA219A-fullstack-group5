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




module.exports = router;  