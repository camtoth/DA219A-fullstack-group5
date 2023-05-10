const Accounts = require("../model/Accounts")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

//specifies which routes need permission and who can access it
const urlPermissions = {
  "/login": { "role": ["guest"] },
  "/admin": { "role": ["admin"], "id": false },
  "/placeOrder": { "role": ["admin"], "id": false },
  "/waiter": { "role": ["admin", "waiter"], "id": true }
}

//check page permission (middleware)
async function checkPermission(req, res, next) {
  let orgUrl = req.originalUrl;
  let requiredRoles = [];
  let permission = false;
  console.log(orgUrl)

  //check if page needs permission
  for (let url in urlPermissions) {
    if (orgUrl.includes(url)) {
      requiredRoles = urlPermissions[url].role;
      break;
    }
  }
  console.log("roles required for access:", requiredRoles)

  //if no role specified
  if (requiredRoles.length == 0) {
    permission = true;
  } else {
    try {
      //decode & read user cookie
      const cookieJwt = req.cookies.jwt;
      const decryptedtoken = jwt.verify(cookieJwt, process.env.SECRET_PRIVATE_KEY)
      let username = decryptedtoken.username;
      let password = decryptedtoken.password;
      let userRole = await getUserRole(username, password);
      console.log(username)

      if (requiredRoles.includes(userRole)) {
        permission = true;
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (permission) {
    next();
  } else {
    console.log("cant access page!")
    res.status(403).redirect("/login")
  }

}

//check login status (middleware)
async function checkLogin(req, res, next) {
  let userRole = "guest";

  try {
    //decode & read user cookie
    const cookieJwt = req.cookies.jwt;
    const decryptedtoken = jwt.verify(cookieJwt, process.env.SECRET_PRIVATE_KEY)
    let username = decryptedtoken.username;
    let userID = decryptedtoken.userID;
    let password = decryptedtoken.password;
    userRole = await getUserRole(username, password);
  } catch (error) {
  }

  if (userRole === "guest") {
    next()
  } else if (userRole === "admin") {
    res.redirect("/admin")
  } else if (userRole === "waiter") {
    res.redirect(`/waiter/${userID}`)
  }
}


//check if user exists and return userType/role
async function getUserRole(username, password) {
  let userRole = "guest";

  try {
    const userData = await Accounts.findOne({ username: username })

    // Does user exist and is password correct?
    if (userData.length != 0 && await bcrypt.compare(password, userData.password)) {
      userRole = userData.role
    }

  } catch (error) {
    console.log(error)
  }

  return userRole
}

async function checkUser(req, res) {

}


//login user
async function loginUser(req, res) {
  let username = req.body.username;
  let password = req.body.password;

  //check user
  let userRole = await getUserRole(username, password);

  if (userRole == "guest") {
    res.redirect("/login")
  } else {

    //find userId 
    const userData = await Accounts.findOne({ username: username })
    let userID = userData._id
    console.log(userData._id)


    // Create a token object
    const payload = {
      username: username,
      password: password,
      userID: userID
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
      res.redirect("/admin")

    } else if (userRole == "waiter") {
      res.redirect(`/waiter/${userID}`)
      console.log("logged waiter");
    }
  }
}


module.exports = { loginUser, checkPermission, checkLogin };