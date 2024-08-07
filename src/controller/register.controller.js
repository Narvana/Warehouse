require('dotenv').config();

const Register=require('../model/register.model');
const jwt=require('jsonwebtoken');
const bcryptjs=require('bcryptjs');
const validatePassword=require('../middleware/passwordValidation');
const generateAccessToken=require('../middleware/token/generateAccessToken');
const generateRefreshToken=require('../middleware/token/generateRefreshToken');
const ApiErrors=require('../utils/ApiResponse/ApiErrors');
const ApiResponse=require('../utils/ApiResponse/ApiResponse');

const SignUp=async(req,res,next)=>{
    const {firstname,lastname,username,contactNo,email,password} = req.body;

    if(!firstname || 
        !lastname ||
        !username || 
        !email ||
        !contactNo ||
        !password ||
        firstname.trim() ==='' || 
        lastname.trim() ==='' ||
        username.trim() ===''|| 
        contactNo.trim() ===''|| 
        email.trim() ==='' ||
        password.trim() ==='')
     {
        return next(ApiErrors(400,`All Fields are required`))
     }

     let existingUsername;
     let existingEmail;
     let existingContact;

     try {

      existingUsername = await Register.findOne({username});
      existingEmail = await Register.findOne({email});
      existingContact = await Register.findOne({contactNo});
       
     if(existingEmail){
      return next(ApiErrors(400,`${email} email already exist. Enter a new one.`))
      }
      else if(existingUsername){
         return next(ApiErrors(400,`${username} username already exist. Enter a new one.`))
      }
      else if(existingContact){
      return next(ApiErrors(400,`${contactNo} Contact Number already exist. Enter a new one.`))
      }
      else
      {
      const isValidPassword=validatePassword(password)

      if(isValidPassword){
          const hashedPassword=bcryptjs.hashSync(password,10);
              const register=new Register({
                  firstname,
                  lastname,
                  username,
                  contactNo,
                  email,
                  password:hashedPassword,
                  role: req.role
          })
  
          const data=await register.save()
          return next(ApiResponse(201,
              data,
              `${username} Registered Successfully`))
      }
      else{
          return next(ApiErrors(400,`Enter a valid password. Atleast Min 8 Character, 1 Uppercase, 1 Lowercase, 1 Special Character, 1 Number `));
      }
   }
     } catch (error) {
         if(error.name === 'ValidationError')
         {
             const errorMessages = Object.values(error.errors).map(error => error.message);
             return next(ApiErrors(500,errorMessages[0]));            
         }
        return next(ApiErrors(500,error))
     }

}

const login=async(req,res,next)=>{
    const {email,password}=req.body;

    if(!email || !password || email.trim()==="" || password.trim()===""){
        return next(ApiErrors(400,`All Fields are required`))
    }
    let existingEmail;
    try {
         existingEmail = await Register.findOne({email})
         if(!existingEmail){
            return next(ApiErrors(400,`${email} email don't Exist. Either Enter a correct one or Register Yourself with this email.`))
         }
         else if(existingEmail.role !== req.role)
         {
            return next(ApiErrors(400,`email ${email} is not assigned with ${req.role} role`))
         }
         else
         {
            const checkPassword=bcryptjs.compareSync(password,existingEmail.password)
            if (!checkPassword) {
              return next(ApiErrors(400,`Wrong Password, Try Again`))
              } 
            else {
               const accessToken = await generateAccessToken(existingEmail._id)
 
               const refreshToken=await generateRefreshToken(existingEmail._id)
 
               const loggedIn=await Register.findById(existingEmail._id).select("-password -refreshToken")
 
               const options={
                 httpOnly: true,
                 secure:true
               }
 
               return res
               .cookie("accessToken",accessToken,options)
               .cookie("refreshToken",refreshToken,options)
               .json(
                 {
                   user:loggedIn,
                   accessToken,
                   refreshToken               
                 },
             )
            }
        }
       }
    catch(error)
    {
    return next(ApiErrors(500,error))
    }

}


module.exports={
    SignUp,
    login
}