const mongoose= require('mongoose');
const validator=require('validator');

const otpSchema = new mongoose.Schema({
    contactNo: { type: String, required: true },
    otp: { type: String, required: true },
    // expiresAt: { type: Date, default: Date.now, index: { expires: '5m' } } // OTP expires in 5 minutes
    expiresAt: { type: Date, default: Date.now, index: { expires: '1m' } }

});

const Otp = mongoose.model('Otp', otpSchema);

module.exports= Otp;