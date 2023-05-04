const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt') 

const { getAllAccounts, addAccount, updateAccount, deleteAccount, getAccount } = require('../controller/accountController')



const cookieJwt = ""
/*var current_Token = ""
var current_Username = ""
var current_Role = ""
var current_ID = ""*/



router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/login/login.html'));
});

// Admin
router.get('/admin', function (req, res) {
  // Access cookie
  const cookieJwt = req.cookies.jwt;

  res.sendFile(path.join(__dirname, '../../frontend/admin/index.html'));
});

router.get('/placeOrder', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/admin/placeOrder.html'));
});

// Resturant
router.get('/restaurant', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/resturant/resturant.html'));
});

// POST
router.post('/', async (req, res) {
  try {
    // Get the first user with the same username
    var user = await database.getUserByName(req.body.username)

    // Dose user exist and is password correct
    if (user != null && await bcrypt.compare(req.body.password, user.password)) {

       // Create a signed token
       const payload = {
          username: user.username,
          password: user.password
       }

       // Create and log the token
       var token = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET)
     
       // Save the user session info
       current_Token = token
       current_Username = user.username
       current_Role = user.role
       current_ID = user.userID

       // Successful log in
       if (current_Role == "admin") {
          res.redirect("/admin")
       } else {
          res.redirect("/users/" + user.userID)
          // res.redirect("/granted")
       }
       
    } else {
       // Failed log in
       res.render('fail.ejs')
    }

 } catch (error) {
    console.log(error)
 }

  console.log(req.body);
  // Create JWT token
  const token = jwt.sign({ data: 'foo' }, process.env.SECRET_PRIVATE_KEY, { expiresIn: '1h' });

  // Set JWT token as cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict'
  });

  
});




module.exports = router;  