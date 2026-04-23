const express = require('express');
const app = express();
const connectDB= require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors'); 
const errorHandler = require('./middleware/errorMiddleware');



dotenv.config();
connectDB();


app.use(cors({
  origin: process.env.FRONTEND_URL, 
  credentials: true
}));

// ✅ Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});


const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);


app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});