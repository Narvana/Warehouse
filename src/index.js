const express=require('express');
const app=express();
const bodyparser=require('body-parser');
// const cookieParser=require('cookie-parser');

// security
const cors= require('cors');
const helmet=require('helmet');

// port
const port=1010;


// database
require('./database/Warehouse.db');
app.get('/test/database',(req,res)=>{
 const isConnected= mongoose.connection.readyState===1;
 if(isConnected){
     res.status(201).json({message :'MongoDB connection is active'})
 }
 else{
     res.status(500).json({message :'MongoDB connection is not active'})
 }
})


app.get('/',(req,res)=>{
    res.send('Welcome to Warehouseing')
})
app.get('/test/port',(req,res,next)=>{
    res.status(201).send(`Secure Connection with port ${port}`)
})

app.listen(port,()=>{
    console.log(`Connection with port ${port}`);
})