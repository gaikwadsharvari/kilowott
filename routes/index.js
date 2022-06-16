const express = require('express');
var router = express.Router();
const passport = require("passport");


router.get('/', function (req, res) {
  if (req.user) {
    data = {
      title: "Dashboard",
      bodyClass: "dashboard",
      isDashboard: true,
      isLoggedIn: true,
    };
    res.render("index", data);
  } else {
    res.redirect("/login");
  }
});

//For user lagin form
router.get("/login", async (req, res) => {
  res.render("login", {
    title: "Login",
    layout: "anonymous",
    isLogin: true,
    bodyClass: "login_page",
  });
});

// To save user login details
router.post("/login", async function (req, res, next) {
  await passport.authenticate("local", function (err, user, info) {
    
    if (err) {
      return res.render("login", {
        title: "Login",
        layout: "anonymous",
        bodyClass: "login_page",
        error: true,
        errorMessage:
          "The username and password combination you tried to log in with is incorrect or user is not active. Please try again.",
      });
    }
   
    if (!user) {
      return res.render("login", {
        title: "Login",
        layout: "anonymous",
        bodyClass: "login_page",
        error: true,
        errorMessage:
          "The username and password combination you tried to log in with is incorrect. Please try again.",
      });
    }

    req.logIn(user, function (err) {
      if (err) {
        return res.render("login", {
          title: "Login",
          layout: "anonymous",
          bodyClass: "login_page",
          error: true,
          errorMessage: err.message,
        });
      }
      return res.redirect("/");
    });
  })(req, res, next);
});

//For user logout
router.get('/logout', function (req, res){
  req.session.destroy(function (err) {
    res.redirect('/'); //Inside a callback… bulletproof!
  });
});

//For user sign up form
router.get("/sign-up", async (req, res) => {
    res.render("sign-up", {
      isSignUp: true,
      title: "Sign Up",
      layout: "anonymous",
      bodyClass: "sign-up",
      error: false,
    });
  });


module.exports = router;
