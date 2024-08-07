const jwt=require('jsonwebtoken');
const Register = require('../../model/register.model');
const ApiErrors=require('../../utils/ApiResponse/ApiErrors');

const generateAccessToken=async(id,req,res,next)=>{
    try {

           const user=await Register.findById(id)

            const accessToken= jwt.sign(
                {
                  id:user._id,
                  role:user.role,
                  firstname:user.firstname,
                  lastname:user.lastname,
                  username:user.username,
                  email:user.email
                },'xQJslU3ieVjhYt0xCUu8hhUGayx265KgfP4W0abHhvfJJA8xFO8cYVChPGhjz0JT4w1GP3vURXdXBk8jC2Hu4W49jz',{
                expiresIn:"1d",
            });

            return accessToken

    } catch (error) {
        // return next(ApiErrors(500,`Something went wrong while generating access token . Error: ${error}`)) 
        next(ApiErrors(500,`Something went wrong while generating access token . Error: ${error}`));
    }
}
module.exports=generateAccessToken 