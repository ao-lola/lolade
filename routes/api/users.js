const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys"); //init keys folder for token

const User = require("./models/Users");

//@Route get api/users/test route
//@desc test users route

router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

//@Route get api/users/register
//@desc test users registration
//@access public
router.post("/register", (req, res) => {
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            return err;
          }
          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => console.log(err));
        });
      });
    }
  });
});

//@Route get api/users/login
//@desc test user login and generate JWT token
//@access private

router.post("/login", (req, res) => {
  //created variable email and password

  const email = req.body.email;
  const password = req.body.password;

  //find the user by email
  User.findOne({ email }).then(user => {
    //check for user
    if (!user) {
      return res.status(404).json({ email: "email not found" });
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //user matched
        const payLoad = { id: user.id, name: user.name };

        jwt.sign(payLoad, keys.secretOrKey, { expiresIn: 3600 });
      } else {
        return res.status(400).json({ password: "password incorrect" });
      }
    });
  });
});

module.exports = router;
