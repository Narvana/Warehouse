const express = require('express');
// const OtpModel = require("../model/");
const router = express.Router();

const definerole=require('../middleware/role/defineRole');

const {verifyRole}=require('../middleware/role/verifyRole')
const {requestOtp,verifyOtp}=require("../controller/OTP.controller");
const defineRole = require('../middleware/role/defineRole');

router.post('/request-otp',defineRole('LISTER'), requestOtp);

router.post('/verify-otp',verifyRole('LISTER'),verifyOtp);

module.exports = router;
