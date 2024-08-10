const path = require('path');

// require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

require('dotenv').config({ path: '../.env' });

const mongoose = require('mongoose');

const uri = process.env.URI; 

const connectToDatabase = async () => {
  try {
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the process with failure code
  }
};

connectToDatabase();
