const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys"); //init keys folder for token
const passport = require("passport");

//Load input validation
const validateRegisterInput = require("../../validator/register");

//Load login validation
const validateLoginInput = require("../../validator/login");
//Load User Model
const User = require("./models/Users");
//const User = require('../api/models/Users')

//@Route get api/users/test route
//@desc test users route

router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

//@Route get api/users/register
//@desc test users registration
//@access public
router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  //check validation

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "Email already exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        is_admin: req.body.is_admin
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
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  //created variable email and password

  const email = req.body.email;
  const password = req.body.password;

  //find the user by email
  User.findOne({ email }).then(user => {
    //check for user
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }
    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        //user matched
        const payLoad = { id: user.id, firstname: user.firstname };

        jwt.sign(
          payLoad,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: token
            });
          }
        );
      } else {
        errors.password = "Password Incorrect";
        return res.status(400).json(errors);
      }
    });
  });
});

router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    let id = req.params.id;
    console.log("id:", id);
    User.findOne({ _id: id }, (err, user) => {
      if (err) {
        console.log("error:", err);
        return res.status(500).json({
          error: "Oops an error occurred"
        });
      }

      if (!user) {
        return res.status(400).json({
          error: "Unable to find user"
        });
      } else {
        Object.assign(user, req.body);
        user.save((err, savedUser) => {
          if (err) {
            console.log("user error:", err);
            return res.status(500).json({
              error: "Oops an error occurred"
            });
          }

          if (savedUser) {
            return res.status(200).json({
              message: "User successfully updated",
              data: savedUser
            });
          }
        });
      }
    });
  }
);

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({ id: req.body.id });
  }
);

router.get("/verify", (req, res) => {
  let token = req.headers["authorization"];
  jwt.verify(token, "mykey", (err, decoded) => {
    if (err) {
      let message = "";
      if (err.name) {
        switch (err.name) {
          case "TokenExpiredError":
            message = lang.get("error").token_expired;
            break;
          default:
            message = lang.get("error").token_auth_failed;
        }
      }
      return res.json({
        status: false,
        message: "Authorization declined"
      });
    } else {
      let firstname = decoded.firstname;
      return res.json({
        status: true,
        message: "Authorization Successful " + firstname
      });
    }
  });
});

module.exports = router;
