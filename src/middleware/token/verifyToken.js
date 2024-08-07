// require('dotenv').config();
const jwt=require('jsonwebtoken')
// const secretKey=process.env.SECRET

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
            return res.status(400).send('Unauthorized User, No Token Found')
        }
        jwt.verify(token, 'xQJslU3ieVjhYt0xCUu8hhUGayx265KgfP4W0abHhvfJJA8xFO8cYVChPGhjz0JT4w1GP3vURXdXBk8jC2Hu4W49jz', (err,user)=>{
            if(err){
                return res.status(400).send(`Unauthorized User, Token Don't Matches`,)
            }
            req.user=user;
            next();
        })
    
    } catch (error) {
        res.status(500).json({error})   
    }
}

module.exports={
    verify,
}