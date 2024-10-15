const express = require('express');

const router=express.Router();

const {verify}=require('../middleware/token/verifyToken');

// const {verifyRoles}=require('../middleware/role/verifyRole');

const AdminController=require('../controller/Admin.controller');

// All Warehouse and 3PL
router.get('/get/All/Listing',verify(['ADMIN']),AdminController.allListing);

router.put('/Verified/Status',verify(['ADMIN']),AdminController.UpdateVerifiedStatus);

router.put('/Featured/Status',verify(['ADMIN']),AdminController.UpdateFeatureStatus);

router.get('/Enquiry/List',verify(['ADMIN']),AdminController.EnquiryList);

router.get('/Image/Enquiry/List',verify(['ADMIN']),AdminController.ImageEnquiryList);

router.get('/Listers/List',verify(['ADMIN']),AdminController.ListerList);

router.delete('/Remove/Enquiry',verify(['ADMIN']),AdminController.RemoveEnquiry);

router.delete('/Remove/Listing',verify(['ADMIN']),AdminController.RemoveListing);

router.get('/Requirement/List',verify(['ADMIN']),AdminController.RequirementList);

router.delete('/Remove/Requirement',verify(['ADMIN']),AdminController.RemoveRequirement);

router.delete('/Remove/Lister',verify(['ADMIN']),AdminController.RemoveLister);

router.get('/Get/Log',verify(['ADMIN']),AdminController.GetLog);

module.exports=router