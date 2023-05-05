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

//middleware function to check permission (TO DO: still need to make it user specific)
async function checkPermission(req, res, next) {
  let permission = false;
  try {
    let orgUrl = req.originalUrl;
    const cookieJwt = req.cookies.jwt;
    const decryptedtoken = jwt.verify(cookieJwt, process.env.SECRET_PRIVATE_KEY)
    let username = decryptedtoken.username;
    let password = decryptedtoken.password;
    let userRole = await getUserRole(username, password);

    if (Object.keys(sitePermission).includes(orgUrl)) {
      //if role specific
      if (sitePermission[orgUrl]["role"].includes(userRole)) {
        permission = true;
        console.log("permission granted!")
      }
    }
  } catch (error) {
    console.log(error)
  }

  if (permission) {
    next();
  } else {
    res.status(403).redirect("/login")
  }
}


//check if user exists and return userType/role
async function getUserRole(username, password) {
  let userRole = "guest";

  try {
    userData = await (await fetch(`http://localhost:3000/api/accounts/${username}`)).json();

    // Does user exist and is password correct?
    if (userData != null && await bcrypt.compare(password, userData.password)) {
      userRole = userData.role
    }

  } catch (error) {
    console.log(error)
  }

  return userRole
}


// mainpage backend team
router.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/about/about.html'));
});

//login page (TO DO: need to do a redirect when already logged in)
router.get('/login', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/login/login.html'));
});

// POST
router.post('/login', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  let userRole = await getUserRole(username, password);

  if (userRole === "guest") {
    res.redirect("/login")
  } else {
    // Create a token object
    const payload = {
      username: username,
      password: password
    }
    // Create JWT token
    const token = jwt.sign(payload, process.env.SECRET_PRIVATE_KEY, { expiresIn: '1h' });

    // Set JWT token as cookie
    res.cookie('jwt', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict'
    });

    // Successful log in
    if (userRole == "admin") {
      console.log("logged admin");
      res.redirect("/adminpage")

    } else if (userRole == "waiter") {
      res.redirect(`/waiterpage/${username}`)
      console.log("logged waiter");
    }
  }
});

// Admin
router.get('/adminpage', checkPermission, async function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/admin/index.html'));
});

// Resturant
router.get('/waiterpage/:id', function (req, res) {
  res.sendFile(path.join(__dirname, '../../frontend/resturant/restaurant.html'));
});


module.exports = router;  