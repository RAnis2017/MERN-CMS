var express = require('express');
var router = express.Router();
const mongoose = require("mongoose");

//Middleware to log time for easy debugging when in development
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date().toLocaleString());
  next();
});

// Define the home page route
router.get('/', function(req, res) {
  res.status(200).json({'message': 'hello'});
});


module.exports = router;