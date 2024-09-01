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
                }
                )
                // {
                //     "status":1,
                //     "statuscode":200,
                //     "data":[
                //         {user},
                //         {accessToken},
                //         {refreshToken}
                //     ],
                //     "message":`${user.username} logged in successfully`
                //  },
            }
        }
       }
    catch(error)
    {
        return next(ApiErrors(500,`${error.message}, ${error.stack}`));
    }

}

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
        return next(ApiResponse(201,checkUser,`Warehouse Lister ${checkUser.username} Profile`));        
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
                    username: username, // || req.user.username,
                    contactNo: contactNo, // || req.user.contactNo,
                    email: email, //|| req.user.email,
                }
            },
            {
                new:true,
                runValidators:true,
            }
       );

        const {password, refreshToken, ...rest} = userUpdate._doc;
        return next(ApiResponse(201,rest,"Updated Successfully"));

    } catch (error) {
        console.log(`Internal Server Error: ${error}`);
        return next(ApiErrors(500,`Internal Server Error: ${error.message}`)); 
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
    
    if (!CurrentPassword || !NewPassword || !CurrentPassword.trim() || !NewPassword.trim()) {
        return next(ApiErrors(400, "All fields are required"));
    }
    
    try {
        const isPasswordCorrect = bcryptjs.compareSync(CurrentPassword, checkUser.password);
        if (!isPasswordCorrect) {
            return next(ApiErrors(400, "Your current password does not match the one in the database. Enter the correct password"));
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
            return next(ApiResponse(200,"", "Password updated successfully"));
        } else {
            return next(ApiErrors(400, "No user found with this ID"));
        }
    } catch (error) {
        return next(ApiErrors(500, `Error updating password: ${error.message}`));
    }    
}

module.exports={
    SignUp,
    login,
    profile,
    update,
    UpdatePassword
}