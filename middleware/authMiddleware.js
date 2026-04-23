const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {

  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      throw err;
    }

    req.user = user;
    return next();

  }

  const err = new Error("Not authorized, no token");
  err.statusCode = 401;
  throw err;
};

module.exports = protect;