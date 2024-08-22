require('dotenv').config({ path: '../.env' });

const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const multer=require('multer');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// app.use(express.json({limit:"16kb"}));
// app.use(express.urlencoded({extended:false},{limit:"16kb"}))



// security
const cors= require('cors');
const helmet=require('helmet');

app.use(helmet());

app.use(cors({
    origin: ["http://localhost:5173","https://ware-house-five.vercel.app"], 
    methods:["GET","POST","PUT","DELETE"],
    credentials:true,   
    // allowedHeaders: ['Content-Type', 'Authorization'],
}));


// port
const port=8081;
// process.env.PORT || 8081;


// database
require('./database/Warehouse.db');

app.get('/test/database',(req,res)=>{
 const isConnected= mongoose.connection.readyState===1;
 if(isConnected)
    {
        res.status(201).json({message : 'MongoDB connection is active'})
    }
 else
    {
        res.status(500).json({message : 'MongoDB connection is not active'})
    }
 }
)


// route
const registerRoute=require('./route/register.route');
const warehouseRoute=require('./route/warehouse.route');
app.use('/api',registerRoute);
app.use('/api',warehouseRoute);

app.get('/',(req,res)=>{
    res.send('Welcome to Warehouseing');
})

app.get('/test/port',(req,res,next)=>{
    res.status(201).send(`Secure Connection with port ${port}`);
})

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

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Handle Multer errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            return  res.status(413).json({
                status:0,
                data:"",
                statusCode : 413,
                message:'File size exceeds the limit, Upload an image of 1MB',
              });
            //  res.status(413).json({ message: 'File size exceeds the limit, Upload an image of 1MB' });
        }
        // Handle other Multer errors as needed
    } 
    
    if (err.message === 'Invalid file type. Only JPEG, PNG, and GIF files are allowed') {
            return  res.status(400).json({
                status:0,
                data:"",
                statusCode : 400,
                message: 'Invalid file type. Only JPEG, PNG, and GIF files are allowed.',
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
    else{

        const status=err.status || 0;        
        const statusCode = err.statusCode || 500; 
        const data=err.data || "";
        const message = err.message || 'Internal Server Error';
        return res.status(statusCode).json({
          status,
          data,
          statusCode,
          message,
        });    
    }

});


app.listen(port,()=>{
    console.log(`Connection with port ${port}`);
})