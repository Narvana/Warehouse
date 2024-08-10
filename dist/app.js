"use strict";

require('dotenv').config({
  path: '../.env'
});
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var multer = require('multer');
// const cookieParser=require('cookie-parser');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
// app.use(express.json({limit:"16kb"}));
// app.use(express.urlencoded({extended:false},{limit:"16kb"}))

// security
var cors = require('cors');
var helmet = require('helmet');
app.use(cors({
  origin: ["http://localhost:5173", "https://ware-house-five.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
  // allowedHeaders: ['Content-Type', 'Authorization'],
}));

// port
var port = 8081;
// process.env.PORT || 8081;

// database
require('./database/Warehouse.db');
app.get('/test/database', function (req, res) {
  var isConnected = mongoose.connection.readyState === 1;
  if (isConnected) {
    res.status(201).json({
      message: 'MongoDB connection is active'
    });
  } else {
    res.status(500).json({
      message: 'MongoDB connection is not active'
    });
  }
});

// route
var registerRoute = require('./route/register.route');
var warehouseRoute = require('./route/warehouse.route');
app.use('/api', registerRoute);
app.use('/api', warehouseRoute);
app.get('/', function (req, res) {
  res.send('Welcome to Warehouseing');
});
app.get('/test/port', function (req, res, next) {
  res.status(201).send("Secure Connection with port ".concat(port));
});

// app.use((err, req, res, next) => {
// if (err instanceof multer.MulterError) {
//     // A Multer error occurred when uploading
//     if (err.code === 'LIMIT_FILE_SIZE') {
//         res.status(413).json({ message: 'File size exceeds the limit, Upload an image of 1MB' });
//     }
// } 
// else if (err.message === 'Invalid file type. Only JPEG, PNG, and GIF files are allowed.') {
//     res.status(400).json({ message: err.message });
// } 
// else {
//     res.status(500).json({ message: `Server error: ${err.message}` });
// }
// });

// error handling // multer error

app.use(function (err, req, res, next) {
  if (err instanceof multer.MulterError) {
    // Handle Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        status: 0,
        data: "",
        statusCode: 413,
        message: 'File size exceeds the limit, Upload an image of 1MB'
      });
      //  res.status(413).json({ message: 'File size exceeds the limit, Upload an image of 1MB' });
    }
    // Handle other Multer errors as needed
  }
  if (err.message === 'Invalid file type. Only JPEG, PNG, and GIF files are allowed') {
    return res.status(400).json({
      status: 0,
      data: "",
      statusCode: 400,
      message: 'Invalid file type. Only JPEG, PNG, and GIF files are allowed.'
    });
  }
  // else if(err.message && err.message.includes('ValidationError')) {
  //     // Extract error messages from Mongoose ValidationError
  //     // const errorMessages = Object.values(err.errors).map(error => error.message);

  //     return res.status(400).json({
  //         success: false,
  //         statusCode: 400,
  //         message: 'Validation Error',
  //         errors: err.message
  //     });
  // }
  else {
    var status = err.status;
    var statusCode = err.statusCode || 500;
    var data = err.data || "";
    var message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
      status: status,
      data: data,
      statusCode: statusCode,
      message: message
    });
  }
});
app.listen(port, function () {
  console.log("Connection with port ".concat(port));
});