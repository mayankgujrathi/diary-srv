const express = require("express");
const admin = require("firebase-admin")
const router = express.Router();

const loginRequired = (req, res, next) => {
  const sessionCookie = req.cookies.session || "";
  admin
    .auth()
    .verifySessionCookie(sessionCookie, true /** checkRevoked */)
    .then((userData) => {
      req.user = userData
      next()
    })
    .catch((error) => {
      res.redirect("/auth/login");
    });
}

router.get("/login", function (req, res) {
  res.render("login.html");
});

router.get("/signup", function (req, res) {
  res.render("signup.html");
});

// router.get("/profile", loginRequired, function (req, res) {
//   res.render("profile.html")
// });


router.post("/sessionLogin", (req, res) => {
  const idToken = req.body.idToken.toString();
  const expiresIn = 60 * 60 * 24 * 5 * 1000;
  admin
    .auth()
    .createSessionCookie(idToken, { expiresIn })
    .then(
      (sessionCookie) => {
        const options = { maxAge: expiresIn, httpOnly: true };
        res.cookie("session", sessionCookie, options);
        res.end(JSON.stringify({ status: "success" }));
      },
      (error) => {
        res.status(401).send("UNAUTHORIZED REQUEST!");
      }
    );
});

router.get("/sessionLogout", (req, res) => {
  res.clearCookie("session");
  res.redirect("/auth/login");
});

module.exports = {router: router, loginRequired: loginRequired};
