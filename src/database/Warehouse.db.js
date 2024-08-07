require('dotenv').config();
 
const mongoose = require('mongoose');

// const uri = process.env.MONGO_URI; 

// Define a function to connect to the database
const connectToDatabase = async () => {
  try {
   // Attempt to connect to MongoDB
    await mongoose.connect('mongodb+srv://warehouse:1Ware2House3ing@cluster0.gkp8oym.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the process with failure code
  }
};

// Call the function to connect to the database
connectToDatabase();
