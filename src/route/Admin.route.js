const express = require('express');

const router=express.Router();

const verifyToken=require('../middleware/token/verifyToken');

const {verifyRole,verifyRoles}=require('../middleware/role/verifyRole');

// const upload=require('../middleware/ImageUpload/imageUploadMiddleware')

const AdminController=require('../controller/Admin.controller');

// All Warehouse and 3PL
router.get('/get/All/Listing',AdminController.allListing);

router.put('/Verified/Status',verifyToken.verify,verifyRole('ADMIN'),AdminController.UpdateVerifiedStatus);

router.put('/Featured/Status',verifyToken.verify,verifyRole('ADMIN'),AdminController
.UpdateFeatureStatus);

router.get('/Enquiry/List',AdminController.EnquiryList);

router.get('/Listers/List',AdminController.ListerList);

module.exports=router