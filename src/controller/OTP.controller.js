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
        if (!contactNo){
            return next(ApiErrors(400, 'Please enter your Contact number'));
        }
        let message= null;
        const check= await Register.findOne({contactNo,role:'LISTER'});
        if(!check)
        {
            // return next(ApiErrors(400, 'No Lister Found'));
            const user= new Register({
                contactNo,
                role: req.role                
            })
            // const data =
            await user.save();
            // return next(ApiResponses(201,data),`${username}`)
            message=`${contactNo} registered and OTP send to this Contact Number`;
        }
        else
        {
            message="OTP Generated and Sent to your Registered Contact No";
        }
        const otp = 111111; // const otp = generateOtp();

        // Save OTP to database
        const otpEntry = new Otp({ contactNo, otp });
        await otpEntry.save();

        // Send OTP to user
        // await sendOtp(contactNo, otp);

        return next(ApiResponses(200,[],message));

    } catch (error) {
        return next(ApiErrors(500,`${error.message}, ${error.stack}, ${error}`));
    }
}

const verifyOtp = async (req, res, next) => {

    const { contactNo, otp } = req.body;

    if (!contactNo || !otp) {
        return next(ApiErrors(400, 'Please enter both contact number and OTP'));
    }
    
    const user = await Register.findOne({contactNo }).select("-password -refreshToken");
    if(!user)
    {
        return next(ApiErrors(400,`${contactNo} Contact Number don't Exist. Either Enter a correct one or Register Yourself with this Contact Number.`)) 
    }
    else if(user.role !== req.role)
    {
        return next(ApiErrors(400,`Contact Number ${contactNo} is not assigned with ${req.role} role`))
    }

    const otpEntry = await Otp.findOne({ contactNo, otp });

    if (!otpEntry) {
        return next(ApiErrors(400, 'Invalid OTP or OTP expired'));
    }

    const accessToken = await generateAccessToken(user._id);
 
    const refreshToken=await generateRefreshToken(user._id);

    await Otp.deleteOne({ _id: otpEntry._id });

    return next(ApiResponses(200,{user,accessToken,refreshToken},`${user.role} Logged In Successfully`))
}

module.exports={
    requestOtp,
    verifyOtp
}

