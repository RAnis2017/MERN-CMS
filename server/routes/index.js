var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");
const config = require('../config');

//Middleware to log time for easy debugging when in development
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date().toLocaleString());
  next();
});

// Define the home page route
router.get('/', function(req, res) {
  res.status(200).json({'message': 'hello'});
});

router.post('login', function(req, res) {
  console.log(req.body);
  let username = req.body.username;
  let password = req.body.password;
  let user = mongoose.model('User');
  user.findOne({username: username}, function(err, user) {
    if (err) {
      console.log(err);
      res.status(500).json({'message': 'Internal server error'});
    } else if (!user) {
      res.status(401).json({'message': 'User not found'});
    } else {
      bcrypt.compare(password, user.password, function(err, result) {
        if (err) {
          console.log(err);
          res.status(500).json({'message': 'Internal server error'});
        } else if (!result) {
          res.status(401).json({'message': 'Password incorrect'});
        } else {
          const token = jwt.sign(
            { user_id: user._id, username },
            config.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
    
          user.token = token;
    
          res.status(200).json(user);
        }
      });
    }
  });
});

router.use(auth);

module.exports = router;