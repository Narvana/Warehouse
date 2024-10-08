require('dotenv').config({ path: '../.env' });

const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const multer=require('multer');

app.use(bodyParser.json({ limit: '50mb' })); // Increase to a reasonable size
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
// app.use(express.json({limit:"16kb"}));
// app.use(express.urlencoded({extended:false},{limit:"16kb"}))


// security
const cors= require('cors');
const helmet=require('helmet');

app.use(cors({
    origin: ["http://localhost:5173","https://ware-house-five.vercel.app","https://warehouse-2.netlify.app","http://localhost:3000"],
    methods:["GET","POST","PUT","DELETE"],
    credentials:true,   
    // allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(helmet());

app.disable('x-powered-by');

// port
const port=8081; // process.env.PORT || 8081;

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
const PLWarehouseRoute=require('./route/3PLWarehouse.route');
const PLColdStorageRoute=require('./route/3PLColdstorage.route');
const AdminRoute=require('./route/Admin.route');
const FrontRoute=require('./route/Front.route')
const LandRoute = require('./route/Land.route');
const SmallSpace=require('./route/SmallSpace.route');
const OTP=require('./route/OTP.route');
app.use('/api',registerRoute);
app.use('/api',warehouseRoute);
app.use('/api',PLWarehouseRoute);
app.use('/api',PLColdStorageRoute);
app.use('/api/Land',LandRoute);
app.use('/api/Admin',AdminRoute);
app.use('/api/Front',FrontRoute);
app.use('/api/SmallSpace',SmallSpace);
app.use('/api/OTP',OTP);

app.get('/',(req,res)=>{
    res.send('Welcome to Warehousing');
})

app.get('/test/port',(req,res,next)=>{
    res.status(201).send(`Secure Connection with port ${port}`);
})

// error handling // multer error

app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Handle Multer errors
        if (err.code === 'LIMIT_FILE_SIZE') {
            return  res.status(413).json({
                status:0,
                data:"",
                statusCode : 413,
                message:`${err.message}, max limit is 5MB`,
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