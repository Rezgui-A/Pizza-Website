const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/UserRoute');
const orderRoutes = require('./routes/orderRoutes'); // Import order routes
const protect = require('./Middleware/authMiddleware');
dotenv.config();
connectDB();
const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
}));

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

app.use(express.json()); // Pour analyser les requêtes JSON

// Routes

app.use('/api/user', authRoutes);
app.use('/api/orders', orderRoutes); // Add order routes here

const port = process.env.PORT;
app.listen(port,()=> console.log(`server run in port ${port}`));