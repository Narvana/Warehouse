const Otp = require("../model/OTP.model");  
const Register=require("../model/register.model");
const ApiErrors =require("../utils/ApiResponse/ApiErrors");
const ApiResponses = require("../utils/ApiResponse/ApiResponse");
const generateAccessToken=require('../middleware/token/generateAccessToken');
const generateRefreshToken=require('../middleware/token/generateRefreshToken');
// const generateOtp = () => {
//     return Math.floor(100000 + Math.random() * 900000); // Generates a 6-digit OTP
// }

// const sendOtp = async (contactNo, otp) => {
    // Use an SMS API to send OTP
    // Example with Twilio:
    // const message = await client.messages.create({
    //     body: `Your OTP is ${otp}`,
    //     from: 'YourTwilioNumber',
    //     to: contactNo
    // });
// }



const requestOtp = async (req, res, next) => {
    const { contactNo } = req.body;

    try {
        
    if (!contactNo) {
        return next(ApiErrors(400, 'Please enter your registered number'));
    }

    const check= await Register.findOne({contactNo,role:'LISTER'});
    if(!check)
    {
        return next(ApiErrors(400, 'No Lister Found'));
    }
    // const otp = generateOtp();
    const otp = 111111;
    // Save OTP to database
    const otpEntry = new Otp({ contactNo, otp });
    await otpEntry.save();
    // Send OTP to user
    // await sendOtp(contactNo, otp);
    return next(ApiResponses(200,[],'OTP Generated and Sent to your phone'));

    } catch (error) {
        
    if (!contactNo) {
        return next(ApiErrors(400, 'Please enter your registered number'));
    }
    const check= await Register.findOne({contactNo});
    if(!check)
    {
        return next(ApiErrors(400, 'No Lister Found'));
    }
    // const otp = generateOtp();
    const otp = 111111;
    // Save OTP to database
    const otpEntry = new Otp({ contactNo, otp });
    await otpEntry.save();
    // Send OTP to user
    // await sendOtp(contactNo, otp);
    return next(ApiResponses(200,[],'OTP Generated and Sent to your phone'));    
    }
}

const verifyOtp = async (req, res, next) => {
    const { contactNo, otp } = req.body;

    if (!contactNo || !otp) {
        return next(ApiErrors(400, 'Please enter both contact number and OTP'));
    }

    // Find OTP entry
    const otpEntry = await Otp.findOne({ contactNo, otp });

    if (!otpEntry) {
        return next(ApiErrors(400, 'Invalid OTP or OTP expired'));
    }

    const user = await Register.findOne({ contactNo }).select("-password -refreshToken");

    const accessToken = await generateAccessToken(user._id);
 
    const refreshToken=await generateRefreshToken(user._id);

    if (!user) {
        return next(ApiErrors(404, 'User not found'));
    }

    // await user.select("-password -refreshToken");

    await Otp.deleteOne({ _id: otpEntry._id });

    const options={
        httpOnly: true,
        secure:true
      }

      return res
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json(
       {
           message:"Lister Logged In Successfully",
           user:user,
           accessToken,
           refreshToken
       })
}

module.exports={
    requestOtp,
    verifyOtp
}

