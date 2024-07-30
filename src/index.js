const express=require('express');
const app=express();
const bodyparser=require('body-parser');
const cookieParser=require('cookie-parser');

// security
const cors= require('cors');
const helmet=require('helmet');

const port=1010;

app.get('/',(req,res)=>{
    res.send('Welcome to Warehouseing')
})

app.listen(post,()=>{
    console.log(`Connection with port ${port}`);
})