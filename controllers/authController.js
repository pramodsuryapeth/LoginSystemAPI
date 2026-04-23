const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const transporter = require('../config/mail');
const asyncHandler = require('../middleware/asyncHandler');

exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const token = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    name,
    email,
    password: await bcrypt.hash(password, 10),
    profileImage: req.file?.path || "",
    verificationToken: token,
    verificationTokenExpire: Date.now() + 30 * 60 * 1000 
  });

 
const verifyURL = `${process.env.BASE_URL}/api/auth/verify/${token}`;

  // 📧 send mail
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification",
    html: `
      <h3>Verify your email</h3>
      <p>Click below link:</p>
      <a href="${verifyURL}">Verify Email</a>
    `
  });

  res.status(201).json({
    message: "User registered. Check your email to verify."
  });
});


exports.loginUser = async (req, res, next) => {
  const { email, password } = req.body;


  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("User not found");
    err.statusCode = 404;
    throw err;
  }


  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const err = new Error("Invalid credentials");
    err.statusCode = 400;
    throw err;
  }

 
  const token = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({
    message: "Login successful",
    token
  });
};

exports.getMe = async (req, res) => {
  res.json({
    user: req.user
  });
};


exports.verifyEmail = asyncHandler(async (req, res) => {
  const token = req.params.token;

  const user = await User.findOne({
    verificationToken: token,
    verificationTokenExpire: { $gt: Date.now() }
  });

  if (!user) {
    const err = new Error("Invalid or expired token");
    err.statusCode = 400;
    throw err;
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;

  await user.save();

  res.redirect(`${process.env.FRONTEND_URL}/verify-success`);
});
