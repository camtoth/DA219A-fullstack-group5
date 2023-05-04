const express = require('express');
const router = express.Router();
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

var current_Token = ""
var current_Username = ""
var current_Role = ""
var current_ID = ""


router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/login/login.html'));
});

// Admin
router.get('/admin', function (req, res) {
  // Access cookie
  //const cookieJwt = req.cookies.jwt;

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
router.post('/', async (req, res) => {
  try {
    // Get the first user with the same username
    var user = await (await fetch(`http://localhost:3000/api/accounts/${req.body.username}`)).json();

    console.log(user);
    // Dose user exist and is password correct
    if (user != null && await bcrypt.compare(req.body.password, user.password)) {

      console.log("The password is correct");

      // Create a token object
      const payload = {
        username: user.username,
        password: user.password
      }

      // Create JWT token
      const token = jwt.sign(payload, process.env.SECRET_PRIVATE_KEY, { expiresIn: '1h' });

      // Set JWT token as cookie
      res.cookie('jwt', token, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      });

      // Save the user session info
      current_Token = token
      // We can access the cookie from everywhere with:
      // const cookieJwt = req.cookies.jwt;

      current_Username = user.username
      current_Role = user.role
      current_ID = user._id

      // Successful log in
      if (current_Role == "admin") {
        //res.redirect("/admin")
        console.log("logged admin");
      } else if (current_Role == "waiter"){
        console.log("Logged waiter");
        //res.redirect("/users/" + user.userID)
        // res.redirect("/granted")
      }

    } else {
      // Failed log in
      //res.render('fail.ejs')
      console.log("Failed log in");
    }

  } catch (error) {
    console.log(error)
  }

});




module.exports = router;  