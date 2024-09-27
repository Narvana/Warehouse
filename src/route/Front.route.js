const express = require('express');

const router=express.Router();

const {verify}=require('../middleware/token/verifyToken');


const FrontController=require('../controller/Front.controller');

router.get('/get/All/Listing',FrontController.AllListing)

// router.get('/get/All/Verified',FrontController.AllVerified);

router.get('/get/All/Featured',FrontController.AllFeatured);

router.get('/get/Search',FrontController.searchWareHouseAll);

router.get('/get/Recent/Warehouse',FrontController.recentWarehouse);

router.post('/Send/Enquiry',verify(['LISTER', 'ADMIN']),FrontController.SendEnquiry);

router.post('/Send/Requirement',FrontController.SendRequirement);

router.get('/All/SmallSpace',FrontController.AllSmallSpace);

module.exports=router