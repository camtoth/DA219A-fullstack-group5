const express = require('express');
const router = express.Router();
const path = require('path');

const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

router.use(cookieParser())

//specifies which routes need permission and who can access it
const sitePermission = {
  "/adminpage": { "role": ["admin"] },
  "/waiterpage": { "role": ["admin", "waiter"] }
}

const { loginUser, checkPermission } = require('../controller/loginController')

// mainpage backend team
router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/about/about.html'));
});

//login page (TO DO: need to do a redirect when already logged in)
router.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/login/login.html'));
});

//post login input
router.post('/login', loginUser)

// Admin
router.get('/adminpage', checkPermission, async function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/admin/index.html'));
});

//place order test page for admin
router.get('/placeOrder', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/admin/placeOrder.html'));
});

// Restaurant
router.get('/waiterpage/:id', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/resturant/restaurant.html'));
});


module.exports = router;  