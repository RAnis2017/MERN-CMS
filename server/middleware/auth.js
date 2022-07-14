const jwt = require("jsonwebtoken");
const config = require('../config');

const verifyToken = (req, res, next) => {
  const token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, config.TOKEN_KEY);
    req.user = decoded;

    let isAuthorized = false;
    req.user.permissions.forEach(permission => {
      let url = req.url.split("/")[1];
      
      if(config.PERMISSIONS[permission.label] && config.PERMISSIONS[permission.label].includes(url)) {
        isAuthorized = true;
      }
    })

    if(!isAuthorized) {
      return res.status(403).json({message: 'You are not authorized to access this resource. You are missing a vital permission.'});
    }

  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;