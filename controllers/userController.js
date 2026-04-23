const User = require('../models/User');
const asyncHandler = require('../middleware/asyncHandler');

exports.getDashboard = asyncHandler(async (req, res, next) => {

  const userId = req.user.id;

  const user = await User.findById(userId).select('-password');

  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }

  res.status(200).json({
    success: true,
    message: "Welcome to dashboard",
    data: user
  });

});