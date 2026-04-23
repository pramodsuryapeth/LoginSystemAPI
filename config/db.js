const mongoose = require('mongoose');

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGODB_URI);

  if (!conn) {
    const err = new Error("MongoDB connection failed");
    err.statusCode = 500;
    throw err;
  }

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};

module.exports = connectDB;