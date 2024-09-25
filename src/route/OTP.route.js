const express = require('express');
// const OtpModel = require("../model/");
const router = express.Router();

const {verifyRole}=require('../middleware/role/verifyRole')
const {requestOtp,verifyOtp}=require("../controller/OTP.controller");

router.post('/request-otp', requestOtp);
router.post('/verify-otp',verifyRole('LISTER'),verifyOtp);

module.exports = router;
