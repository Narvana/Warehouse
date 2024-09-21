const express = require('express');
// const OtpModel = require("../model/");
const router = express.Router();

const {requestOtp,verifyOtp}=require("../controller/OTP.controller");

router.post('/request-otp', requestOtp);
router.post('/verify-otp', verifyOtp);

module.exports = router;
