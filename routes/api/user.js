const express = require("express");
const User = require("../../modules/User");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const passport = require("passport");
const secret = require("../../config/keys");
const router = express.Router();
const validateRegister = require("../../validation/register");
const validateLogin = require("../../validation/login");

router.get("/test", (req, res) => res.json({ msg: "Users works" }));

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegister(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      return res.status(400).json({ email: "Email already exists" });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200",
        r: "pg",
        d: "mm"
      });

      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        avatar
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, password) => {
          if (err) throw err;
          newUser.password = password;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(error => console.log(error));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLogin(req.body);
  if (!isValid) {
    errors.email = "User not found";
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (!user) {
      return res.status(404).json({ email: "User doesn't exist" });
    }

    bcrypt.compare(req.body.password, user.password).then(isMatch => {
      if (!isMatch) {
        return res.status(400).json({ password: "Incorrect password" });
      } else {
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        JWT.sign(payload, secret.SecretOrKey, (err, token) => {
          if (token) {
            res.json({
              success: true,
              token: "Bearer " + token
            });
          }
        });
      }
    });
  });
});

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json(req.user);
  }
);

module.exports = router;
