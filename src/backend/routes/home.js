const express = require('express');
const router = express.Router();
const path = require('path');

const cookieParser = require("cookie-parser")
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

router.use(cookieParser())


const { loginUser, checkPermission, checkLogin } = require('../controller/loginController')

// mainpage backend team
router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/start/start.html'));
});

router.get('/about', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/about/aboutUs.html'));
});

//login page (TO DO: need to do a redirect when already logged in)
router.get('/login', checkLogin, function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/login/login.html'));
});

router.get('/login/error', function (req, res) {
  // Send the user here if the username or pass was wrong
  res.sendFile(path.join(__dirname, '../../frontend/login/login.html'));
});

router.get('/logout', function (req, res) {
  try {
    res.clearCookie('jwt')
    res.redirect('/login')
  } catch (error) {
    res.status(500).send(error)
  }
});

//post login input
router.post('/login', loginUser)

// Admin
router.get('/admin/:id', checkPermission, async function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/admin/admin.html'));
});

//place order test page for admin
router.get('/placeOrder', checkPermission, function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/admin/placeOrder.html'));
});

// Restaurant
router.get('/waiter/:id', checkPermission, function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/restaurant/restaurant.html'));
});


module.exports = router;  