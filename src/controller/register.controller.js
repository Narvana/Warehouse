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

    if(!password || password.trim() ==='')
    {
    return next(ApiErrors(400,`Password is required`))
    }
    try  
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
                    password : hashedPassword,
                    role : req.role
            })
    
            const data=await register.save()
            return next(ApiResponse(201,data,`${username} Registered Successfully`))
        }
        else{
            return next(ApiErrors(400,`Enter a valid password. Atleast Min 8 Character, 1 Uppercase, 1 Lowercase, 1 Special Character, 1 Number `));
        }
    } catch (error) {
        console.log({
            'Internal Serve Error, ' : error.message,
            error
            });
            
        if(error.name === 'ValidationError')
        {
            const errorMessages = Object.values(error.errors).map(error => error.message);
            return next(ApiErrors(500,errorMessages[0]));            
        }
        else if(error.code === 11000)
        {
            const cinMatch = error.errorResponse.errmsg.match(/"([^"]+)"/);
            // console.log(cinMatch[1]);
            if(error.errorResponse.errmsg.includes('contactNo'))
            {
                console.log(error);
                return next(ApiErrors(500, `This Contact no is already taken -: ${cinMatch[1]}`));
            }
            else if(error.errorResponse.errmsg.includes('email'))
            {
                return next(ApiErrors(500, `This email is already taken -: ${cinMatch[1]}`));
            }
            else if(error.errorResponse.errmsg.includes('username'))
            {
                return next(ApiErrors(500, `This email is already taken -: ${cinMatch[1]}`));
            }
        }
        else
        {
           
            return next(ApiErrors(500,`Internal Server Error, Error -: ${error} `));
        }
     }
}

const login=async(req,res,next)=>{
    const {email,password}=req.body;

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
 
               const loggedIn=await Register.findById(existingEmail._id).select("-password -refreshToken");
 
            //    const options={
            //      httpOnly: true,
            //      secure:true
            //    }

            //    return res
            //    .cookie("accessToken",accessToken,options)
            //    .cookie("refreshToken",refreshToken,options)
            //    .json(
            //     {
            //         user:loggedIn,
            //         accessToken,
            //         refreshToken
            //     }
            //     )
            return next(ApiResponse(200,{user:loggedIn,accessToken,refreshToken},`${req.role} Logged In Successfully`))
            }
        }
       }
    catch(error)
    {
        return next(ApiErrors(500,`${error.message}, ${error.stack}`));
    }

}

// const numberLogin=async(req,res,next)=>{
//     if(!req.body.contactNo || req.body.contactNo.trim().length > 0)
//     {
//         return next(ApiErrors(400,'Please Enter Your Registered Number'))
//     }
//     const data=await Register.findOne({contactNo});
// }

const profile=async(req,res,next)=>{
    try {
        const checkUser=await Register.findOne({_id:req.user.id}).select("-password -refreshToken");

        if(!checkUser)
        {
            return next(ApiErrors(401,"Unauthenticaed User. Your Data do not exist in the database"));   
        }
        
        if(req.user.id != checkUser._id)
        {
            return next(ApiErrors(401,"Unauthenticaed User. You cannot view this profile"));
        }
      
        return next(ApiResponse(201,checkUser,`${req.user.role} ${checkUser.username} Profile`));        
    } catch (error) {
        console.log(`Internal Server Error: ${error}`);
        return next(ApiErrors(500,`Internal Server Error: ${error.message}`));
    }    
}

const update=async(req,res,next)=>{
    const checkUser=await Register.findOne({_id:req.user.id});
    if(!checkUser)
    {
        return next(ApiErrors(401,"Unauthenticaed User. Your Data do not exist in the database"));   
    }
    
    if(req.user.id != checkUser._id)
    {
        return next(ApiErrors(401,"Unauthenticaed User. You cannot Update this profile")); 
    }

    try {
        const { firstname, lastname, username, contactNo, email} = req.body;

        if(!firstname && !lastname && !username && !contactNo && !email)
        {
            return next(ApiErrors(400,`Please Enter Data that you want to update`));
        }

       const userUpdate = await Register.findByIdAndUpdate
       (
            req.user.id,
            {
                $set:
                {
                    firstname: firstname,
                    lastname: lastname,
                    username: username,
                    contactNo: contactNo,
                    email: email,
                }
            },
            {
                new:true,
                runValidators:true,
            }
       );

        const {password, refreshToken, ...rest} = userUpdate._doc;

        return next(ApiResponse(201,rest,`${req.user.role} Profile Updated Successfully`));               

    } catch (error) {
        console.log({
            'Internal Serve Error, ' : error.message,
            error
            });
            
        if(error.name === 'ValidationError')
        {
            const errorMessages = Object.values(error.errors).map(error => error.message);
            return next(ApiErrors(500,errorMessages[0]));            
        }
        else if(error.code === 11000)
        {
            const cinMatch = error.errorResponse.errmsg.match(/"([^"]+)"/);
            // console.log(cinMatch[1]);
            if(error.errorResponse.errmsg.includes('contactNo'))
            {
                console.log(error);
                return next(ApiErrors(500, `This Contact no is already taken -: ${cinMatch[1]}`));
            }
            else if(error.errorResponse.errmsg.includes('email'))
            {
                return next(ApiErrors(500, `This email is already taken -: ${cinMatch[1]}`));
            }
            else if(error.errorResponse.errmsg.includes('username'))
            {
                return next(ApiErrors(500, `This email is already taken -: ${cinMatch[1]}`));
            }
        }
        else
        {
           
            return next(ApiErrors(500,`Internal Server Error, Error -: ${error} `));
        }
    }
}

// Change Password
const UpdatePassword=async(req,res,next)=>{
    const checkUser = await Register.findById(req.user.id);
    if (!checkUser) {
        return next(ApiErrors(401, "Unauthenticated User. Your data does not exist in the database"));
    }
    
    if (req.user.id !== checkUser._id.toString()) {
        return next(ApiErrors(401, "Unauthenticated User. You cannot update this profile"));
    }
    
    const { CurrentPassword, NewPassword } = req.body;
    
    if (!CurrentPassword ||  !CurrentPassword.trim() ) {
        return next(ApiErrors(400, "Current Password Feild is required"));
    }else if(!NewPassword || !NewPassword.trim())
    {
        return next(ApiErrors(400, "New Password Field is required"));
    }
    
    try 
    {
        const isPasswordCorrect = bcryptjs.compareSync(CurrentPassword, checkUser.password);
        if (!isPasswordCorrect) {
            return next(ApiErrors(400, "Your current password does not match. Enter the correct password"));
        }
        const isValidNewPassword = validatePassword(NewPassword);
        if (!isValidNewPassword) {
            return next(ApiErrors(400, "Enter a valid new password. At least Min 8 Characters, 1 Uppercase, 1 Lowercase, 1 Special Character, 1 Number"));
        }
        const hashedPassword = bcryptjs.hashSync(NewPassword, 10);
        const update = await Register.findByIdAndUpdate(
            req.user.id,
            {
                $set: { password: hashedPassword },
            },
            {
                new: true,
            }
        );
    
        if (update) {
            return next(ApiResponse(201,"",`${req.user.role} Password Updated Successfully`));  
        } else {
            return next(ApiErrors(400, "No user found with this ID"));
        }
    } catch (error) {
        return next(ApiErrors(500, `Error updating password: ${error.message}`));
    }    
}

const EmailCheck=async(req,res,next)=>{

    // const {email}= req.body;
    const email=req.query.email;

    if(!email)
    {
        return next(ApiErrors(400,`Please provide the email`));
    }

    const existense= await Register.findOne({email});

    if(existense)
    {
        return next(ApiErrors(400,`${email} email already exists. Please entry a different one`))
    }
    return next(ApiResponse(200,email,`${email} email is good to go`));
}

const ContactCheck=async(req,res,next)=>{

    const contactNo=req.query.contactNo;

    if(!contactNo)
    {
        return next(ApiErrors(400,`Please provide the Contact No`));
    }

    const existense= await Register.findOne({contactNo});

    if(existense)
    {
        return next(ApiErrors(400,`${contactNo} Contact Number already exists. Please entry a different one`))
    }
    return next(ApiResponse(200,contactNo,`${contactNo} Contact Number is good to go`));
}


module.exports={
    SignUp,
    login,
    profile,
    update,
    UpdatePassword,
    EmailCheck,
    ContactCheck
}