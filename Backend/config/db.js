const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();
const uri = process.env.URI_MONDODB;
const connectDB = async () => {
  try {
    if (!uri) {
      console.error('MongoDB URI is not defined in the .env file');
    }
   
    await mongoose.connect(uri);    
    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;