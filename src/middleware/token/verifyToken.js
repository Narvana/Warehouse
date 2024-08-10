// require('dotenv').config();
const jwt=require('jsonwebtoken')

// const secretKey=process.env.SECRET
const ApiErrors=require('../../utils/ApiResponse/ApiErrors');
const ApiResponse=require('../../utils/ApiResponse/ApiResponse');

// const cookieParser=require('cookie-parser')
// app.use(cookieParser());

const verify=(req,res,next)=>{
    // const authHeader = req.headers['authorization'];
    // const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    try {
        const token= req.cookies?.accessToken || req.headers['authorization']?.replace("Bearer ", "");

        // res.send({token});
        // console.log({token});
    
        if(!token)
        {
            return next(ApiErrors(401,'Unauthorized User, No Token Found'));
        }
        jwt.verify(token, 'xQJslU3ieVjhYt0xCUu8hhUGayx265KgfP4W0abHhvfJJA8xFO8cYVChPGhjz0JT4w1GP3vURXdXBk8jC2Hu4W49jz', (err,user)=>{
            if(err){
                return next(ApiErrors(401,"Unauthorized User, Incorrect Token"));
            }
            req.user=user;
            next();
        })
    
    } catch (error) {
        return next(ApiErrors(500,`Internal Server Error  -: ${error}`));
    } 
}

module.exports={
    verify,
}