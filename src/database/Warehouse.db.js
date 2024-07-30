// require('dotenv').config();
// const mongoose=require('mongoose');
// //  require('')

// const uri=process.env.URI;

// mongoose.connect(uri)
// .then(()=>{
//     console.log('Connection Successful with MongoDB');
// })
// .catch((error)=>{
//     console.log(`No Connection with MongoDB. Error:${error}`);
// })

require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;

// Define a function to connect to the database
const connectToDatabase = async () => {
  try {
   // Attempt to connect to MongoDB
    await mongoose.connect(uri);
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1); // Exit the process with failure code
  }
};

// Call the function to connect to the database
connectToDatabase();
